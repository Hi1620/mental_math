from __future__ import annotations

import os
import pickle
from typing import Any, Dict, List

import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error
from sklearn.model_selection import train_test_split


MODEL_PATH = os.path.join(os.path.dirname(__file__), '..', 'models', 'performance_predictor.pkl')
DATASET_PATH = os.path.join(os.path.dirname(__file__), '..', '..', 'ml', 'dataset.csv')


class PerformancePredictorService:
    """Machine learning service for brain performance prediction."""

    def __init__(self, model_path: str = MODEL_PATH) -> None:
        self.model_path = model_path
        self.model: RandomForestRegressor | None = None
        self.metadata: Dict[str, Any] | None = None

    def _load_dataset(self) -> pd.DataFrame:
        if not os.path.exists(DATASET_PATH):
            raise FileNotFoundError(f"Training dataset not found at {DATASET_PATH}")
        return pd.read_csv(DATASET_PATH)

    def train(self) -> Dict[str, float]:
        df = self._load_dataset()
        feature_columns = [
            'avg_accuracy',
            'avg_score',
            'avg_reaction_time',
            'avg_completion_time',
            'games_played',
            'daily_streak',
            'logic_score',
            'memory_score',
            'math_score',
            'puzzle_score',
            'improvement_rate',
        ]
        target_columns = ['overall_brain_score', 'next_score']

        X = df[feature_columns]
        y = df[target_columns]

        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

        model = RandomForestRegressor(n_estimators=220, max_depth=10, random_state=42)
        model.fit(X_train, y_train)

        predictions = model.predict(X_test)
        mse = mean_squared_error(y_test['overall_brain_score'], predictions[:, 0])

        os.makedirs(os.path.dirname(self.model_path), exist_ok=True)
        with open(self.model_path, 'wb') as fh:
            pickle.dump(
                {
                    'model': model,
                    'feature_columns': feature_columns,
                    'target_columns': target_columns,
                },
                fh,
            )

        self.model = model
        self.metadata = {
            'feature_columns': feature_columns,
            'target_columns': target_columns,
        }
        return {'mse': float(mse)}

    def _load_model(self) -> Dict[str, Any]:
        if not os.path.exists(self.model_path):
            raise FileNotFoundError('Model not trained yet. Run training first.')
        with open(self.model_path, 'rb') as fh:
            return pickle.load(fh)

    def predict(self, features: Dict[str, float]) -> Dict[str, Any]:
        payload = self._load_model()
        model: RandomForestRegressor = payload['model']
        feature_columns: List[str] = payload['feature_columns']

        frame = pd.DataFrame([features])[feature_columns]
        prediction = model.predict(frame)[0]

        brain_score = float(prediction[0])
        predicted_score = float(prediction[1])
        trend_value = max(-1.0, min(1.0, (predicted_score - brain_score) / 100.0))

        strongest_skill, weakest_skill = self._infer_skills(features)
        confidence = self._estimate_confidence(features, brain_score, predicted_score)

        return {
            'brainScore': round(brain_score, 2),
            'predictedScore': round(predicted_score, 2),
            'strongestSkill': strongest_skill,
            'weakestSkill': weakest_skill,
            'trend': self._format_trend(trend_value),
            'confidence': round(confidence, 2),
        }

    def _infer_skills(self, features: Dict[str, float]) -> tuple[str, str]:
        skill_scores = {
            'Math': features.get('math_score', 0.0),
            'Memory': features.get('memory_score', 0.0),
            'Logic': features.get('logic_score', 0.0),
            'Puzzle': features.get('puzzle_score', 0.0),
        }
        strongest_skill = max(skill_scores, key=skill_scores.get)
        weakest_skill = min(skill_scores, key=skill_scores.get)
        return strongest_skill, weakest_skill

    def _estimate_confidence(self, features: Dict[str, float], brain_score: float, predicted_score: float) -> float:
        signal = sum(
            [
                features.get('games_played', 0.0) / 20.0,
                features.get('daily_streak', 0.0) / 10.0,
                max(0.0, min(1.0, (brain_score + predicted_score) / 200.0)),
            ]
        )
        return round(min(0.99, max(0.55, signal / 3.0)), 2)

    def _format_trend(self, trend_value: float) -> str:
        if trend_value > 0.08:
            return 'upward'
        if trend_value < -0.08:
            return 'downward'
        return 'steady'
