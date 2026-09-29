from __future__ import annotations

from datetime import datetime
from enum import Enum

from pydantic import BaseModel, Field, conint, constr
from sqlalchemy import Column, DateTime, Enum as SAEnum, Integer, String, Text
from sqlalchemy.orm import declarative_base

Base = declarative_base()


class ImprovementArea(str, Enum):
    Memory = 'Memory'
    Logic = 'Logic'
    Math = 'Math'
    Speed = 'Speed'
    UI_UX = 'UI/UX'
    Difficulty = 'Difficulty'
    Rewards = 'Rewards'
    Bugs = 'Bugs'
    Other = 'Other'


class Recommendation(str, Enum):
    Yes = 'Yes'
    Maybe = 'Maybe'
    No = 'No'


class Feedback(Base):
    __tablename__ = 'feedback'

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String(128), nullable=False, index=True)
    game_name = Column(String(128), nullable=False, index=True)
    challenge_rating = Column(Integer, nullable=False)
    enjoyment_rating = Column(Integer, nullable=False)
    improvement_area = Column(SAEnum(ImprovementArea), nullable=False)
    recommendation = Column(SAEnum(Recommendation), nullable=False)
    feedback_text = Column(Text, nullable=True)
    timestamp = Column(DateTime, nullable=False, default=datetime.utcnow)


class FeedbackCreate(BaseModel):
    user_id: constr(strip_whitespace=True, min_length=1, max_length=128)
    game_name: constr(strip_whitespace=True, min_length=1, max_length=128)
    challenge_rating: conint(ge=1, le=5)
    enjoyment_rating: conint(ge=1, le=5)
    improvement_area: ImprovementArea
    recommendation: Recommendation
    feedback_text: constr(strip_whitespace=True, max_length=1000) = ''
    timestamp: datetime = Field(default_factory=datetime.utcnow)


class FeedbackResponse(BaseModel):
    id: int
    user_id: str
    game_name: str
    challenge_rating: int
    enjoyment_rating: int
    improvement_area: ImprovementArea
    recommendation: Recommendation
    feedback_text: str
    timestamp: datetime

    class Config:
        orm_mode = True


class AnalyticsSummary(BaseModel):
    total_feedback_count: int
    average_challenge_rating: float
    average_enjoyment_rating: float
    positive_count: int
    negative_count: int
    maybe_count: int
    most_selected_improvement_area: str | None
    most_recommended_game: str | None
