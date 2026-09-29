from __future__ import annotations

import os
from typing import Any, Dict

import requests


class GeminiCoachService:
    """Service that wraps Gemini text generation for coaching insights."""

    def __init__(self, api_key: str | None = None) -> None:
        self.api_key = api_key or os.getenv('GEMINI_API_KEY')
        self.base_url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent'

    def generate_coaching_payload(self, prediction: Dict[str, Any], stats: Dict[str, Any]) -> Dict[str, Any]:
        if not self.api_key:
            return self._fallback_payload(prediction, stats)

        prompt = self._build_prompt(prediction, stats)
        response = requests.post(
            f'{self.base_url}?key={self.api_key}',
            json={
                'contents': [
                    {
                        'parts': [
                            {
                                'text': prompt,
                            }
                        ]
                    }
                ],
                'generationConfig': {
                    'temperature': 0.7,
                    'topP': 0.9,
                    'maxOutputTokens': 600,
                },
            },
            timeout=20,
        )
        response.raise_for_status()
        data = response.json()
        text = data['candidates'][0]['content']['parts'][0]['text']
        return self._parse_json(text)

    def _build_prompt(self, prediction: Dict[str, Any], stats: Dict[str, Any]) -> str:
        return f"""
You are a world-class brain training coach. Create a structured JSON payload for a premium coaching experience.

Prediction:
- predictedScore: {prediction.get('predictedScore')}
- strongestSkill: {prediction.get('strongestSkill')}
- weakestSkill: {prediction.get('weakestSkill')}
- trend: {prediction.get('trend')}
- confidence: {prediction.get('confidence')}

Player statistics:
- averageAccuracy: {stats.get('avg_accuracy')}
- averageScore: {stats.get('avg_score')}
- reactionTime: {stats.get('avg_reaction_time')}
- completionTime: {stats.get('avg_completion_time')}
- gamesPlayed: {stats.get('games_played')}
- streak: {stats.get('daily_streak')}
- logicScore: {stats.get('logic_score')}
- memoryScore: {stats.get('memory_score')}
- mathScore: {stats.get('math_score')}
- puzzleScore: {stats.get('puzzle_score')}
- improvementRate: {stats.get('improvement_rate')}

Return ONLY JSON with keys:
motivation, explanation, dailyPlan, recommendedGames, estimatedImprovement, personalizedTips.
Each value should be a string or an array of strings as appropriate.
"""

    def _parse_json(self, text: str) -> Dict[str, Any]:
        import json

        cleaned = text.strip()
        if cleaned.startswith('```'):
            cleaned = cleaned.removeprefix('```json').removeprefix('```').removesuffix('```').strip()
        return json.loads(cleaned)

    def _fallback_payload(self, prediction: Dict[str, Any], stats: Dict[str, Any]) -> Dict[str, Any]:
        weakest = prediction.get('weakestSkill', 'Memory')
        strongest = prediction.get('strongestSkill', 'Logic')
        return {
            'motivation': f"You are building momentum. Your next session can push your {strongest.lower()} performance even higher.",
            'explanation': f"Your model projects a strong {prediction.get('predictedScore')} score with the biggest opportunity in {weakest}.",
            'dailyPlan': [
                'Complete one focused session today',
                'Spend 10 minutes on your weakest skill',
                'End with a short reflection on your improvement',
            ],
            'recommendedGames': [
                'Memory Forest',
                'Math Sprint',
                'Logic Arena',
            ],
            'estimatedImprovement': f"+{max(2, int(stats.get('improvement_rate', 0) * 10))}% this week",
            'personalizedTips': [
                'Short, repeated sessions beat long, inconsistent ones.',
                'Prioritize calm accuracy before speed.',
                'Use hints sparingly to build independence.',
            ],
        }
