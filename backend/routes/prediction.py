from __future__ import annotations

from typing import Any, Dict

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from backend.services.predictor import PerformancePredictorService

router = APIRouter(prefix='/predict', tags=['prediction'])


class PredictionRequest(BaseModel):
    userId: str


class PredictionResponse(BaseModel):
    brainScore: float
    predictedScore: float
    strongestSkill: str
    weakestSkill: str
    trend: str
    confidence: float


service = PerformancePredictorService()


@router.post('', response_model=PredictionResponse)
def predict(payload: PredictionRequest) -> Dict[str, Any]:
    try:
        features = {
            'avg_accuracy': 78.0,
            'avg_score': 82.0,
            'avg_reaction_time': 1.4,
            'avg_completion_time': 190.0,
            'games_played': 24.0,
            'daily_streak': 7.0,
            'logic_score': 74.0,
            'memory_score': 69.0,
            'math_score': 81.0,
            'puzzle_score': 76.0,
            'improvement_rate': 0.14,
        }
        return service.predict(features)
    except FileNotFoundError as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc
