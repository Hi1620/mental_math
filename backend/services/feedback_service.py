from __future__ import annotations

from collections import Counter
from pathlib import Path
from typing import Any

from openpyxl import Workbook
from sqlalchemy import case, func
from sqlalchemy.orm import Session

from backend.models.feedback_models import (
    Feedback,
    FeedbackCreate,
    ImprovementArea,
    Recommendation,
)


class FeedbackService:
    def __init__(self, db_session: Session):
        self.db = db_session

    def create_feedback(self, payload: FeedbackCreate) -> Feedback:
        record = Feedback(
            user_id=payload.user_id,
            game_name=payload.game_name,
            challenge_rating=payload.challenge_rating,
            enjoyment_rating=payload.enjoyment_rating,
            improvement_area=payload.improvement_area,
            recommendation=payload.recommendation,
            feedback_text=payload.feedback_text,
            timestamp=payload.timestamp,
        )
        self.db.add(record)
        self.db.commit()
        self.db.refresh(record)
        return record

    def get_summary(self) -> dict[str, Any]:
        total = self.db.query(func.count(Feedback.id)).scalar() or 0
        average_challenge = self.db.query(func.avg(Feedback.challenge_rating)).scalar() or 0.0
        average_enjoyment = self.db.query(func.avg(Feedback.enjoyment_rating)).scalar() or 0.0

        recommendation_counts = dict(
            self.db.query(Feedback.recommendation, func.count(Feedback.id))
            .group_by(Feedback.recommendation)
            .all()
        )

        area_counts = dict(
            self.db.query(Feedback.improvement_area, func.count(Feedback.id))
            .group_by(Feedback.improvement_area)
            .all()
        )

        recommended_games = self.db.query(
            Feedback.game_name,
            func.count(Feedback.id).label('count'),
        )
        recommended_games = recommended_games.filter(Feedback.recommendation == Recommendation.Yes)
        recommended_games = recommended_games.group_by(Feedback.game_name).order_by(func.count(Feedback.id).desc()).all()

        most_recommended_game = recommended_games[0][0] if recommended_games else None
        most_selected_area = max(area_counts.items(), key=lambda pair: pair[1])[0] if area_counts else None

        return {
            'total_feedback_count': total,
            'average_challenge_rating': float(round(average_challenge, 2)),
            'average_enjoyment_rating': float(round(average_enjoyment, 2)),
            'positive_count': recommendation_counts.get(Recommendation.Yes, 0),
            'negative_count': recommendation_counts.get(Recommendation.No, 0),
            'maybe_count': recommendation_counts.get(Recommendation.Maybe, 0),
            'most_selected_improvement_area': most_selected_area,
            'most_recommended_game': most_recommended_game,
        }

    def export_feedback_report(self, destination: str | Path) -> Path:
        destination_path = Path(destination)
        workbook = Workbook()
        data_sheet = workbook.active
        data_sheet.title = 'Feedback Data'

        headers = [
            'Feedback ID',
            'User ID',
            'Game Name',
            'Challenge Rating',
            'Enjoyment Rating',
            'Improvement Area',
            'Recommend',
            'Feedback Text',
            'Timestamp',
        ]
        data_sheet.append(headers)

        feedback_rows = self.db.query(Feedback).order_by(Feedback.id).all()
        for row in feedback_rows:
            data_sheet.append([
                row.id,
                row.user_id,
                row.game_name,
                row.challenge_rating,
                row.enjoyment_rating,
                row.improvement_area.value,
                row.recommendation.value,
                row.feedback_text,
                row.timestamp.isoformat(),
            ])

        analytics = self.get_summary()
        summary_sheet = workbook.create_sheet('Analytics Summary')
        summary_sheet.append(['Metric', 'Value'])
        summary_sheet.append(['Total feedback count', analytics['total_feedback_count']])
        summary_sheet.append(['Average challenge rating', analytics['average_challenge_rating']])
        summary_sheet.append(['Average enjoyment rating', analytics['average_enjoyment_rating']])
        summary_sheet.append(['Positive feedback count', analytics['positive_count']])
        summary_sheet.append(['Negative feedback count', analytics['negative_count']])
        summary_sheet.append(['Maybe feedback count', analytics['maybe_count']])
        summary_sheet.append(['Most selected improvement area', analytics['most_selected_improvement_area'] or 'N/A'])
        summary_sheet.append(['Most recommended game', analytics['most_recommended_game'] or 'N/A'])

        destination_path.parent.mkdir(parents=True, exist_ok=True)
        workbook.save(destination_path)
        return destination_path
