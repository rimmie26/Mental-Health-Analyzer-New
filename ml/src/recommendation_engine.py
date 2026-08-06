"""
recommendation_engine.py

Generates personalized recommendations and the final student
mental health report by combining:

- Depression Prediction
- Overall Well-being Score
- Health Indicators
- Personalized Recommendations
"""

from src.predictor import predict_student
from src.wellbeing import generate_wellbeing_report


# ============================================================
# Recommendation Knowledge Base
# ============================================================

RECOMMENDATIONS = {

    "Academic Health": [

        "Break large academic tasks into smaller, manageable goals.",

        "Create a consistent study schedule with regular breaks.",

        "Seek academic support from professors, mentors, or classmates.",

        "Focus on understanding concepts instead of memorization."
    ],

    "Sleep Health": [

        "Aim for 7–8 hours of quality sleep each night.",

        "Maintain a consistent sleep schedule.",

        "Avoid screens at least 30 minutes before bedtime.",

        "Limit caffeine intake during the evening."
    ],

    "Lifestyle Health": [

        "Include more nutritious meals in your daily routine.",

        "Drink sufficient water throughout the day.",

        "Exercise regularly, even a short walk helps.",

        "Reduce junk food and sugary drinks."
    ],

    "Mental Well-being": [

        "Talk to a trusted friend, family member, or mentor about how you're feeling.",

        "Practice stress-management techniques such as meditation or deep breathing.",

        "Take regular breaks from academic work.",

        "Consider speaking with a mental health professional if distress persists."
    ],

    "Financial Well-being": [

        "Create a monthly budget to manage expenses.",

        "Explore scholarships or financial aid opportunities.",

        "Discuss financial concerns with trusted family members.",

        "Avoid unnecessary spending whenever possible."
    ]
}


# ============================================================
# Weakest Health Indicators
# ============================================================

def weakest_health_indicators(indicators, top_n=2):
    """
    Return the weakest health indicators.
    """

    return sorted(
        indicators.items(),
        key=lambda x: x[1]
    )[:top_n]


# ============================================================
# Recommendation Generator
# ============================================================

def generate_recommendations(indicators):
    """
    Generate recommendations based on the weakest health indicators.
    """

    weakest = weakest_health_indicators(indicators)

    recommendations = []

    for category, score in weakest:

        recommendations.extend(RECOMMENDATIONS.get(category, []))

    # Remove duplicates while preserving order
    recommendations = list(dict.fromkeys(recommendations))

    return recommendations


# ============================================================
# Final Report Builder
# ============================================================

def build_report(student, wellbeing_report, prediction, probability):
    """
    Build the complete student report.
    """

    indicators = wellbeing_report["Health Indicators"]

    weakest = weakest_health_indicators(indicators)

    recommendations = generate_recommendations(indicators)

    return {

        "Prediction": "Likely Depression" if prediction else "No Depression",

        "Probability": round(probability * 100, 2),

        "Overall Well-being Score":
            wellbeing_report["Overall Well-being Score"],

        "Health Indicators":
            indicators,

        "Weakest Indicators":
            weakest,

        "Recommendations":
            recommendations

    }


# ============================================================
# Main Pipeline
# ============================================================

def analyze_student(student):
    """
    Complete inference pipeline.

    Parameters
    ----------
    student : dict

    Returns
    -------
    dict
        Final Mental Health Report.
    """

    prediction, probability = predict_student(student)

    wellbeing_report = generate_wellbeing_report(student)

    report = build_report(
        student,
        wellbeing_report,
        prediction,
        probability
    )

    return report