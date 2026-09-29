from __future__ import annotations

from pathlib import Path
from typing import Any

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from backend.database import get_db
from backend.models.feedback_models import (
    AnalyticsSummary,
    FeedbackCreate,
    FeedbackResponse,
)
from backend.services.feedback_service import FeedbackService

router = APIRouter(prefix='/api/feedback', tags=['feedback'])


@router.post('', response_model=FeedbackResponse)
def submit_feedback(payload: FeedbackCreate, db: Session = Depends(get_db)) -> Any:
    service = FeedbackService(db)
    try:
        return service.create_feedback(payload)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@router.get('/analytics', response_model=AnalyticsSummary)
def feedback_analytics(db: Session = Depends(get_db)) -> Any:
    service = FeedbackService(db)
    return service.get_summary()


@router.get('/export', response_class=FileResponse)
def export_feedback(db: Session = Depends(get_db)) -> FileResponse:
    service = FeedbackService(db)
    destination = Path(__file__).resolve().parent.parent / 'feedback_report.xlsx'
    file_path = service.export_feedback_report(destination)
    return FileResponse(
        path=str(file_path),
        filename='feedback_report.xlsx',
        media_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    )
