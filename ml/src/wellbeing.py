"""
wellbeing.py

Utility functions for calculating student health indicators and
the Overall Well-being Score.
"""

import numpy as np

from src.preprocessing import SLEEP_MAP, DIET_MAP, YES_NO_MAP


# ============================================================
# Scoring Dictionaries
# ============================================================

academic_pressure_score = {
    1: 100,
    2: 80,
    3: 60,
    4: 40,
    5: 20
}

study_satisfaction_score = {
    1: 20,
    2: 40,
    3: 60,
    4: 80,
    5: 100
}

sleep_score = {
    0: 25,    # Less than 5 hours
    1: 60,    # 5–6 hours
    2: 100,   # 7–8 hours
    3: 85     # More than 8 hours
}

diet_score = {
    0: 30,    # Unhealthy
    1: 70,    # Moderate
    2: 100    # Healthy
}

mental_score = {
    0: 100,   # No suicidal thoughts
    1: 20     # Yes
}

financial_score = {
    1: 100,
    2: 80,
    3: 60,
    4: 40,
    5: 20
}


# ============================================================
# Helper Functions
# ============================================================

def cgpa_score(cgpa):
    """
    Convert CGPA (out of 10) to a percentage score.
    """
    return (cgpa / 10) * 100


def study_hours_score(hours):
    """
    Assign a wellness score based on study hours.
    """

    if hours <= 2:
        return 60

    elif hours <= 5:
        return 100

    elif hours <= 8:
        return 80

    else:
        return 50


# ============================================================
# Health Indicator Calculation
# ============================================================

def calculate_wellness(student):
    """
    Calculate all Health Indicator scores.

    Parameters
    ----------
    student : dict
        Raw questionnaire responses (same shape used by
        preprocessing.preprocess_input — categorical fields like
        "Sleep Duration" are the original strings, not yet encoded).

    Returns
    -------
    dict
    """

    academic = np.mean([
        academic_pressure_score[student["Academic Pressure"]],
        study_satisfaction_score[student["Study Satisfaction"]],
        cgpa_score(student["CGPA"]),
        study_hours_score(student["Work/Study Hours"])
    ])

    # These three fields are still raw category strings at this
    # point (e.g. "7-8 hours"), so they need the same encoding maps
    # preprocessing.py uses before they can index the score dicts.
    sleep = sleep_score[
        SLEEP_MAP[student["Sleep Duration"]]
    ]

    lifestyle = diet_score[
        DIET_MAP[student["Dietary Habits"]]
    ]

    mental = mental_score[
        YES_NO_MAP[student["Have you ever had suicidal thoughts ?"]]
    ]

    financial = financial_score[
        student["Financial Stress"]
    ]

    return {
        "Academic Health": round(academic, 2),
        "Sleep Health": round(sleep, 2),
        "Lifestyle Health": round(lifestyle, 2),
        "Mental Well-being": round(mental, 2),
        "Financial Well-being": round(financial, 2)
    }


# ============================================================
# Overall Well-being Report
# ============================================================

from src.config import CATEGORY_WEIGHTS

def generate_wellbeing_report(student):
    """
    Generate the complete Well-being Report.

    Parameters
    ----------
    student : dict
        Dictionary containing the student's questionnaire responses.

    Returns
    -------
    dict
        Overall Well-being Score and individual Health Indicator scores.
    """

    # Calculate individual Health Indicators
    health_indicators = calculate_wellness(student)

    # Compute weighted Overall Well-being Score
    overall_score = sum(
        health_indicators[category] * CATEGORY_WEIGHTS[category]
        for category in CATEGORY_WEIGHTS
    )

    return {
        "Overall Well-being Score": round(overall_score, 2),
        "Health Indicators": health_indicators
    }
