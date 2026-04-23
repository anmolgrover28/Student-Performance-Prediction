"""
FastAPI ML service for Student Performance Prediction.
Loads a pre-trained Random Forest model and serves predictions via /predict.
"""

import pickle
import numpy as np
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

app = FastAPI(title="Student Performance ML Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model on startup
try:
    with open("model.pkl", "rb") as f:
        data = pickle.load(f)
    MODEL = data["model"]
    SCALER = data["scaler"]
    print("Model loaded successfully.")
except FileNotFoundError:
    raise RuntimeError("model.pkl not found. Run train_model.py first.")


class PredictionInput(BaseModel):
    attendance: float = Field(..., ge=0, le=100)
    marks: float = Field(..., ge=0, le=100)
    study_hours: float = Field(..., ge=0, le=24)
    previous_performance: float = Field(..., ge=0, le=100)


def build_suggestions(attendance, marks, study_hours, previous_performance, result):
    tips = []
    if attendance < 75:
        tips.append("Improve attendance to at least 75% — consistent presence is key to academic success.")
    if marks < 40:
        tips.append("Focus on internal assessments; scoring above 40 in internals is essential to pass.")
    if study_hours < 3:
        tips.append("Dedicate at least 3-4 hours of focused study daily to strengthen your understanding.")
    if previous_performance < 50:
        tips.append("Review past exam mistakes and practice previous year papers to boost performance.")
    if result == "PASS" and attendance >= 85 and marks >= 70:
        tips.append("Excellent performance! Maintain this consistency and aim for distinction.")
    elif result == "PASS":
        tips.append("Good job! Keep improving to reach the top grade band.")
    if not tips:
        tips.append("Keep up the steady effort — consistent work leads to great results.")
    return tips


@app.get("/health")
def health():
    return {"status": "ML service running"}


@app.post("/predict")
def predict(data: PredictionInput):
    features = np.array([[
        data.attendance,
        data.marks,
        data.study_hours,
        data.previous_performance,
    ]])

    try:
        proba = MODEL.predict_proba(features)[0]
        pass_prob = float(proba[1])
        result = "PASS" if pass_prob >= 0.5 else "FAIL"
        probability = round(pass_prob * 100, 2)

        suggestions = build_suggestions(
            data.attendance, data.marks,
            data.study_hours, data.previous_performance,
            result
        )

        return {
            "result": result,
            "probability": probability,
            "suggestions": suggestions,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
