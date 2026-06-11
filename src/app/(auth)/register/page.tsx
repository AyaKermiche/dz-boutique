'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function RegisterPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const form = e.currentTarget
    const name = (form.elements.namedItem('name') as HTMLInputElement).value
    const emailOrPhone = (form.elements.namedItem('emailOrPhone') as HTMLInputElement).value
    const password = (form.elements.namedItem('password') as HTMLInputElement).value

    const isPhone = /^(05|06|07)\d{8}$/.test(emailOrPhone)

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        email: isPhone ? null : emailOrPhone,
        phone: isPhone ? emailOrPhone : null,
        password,
      }),
    })

    if (res.ok) {
      router.push('/login?registered=1')
    } else {
      const data = await res.json()
      setError(data.error || 'Erreur lors de l\'inscription')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 w-full max-w-md">
        <h1 className="text-2xl font-semibold text-gray-900 mb-1">Créer un compte</h1>
        <p className="text-sm text-gray-500 mb-8">Suivez vos commandes facilement</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
            <input name="name" required
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Votre nom" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email ou numéro de téléphone
            </label>
            <input name="emailOrPhone" required
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="exemple@email.com ou 06XXXXXXXX" />
            <p className="text-xs text-gray-400 mt-1">Format téléphone: 05/06/07 + 8 chiffres</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
            <input name="password" type="password" required minLength={6}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Minimum 6 caractères" />
          </div>

          {error && (
            <p className="text-sm text-red-500 bg-red-50 px-4 py-2 rounded-lg">{error}</p>
          )}

          <button type="submit" disabled={loading}
            className="w-full bg-black text-white py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition disabled:opacity-50">
            {loading ? 'Création...' : 'Créer mon compte'}
          </button>
        </form>

        <p className="text-sm text-center text-gray-500 mt-6">
          Déjà un compte ?{' '}
          <Link href="/login" className="text-black font-medium hover:underline">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  )
}