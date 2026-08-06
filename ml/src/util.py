"""
util.py

Shared utility functions used across the Student Mental Health
Analyzer pipeline and its API layer:

- Normalizing/validating raw questionnaire input before it reaches
  the preprocessing + prediction pipeline
- Turning numeric scores into human-readable labels (using the
  thresholds already defined in config.py)
- Formatting the final report into a clean, JSON-friendly shape
  for the frontend
"""

from src.config import (
    EXCELLENT_THRESHOLD,
    GOOD_THRESHOLD,
    MODERATE_THRESHOLD,
)
from src.preprocessing import (
    GENDER_MAP,
    SLEEP_MAP,
    DIET_MAP,
    YES_NO_MAP,
    DEGREE_COLUMNS,
)


# ============================================================
# API <-> Internal Field Name Mapping
# ============================================================
# The ML pipeline (preprocessing.py, wellbeing.py) expects the
# exact column names from the original training dataset (e.g.
# "Academic Pressure", "Have you ever had suicidal thoughts ?").
# The API accepts friendlier snake_case field names. This map is
# the single place that translates between the two, so both a web
# request and a plain Python dict work with the same function.

FIELD_ALIASES = {
    "gender": "Gender",
    "age": "Age",
    "academic_pressure": "Academic Pressure",
    "work_pressure": "Work Pressure",
    "cgpa": "CGPA",
    "study_satisfaction": "Study Satisfaction",
    "job_satisfaction": "Job Satisfaction",
    "sleep_duration": "Sleep Duration",
    "dietary_habits": "Dietary Habits",
    "degree": "Degree",
    "suicidal_thoughts": "Have you ever had suicidal thoughts ?",
    "work_study_hours": "Work/Study Hours",
    "financial_stress": "Financial Stress",
    "family_history_mental_illness": "Family History of Mental Illness",
}

REQUIRED_FIELDS = list(FIELD_ALIASES.values())

# Degree values the model was trained on, derived from the one-hot
# columns in preprocessing.py so this never drifts out of sync.
DEGREE_OPTIONS = sorted(col.replace("Degree_", "") for col in DEGREE_COLUMNS)

# Fields that must be numbers, with their valid (inclusive) range.
# Fields other than CGPA and Work/Study Hours are cast to int since
# they're used as dict keys elsewhere in the pipeline (1-5 scales).
NUMERIC_RANGE_FIELDS = {
    "Age": (10, 100),
    "Academic Pressure": (1, 5),
    "Work Pressure": (1, 5),
    "CGPA": (0, 10),
    "Study Satisfaction": (1, 5),
    "Job Satisfaction": (1, 5),
    "Work/Study Hours": (0, 24),
    "Financial Stress": (1, 5),
}
FLOAT_FIELDS = {"CGPA", "Work/Study Hours"}

# Fields that must match one of a fixed set of category strings.
CATEGORICAL_FIELDS = {
    "Gender": set(GENDER_MAP),
    "Sleep Duration": set(SLEEP_MAP),
    "Dietary Habits": set(DIET_MAP),
    "Have you ever had suicidal thoughts ?": set(YES_NO_MAP),
    "Family History of Mental Illness": set(YES_NO_MAP),
    "Degree": set(DEGREE_OPTIONS),
}


# ============================================================
# Input Normalization + Validation
# ============================================================

def normalize_student_input(data):
    """
    Accept a raw dict keyed by either snake_case API field names
    (e.g. "academic_pressure") or the original dataset column names
    (e.g. "Academic Pressure"), and return a dict keyed by the
    original column names with values cast to the right types.

    Raises
    ------
    ValueError
        With every problem found (missing fields, bad types, out of
        range values, invalid categories) joined into one message,
        so the caller can show it all at once instead of one field
        at a time.
    """

    normalized = {
        FIELD_ALIASES.get(key, key): value
        for key, value in data.items()
    }

    errors = []

    missing = [f for f in REQUIRED_FIELDS if f not in normalized]
    if missing:
        errors.append(f"Missing required field(s): {', '.join(missing)}")
        # Can't safely validate further without the missing fields.
        raise ValueError("; ".join(errors))

    for field, (low, high) in NUMERIC_RANGE_FIELDS.items():
        try:
            value = float(normalized[field])
        except (TypeError, ValueError):
            errors.append(f"'{field}' must be a number.")
            continue

        if not (low <= value <= high):
            errors.append(f"'{field}' must be between {low} and {high}.")
            continue

        normalized[field] = value if field in FLOAT_FIELDS else int(value)

    for field, allowed in CATEGORICAL_FIELDS.items():
        if normalized[field] not in allowed:
            errors.append(
                f"'{field}' must be one of {sorted(allowed)}, "
                f"got {normalized[field]!r}."
            )

    if errors:
        raise ValueError("; ".join(errors))

    return normalized


# ============================================================
# Score Labeling
# ============================================================

def get_score_label(score):
    """
    Convert a 0-100 score into a human-readable label using the
    thresholds already defined in config.py.
    """

    if score >= EXCELLENT_THRESHOLD:
        return "Excellent"
    elif score >= GOOD_THRESHOLD:
        return "Good"
    elif score >= MODERATE_THRESHOLD:
        return "Moderate"
    else:
        return "Poor"


# ============================================================
# Report Formatting
# ============================================================

def enrich_report(report):
    """
    Take the raw report from `recommendation_engine.analyze_student`
    and shape it for the frontend: adds a label to every score,
    turns the "Weakest Indicators" tuples into named objects, and
    attaches a short disclaimer.
    """

    indicators = report["Health Indicators"]

    labeled_indicators = {
        category: {"score": score, "label": get_score_label(score)}
        for category, score in indicators.items()
    }

    weakest = [
        {"category": category, "score": score, "label": get_score_label(score)}
        for category, score in report["Weakest Indicators"]
    ]

    return {
        "prediction": report["Prediction"],
        "probability": report["Probability"],
        "overall_wellbeing_score": report["Overall Well-being Score"],
        "overall_wellbeing_label": get_score_label(
            report["Overall Well-being Score"]
        ),
        "health_indicators": labeled_indicators,
        "weakest_indicators": weakest,
        "recommendations": report["Recommendations"],
        "disclaimer": (
            "This is a screening estimate based on self-reported data, "
            "not a clinical diagnosis. If you're struggling, please "
            "reach out to a counselor or mental health professional."
        ),
    }
