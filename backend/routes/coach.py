from __future__ import annotations

from typing import Any, Dict

from fastapi import APIRouter
from pydantic import BaseModel

from backend.services.gemini import GeminiCoachService
from backend.services.predictor import PerformancePredictorService

router = APIRouter(prefix='/coach', tags=['coach'])


class CoachRequest(BaseModel):
    userId: str


class CoachResponse(BaseModel):
    motivation: str
    explanation: str
    dailyPlan: list[str]
    recommendedGames: list[str]
    estimatedImprovement: str
    personalizedTips: list[str]


predictor_service = PerformancePredictorService()
gemini_service = GeminiCoachService()


@router.post('', response_model=CoachResponse)
def generate_coach(payload: CoachRequest) -> Dict[str, Any]:
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
    prediction = predictor_service.predict(features)
    coach_payload = gemini_service.generate_coaching_payload(prediction, features)
    return coach_payload
