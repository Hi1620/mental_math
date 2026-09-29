'use client'

import { Send, X } from 'lucide-react'
import { useMemo, useState } from 'react'

const improvementOptions = [
  'Memory',
  'Logic',
  'Math',
  'Speed',
  'UI/UX',
  'Difficulty',
  'Rewards',
  'Bugs',
  'Other',
] as const

const recommendationOptions = ['Yes', 'Maybe', 'No'] as const

const API_BASE = process.env.NEXT_PUBLIC_FEEDBACK_API_URL ?? 'http://127.0.0.1:8000'

const getStoredUserId = () => {
  if (typeof window === 'undefined') return 'anonymous-user'
  const storageKey = 'matiks-feedback-user-id'
  let userId = window.localStorage.getItem(storageKey)
  if (!userId) {
    userId = `matiks-${Math.random().toString(36).slice(2, 10)}`
    window.localStorage.setItem(storageKey, userId)
  }
  return userId
}

interface FeedbackModalProps {
  gameName: string
  onClose: () => void
}

export function FeedbackModal({ gameName, onClose }: FeedbackModalProps) {
  const [challengeRating, setChallengeRating] = useState<number | null>(null)
  const [enjoymentRating, setEnjoymentRating] = useState<number | null>(null)
  const [improvementArea, setImprovementArea] = useState<string>(improvementOptions[0])
  const [recommendation, setRecommendation] = useState<string | null>(null)
  const [feedbackText, setFeedbackText] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const canSubmit = useMemo(
    () => challengeRating !== null && enjoymentRating !== null && recommendation !== null,
    [challengeRating, enjoymentRating, recommendation]
  )

  const handleSubmit = async () => {
    if (!canSubmit) {
      setError('Please answer all required questions before submitting.')
      return
    }

    setSubmitting(true)
    setError('')

    try {
      const response = await fetch(`${API_BASE}/api/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: getStoredUserId(),
          game_name: gameName,
          challenge_rating: challengeRating,
          enjoyment_rating: enjoymentRating,
          improvement_area: improvementArea,
          recommendation,
          feedback_text: feedbackText,
        }),
      })

      if (!response.ok) {
        const payload = await response.json().catch(() => null)
        throw new Error(payload?.detail ?? 'Unable to submit feedback')
      }

      setSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-2xl rounded-3xl border border-white/10 bg-slate-950/95 p-6 shadow-2xl shadow-black/50 backdrop-blur-xl">
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-neon">Post-Game Feedback</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">How was {gameName}?</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-full border border-white/10 bg-white/5 p-2 text-gray-300 hover:bg-white/10 transition"
          >
            <X size={18} />
          </button>
        </div>

        {submitted ? (
          <div className="mt-8 rounded-3xl bg-green-500/10 p-6 text-center text-green-200">
            <p className="text-lg font-semibold">Thanks for your feedback!</p>
            <p className="mt-2 text-sm text-gray-300">Your input helps us improve the Matiks experience.</p>
            <button
              onClick={onClose}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-neon px-6 py-3 text-sm font-semibold text-black transition hover:bg-neon/90"
            >
              Close
            </button>
          </div>
        ) : (
          <div className="space-y-6 pt-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm text-gray-400">Challenge Rating</p>
                <div className="mt-3 flex gap-2">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setChallengeRating(value)}
                      className={`h-11 w-11 rounded-full text-sm font-semibold transition ${
                        challengeRating === value
                          ? 'bg-neon text-black'
                          : 'bg-white/5 text-gray-200 hover:bg-white/10'
                      }`}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm text-gray-400">Enjoyment Rating</p>
                <div className="mt-3 flex gap-2">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setEnjoymentRating(value)}
                      className={`h-11 w-11 rounded-full text-sm font-semibold transition ${
                        enjoymentRating === value
                          ? 'bg-neon text-black'
                          : 'bg-white/5 text-gray-200 hover:bg-white/10'
                      }`}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <span className="text-sm text-gray-400">Improvement Area</span>
                <select
                  value={improvementArea}
                  onChange={(event) => setImprovementArea(event.target.value)}
                  className="mt-3 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-neon"
                >
                  {improvementOptions.map((option) => (
                    <option key={option} value={option} className="bg-slate-950 text-white">
                      {option}
                    </option>
                  ))}
                </select>
              </label>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm text-gray-400">Would you recommend this game?</p>
                <div className="mt-3 grid gap-2">
                  {recommendationOptions.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setRecommendation(option)}
                      className={`w-full rounded-2xl px-4 py-3 text-left text-sm font-semibold transition ${
                        recommendation === option
                          ? 'bg-neon text-black'
                          : 'bg-white/5 text-gray-200 hover:bg-white/10'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <label className="rounded-3xl border border-white/10 bg-white/5 p-4">
              <span className="text-sm text-gray-400">Open text feedback</span>
              <textarea
                value={feedbackText}
                onChange={(event) => setFeedbackText(event.target.value)}
                rows={5}
                placeholder="Tell us what worked well or how we can improve..."
                className="mt-3 w-full rounded-3xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-neon resize-none"
              />
            </label>

            {error ? <p className="text-sm text-red-400">{error}</p> : null}

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs uppercase tracking-[0.3em] text-gray-500">
                Your feedback makes Matiks stronger.
              </p>
              <button
                onClick={handleSubmit}
                disabled={!canSubmit || submitting}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-neon px-6 py-3 text-sm font-semibold text-black transition hover:bg-neon/90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? 'Submitting...' : 'Submit Feedback'}
                <Send size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
