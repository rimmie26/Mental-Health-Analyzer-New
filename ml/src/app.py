"""
app.py

FastAPI backend for the Student Mental Health Analyzer.

Exposes a single POST endpoint that runs the full pipeline
(prediction -> well-being scoring -> recommendations) and returns
a JSON report your frontend can render directly.

Run from the project root (the folder that contains this file and
the `src/` package):

    uvicorn app:app --reload --port 8000

Then POST to http://localhost:8000/analyze
"""

import os

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, ConfigDict, Field, confloat, conint

from src.config import API_TITLE, API_VERSION, API_DESCRIPTION
from src.recommendation_engine import analyze_student
from src.util import normalize_student_input, enrich_report, DEGREE_OPTIONS


# ============================================================
# App Setup
# ============================================================

app = FastAPI(
    title=API_TITLE,
    version=API_VERSION,
    description=API_DESCRIPTION,
)

# Only the Express server calls this API (never the browser directly),
# so CORS can be locked down to just that origin. Override with the
# CORS_ORIGINS env var (comma-separated) if Express runs somewhere
# other than the default dev port. Once this service is deployed
# behind Express, it doesn't need to be reachable from the public
# internet at all - only from Express's host.
_default_origins = "http://localhost:4000,http://127.0.0.1:4000"
allowed_origins = [
    origin.strip()
    for origin in os.environ.get("CORS_ORIGINS", _default_origins).split(",")
    if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# Request Schema
# ============================================================
# Field names are snake_case for a clean JSON API, but each one is
# aliased to the exact column name the ML pipeline expects, and
# `populate_by_name=True` means either spelling works in a request
# body. Numeric ranges are enforced here for fast, clear 422s;
# category values (Gender, Degree, etc.) are checked in
# src.util.normalize_student_input against the same lists the model
# was trained on, so there's one source of truth for valid options.

class StudentInput(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    gender: str = Field(alias="Gender", description="'Male' or 'Female'")
    age: conint(ge=10, le=100) = Field(alias="Age")
    academic_pressure: conint(ge=1, le=5) = Field(alias="Academic Pressure")
    work_pressure: conint(ge=1, le=5) = Field(alias="Work Pressure")
    cgpa: confloat(ge=0, le=10) = Field(alias="CGPA")
    study_satisfaction: conint(ge=1, le=5) = Field(alias="Study Satisfaction")
    job_satisfaction: conint(ge=1, le=5) = Field(alias="Job Satisfaction")
    sleep_duration: str = Field(
        alias="Sleep Duration",
        description="'Less than 5 hours' | '5-6 hours' | '7-8 hours' | 'More than 8 hours'",
    )
    dietary_habits: str = Field(
        alias="Dietary Habits", description="'Unhealthy' | 'Moderate' | 'Healthy'"
    )
    degree: str = Field(
        alias="Degree", description=f"One of: {', '.join(DEGREE_OPTIONS)}"
    )
    suicidal_thoughts: str = Field(
        alias="Have you ever had suicidal thoughts ?", description="'Yes' or 'No'"
    )
    work_study_hours: confloat(ge=0, le=24) = Field(alias="Work/Study Hours")
    financial_stress: conint(ge=1, le=5) = Field(alias="Financial Stress")
    family_history_mental_illness: str = Field(
        alias="Family History of Mental Illness", description="'Yes' or 'No'"
    )


# ============================================================
# Routes
# ============================================================

@app.get("/health")
def health_check():
    """Simple liveness check, useful for uptime monitoring."""
    return {"status": "ok"}


@app.get("/options")
def get_options():
    """
    Valid values for every categorical field, so the frontend can
    build dropdowns without hardcoding them separately.
    """
    return {
        "gender": ["Male", "Female"],
        "sleep_duration": [
            "Less than 5 hours",
            "5-6 hours",
            "7-8 hours",
            "More than 8 hours",
        ],
        "dietary_habits": ["Unhealthy", "Moderate", "Healthy"],
        "degree": DEGREE_OPTIONS,
        "yes_no": ["Yes", "No"],
    }


@app.post("/analyze")
def analyze(student: StudentInput):
    """
    Run the full pipeline on one student's questionnaire responses
    and return the prediction, well-being score, and recommendations.
    """

    raw = student.model_dump(by_alias=True)

    try:
        cleaned = normalize_student_input(raw)
        report = analyze_student(cleaned)
        return enrich_report(report)

    except ValueError as e:
        # Bad/out-of-range input that slipped past pydantic (or a
        # caller that skipped it) -> tell the client exactly what's wrong.
        raise HTTPException(status_code=422, detail=str(e))

    except Exception:
        # Anything unexpected (e.g. a model file issue) shouldn't leak
        # internals to the client.
        raise HTTPException(
            status_code=500,
            detail="Something went wrong while analyzing the response.",
        )
