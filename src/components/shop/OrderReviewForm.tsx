'use client'

import { useState } from 'react'

type Review = { rating: number; comment: string | null } | null

export function OrderReviewForm({ orderId, existingReview }: {
  orderId: string
  existingReview: Review
}) {
  const [rating, setRating] = useState(existingReview?.rating ?? 0)
  const [comment, setComment] = useState(existingReview?.comment ?? '')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(!!existingReview)
  const [hovered, setHovered] = useState(0)

  async function handleSubmit() {
    if (rating === 0) return
    setLoading(true)

    await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId, rating, comment }),
    })

    setLoading(false)
    setSubmitted(true)
  }

  if (submitted && !loading) {
    return (
      <div className="border-t border-gray-50 pt-4">
        <p className="text-xs text-gray-400 mb-1">Votre avis</p>
        <div className="flex items-center gap-1 mb-1">
          {[1,2,3,4,5].map((s) => (
            <span key={s} className={s <= rating ? 'text-amber-400' : 'text-gray-200'}>★</span>
          ))}
        </div>
        {comment && <p className="text-sm text-gray-500 italic">"{comment}"</p>}
        <button onClick={() => setSubmitted(false)}
          className="text-xs text-gray-400 hover:text-black mt-1 transition">
          Modifier
        </button>
      </div>
    )
  }

  return (
    <div className="border-t border-gray-50 pt-4">
      <p className="text-xs text-gray-500 mb-2 font-medium">Noter cette commande</p>

      {/* Stars */}
      <div className="flex gap-1 mb-3">
        {[1,2,3,4,5].map((s) => (
          <button key={s}
            onClick={() => setRating(s)}
            onMouseEnter={() => setHovered(s)}
            onMouseLeave={() => setHovered(0)}
            className="text-2xl transition">
            <span className={s <= (hovered || rating) ? 'text-amber-400' : 'text-gray-200'}>★</span>
          </button>
        ))}
      </div>

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={2}
        placeholder="Commentaire (optionnel)..."
        className="w-full px-3 py-2 border border-gray-200 text-sm focus:outline-none focus:border-black resize-none mb-2"
      />

      <button
        onClick={handleSubmit}
        disabled={rating === 0 || loading}
        className="bg-black text-white px-4 py-2 text-sm hover:bg-gray-800 transition disabled:opacity-40">
        {loading ? 'Envoi...' : 'Envoyer l\'avis'}
      </button>
    </div>
  )
}