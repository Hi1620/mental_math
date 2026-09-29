from __future__ import annotations

import os
import pickle
import shap
from pathlib import Path

import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import (
    mean_squared_error,
    mean_absolute_error,
    r2_score
)
from sklearn.model_selection import train_test_split
from sklearn.model_selection import cross_val_score

ROOT = Path(__file__).resolve().parent.parent
DATASET_PATH = ROOT / 'ml' / 'dataset.csv'
MODEL_PATH = ROOT / 'backend' / 'models' / 'performance_predictor.pkl'


def train_model() -> dict[str, float]:
    df = pd.read_csv(DATASET_PATH)
    feature_columns = [
        "avg_accuracy",
        "avg_score",
        "avg_reaction_time",
        "avg_completion_time",
        "games_played",
        "daily_streak",
        "logic_score",
        "memory_score",
        "math_score",
        "puzzle_score",
        "improvement_rate",

        "avg_hints_used",
        "avg_mistakes",
        "longest_streak",
        "session_duration",
        "consistency_score",
        "difficulty_level",
        "reaction_variance",
        "days_active_last30",
        "games_this_week",
        "completion_rate",
        "focus_score",
        "fatigue_score"
    ]
    target_columns = [
    "overall_brain_score",
    "next_score",
    "memory_growth",
    "reaction_growth",
    "logic_growth"
]

    X = df[feature_columns]
    y = df[target_columns]
    X_train, X_test, y_train, y_test = train_test_split(X, y, random_state=42, shuffle=True)

    model = RandomForestRegressor(
    n_estimators=300,
    max_depth=15,
    min_samples_split=5,
    min_samples_leaf=2,
    random_state=42,
    n_jobs=-1
)
    model.fit(X_train, y_train)
    feature_importance = dict(
    zip(
        feature_columns,
        model.feature_importances_
        )
    )
    predictions = model.predict(X_test)
    # Overall Brain Score metrics
    mse = mean_squared_error(
        y_test["overall_brain_score"],
        predictions[:, 0]
    )

    rmse = mse ** 0.5

    mae = mean_absolute_error(
        y_test["overall_brain_score"],
        predictions[:, 0]
    )

    r2 = r2_score(
        y_test["overall_brain_score"],
        predictions[:, 0]
    )

    MODEL_PATH.parent.mkdir(parents=True, exist_ok=True)
    with MODEL_PATH.open('wb') as handle:
        pickle.dump({
    "model": model,
    "feature_columns": feature_columns,
    "target_columns": target_columns,
    "version": "1.0",
    "trained_at": datetime.now().isoformat(),
    "metrics": {
        "rmse": rmse,
        "mae": mae,
        "r2": r2
    }
}, handle)

    return {
    "mse": float(mse),
    "rmse": float(rmse),
    "mae": float(mae),
    "r2_score": float(r2),
    "model_path": str(MODEL_PATH)
}


if __name__ == '__main__':
    print(train_model())
