from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.database import init_db
from backend.routes.coach import router as coach_router
from backend.routes.feedback import router as feedback_router
from backend.routes.prediction import router as prediction_router

app = FastAPI(title='Matiks AI Coach API', version='1.0.0')

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

app.include_router(prediction_router)
app.include_router(coach_router)
app.include_router(feedback_router)

@app.on_event('startup')
def on_startup() -> None:
    init_db()

@app.get('/health')
def health() -> dict[str, str]:
    return {'status': 'ok'}
