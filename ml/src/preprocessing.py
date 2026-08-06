"""
preprocessing.py

Converts raw student questionnaire responses into the feature format
expected by the trained Logistic Regression model.
"""

import pandas as pd


# ============================================================
# Category Mappings
# ============================================================

GENDER_MAP = {
    "Male": 1,
    "Female": 0
}

SLEEP_MAP = {
    "Less than 5 hours": 0,
    "5-6 hours": 1,
    "7-8 hours": 2,
    "More than 8 hours": 3
}

DIET_MAP = {
    "Unhealthy": 0,
    "Moderate": 1,
    "Healthy": 2
}

YES_NO_MAP = {
    "No": 0,
    "Yes": 1
}


# ============================================================
# Degree Columns
# ============================================================

DEGREE_COLUMNS = [

    "Degree_B.Arch",
    "Degree_B.Com",
    "Degree_B.Ed",
    "Degree_B.Pharm",
    "Degree_B.Tech",
    "Degree_BA",
    "Degree_BBA",
    "Degree_BCA",
    "Degree_BE",
    "Degree_BHM",
    "Degree_BSc",
    "Degree_LLB",
    "Degree_LLM",
    "Degree_M.Com",
    "Degree_M.Ed",
    "Degree_M.Pharm",
    "Degree_M.Tech",
    "Degree_MA",
    "Degree_MBA",
    "Degree_MBBS",
    "Degree_MCA",
    "Degree_MD",
    "Degree_ME",
    "Degree_MHM",
    "Degree_MSc",
    "Degree_Others",
    "Degree_PhD"

]


# ============================================================
# Training Column Order
# ============================================================

MODEL_COLUMNS = [

    "Gender",
    "Age",
    "Academic Pressure",
    "CGPA",
    "Study Satisfaction",
    "Sleep Duration",
    "Dietary Habits",
    "Have you ever had suicidal thoughts ?",
    "Work/Study Hours",
    "Financial Stress",
    "Family History of Mental Illness",

    *DEGREE_COLUMNS

]


# ============================================================
# Preprocessing Function
# ============================================================

def preprocess_input(student):

    """
    Convert raw questionnaire input into model-ready dataframe.
    """

    student = student.copy()

    # -----------------------------
    # Encode categorical variables
    # -----------------------------

    student["Gender"] = GENDER_MAP[student["Gender"]]

    student["Sleep Duration"] = SLEEP_MAP[student["Sleep Duration"]]

    student["Dietary Habits"] = DIET_MAP[student["Dietary Habits"]]

    student["Have you ever had suicidal thoughts ?"] = YES_NO_MAP[
        student["Have you ever had suicidal thoughts ?"]
    ]

    student["Family History of Mental Illness"] = YES_NO_MAP[
        student["Family History of Mental Illness"]
    ]


    # -----------------------------
    # Create dataframe
    # -----------------------------

    df = pd.DataFrame([student])


    # -----------------------------
    # One-hot encode Degree
    # -----------------------------

    df = pd.get_dummies(df, columns=["Degree"])


    # -----------------------------
    # Add missing Degree columns
    # -----------------------------

    for col in DEGREE_COLUMNS:

        if col not in df.columns:

            df[col] = 0


    # -----------------------------
    # Ensure column order
    # -----------------------------

    df = df[MODEL_COLUMNS]

    return df