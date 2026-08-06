"""
config.py

Configuration file for the Student Mental Health Analyzer.

This module centralizes:
- Project paths
- Dataset paths
- Model paths
- Feature importance paths
- Well-being score weights
- Project metadata
"""

from pathlib import Path


# ============================================================
# Project Information
# ============================================================

PROJECT_NAME = "Student Mental Health Analyzer"

VERSION = "1.0.0"

MODEL_NAME = "Logistic Regression"

RANDOM_STATE = 42


# ============================================================
# Directory Structure
# ============================================================

# ml/
BASE_DIR = Path(__file__).resolve().parent.parent

# ml/data/
DATA_DIR = BASE_DIR / "data"

# ml/data/raw/
RAW_DATA_DIR = DATA_DIR / "raw"

# ml/data/processed/
PROCESSED_DATA_DIR = DATA_DIR / "processed"

# ml/models/
MODELS_DIR = BASE_DIR / "models"

# ml/notebooks/
NOTEBOOKS_DIR = BASE_DIR / "notebooks"

# ml/src/
SRC_DIR = BASE_DIR / "src"


# ============================================================
# Dataset Files
# ============================================================

RAW_DATA_PATH = RAW_DATA_DIR / "students_dataset.csv"

CLEAN_DATA_PATH = PROCESSED_DATA_DIR / "clean_students_dataset.csv"


# ============================================================
# Model Files
# ============================================================

MODEL_PATH = MODELS_DIR / "best_model.pkl"

PREPROCESSOR_PATH = MODELS_DIR / "preprocessor.pkl"

FEATURE_IMPORTANCE_PATH = MODELS_DIR / "feature_importance.csv"


# ============================================================
# Machine Learning Configuration
# ============================================================

TARGET_COLUMN = "Depression"

FEATURE_COLUMNS = [
    "Gender",
    "Age",
    "Academic Pressure",
    "Work Pressure",
    "CGPA",
    "Study Satisfaction",
    "Job Satisfaction",
    "Sleep Duration",
    "Dietary Habits",
    "Degree",
    "Have you ever had suicidal thoughts ?",
    "Work/Study Hours",
    "Financial Stress",
    "Family History of Mental Illness",
]


# ============================================================
# Overall Well-being Score Weights
# (Derived from Logistic Regression Feature Importance)
# ============================================================

CATEGORY_WEIGHTS = {

    # Academic Pressure + Study Satisfaction + CGPA + Work/Study Hours
    "Academic Health": 0.2503,

    # Sleep Duration
    "Sleep Health": 0.0363,

    # Dietary Habits
    "Lifestyle Health": 0.1080,

    # Suicidal Thoughts
    "Mental Well-being": 0.4951,

    # Financial Stress
    "Financial Well-being": 0.1103
}


# ============================================================
# Health Indicator Categories
# ============================================================

HEALTH_INDICATORS = [
    "Academic Health",
    "Sleep Health",
    "Lifestyle Health",
    "Mental Well-being",
    "Financial Well-being"
]


# ============================================================
# Prediction Labels
# ============================================================

PREDICTION_LABELS = {
    0: "No Depression",
    1: "Likely Depression"
}


# ============================================================
# Recommendation Thresholds
# ============================================================

EXCELLENT_THRESHOLD = 85

GOOD_THRESHOLD = 70

MODERATE_THRESHOLD = 50

POOR_THRESHOLD = 0


# ============================================================
# API Configuration (For Future Deployment)
# ============================================================

API_TITLE = "Student Mental Health Analyzer API"

API_VERSION = VERSION

API_DESCRIPTION = (
    "API for predicting depression risk, calculating "
    "overall well-being scores, and generating "
    "personalized recommendations for students."
)