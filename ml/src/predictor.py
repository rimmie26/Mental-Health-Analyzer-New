import joblib

from src.config import MODEL_PATH
from src.preprocessing import preprocess_input

model = joblib.load(MODEL_PATH)


def predict_student(student):

    processed = preprocess_input(student)

    prediction = model.predict(processed)[0]

    probability = model.predict_proba(processed)[0][1]

    return prediction, probability