'use client'

import { signIn } from 'next-auth/react'
import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const registered = searchParams.get('registered')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const form = e.currentTarget
    const emailOrPhone = (form.elements.namedItem('emailOrPhone') as HTMLInputElement).value
    const password = (form.elements.namedItem('password') as HTMLInputElement).value

    const res = await signIn('credentials', {
      emailOrPhone,
      password,
      redirect: false,
    })

    if (res?.error) {
      setError('Identifiant ou mot de passe incorrect')
      setLoading(false)
    } else {
      const sessionRes = await fetch('/api/auth/session')
      const session = await sessionRes.json()
      if (session?.user?.role === 'ADMIN') {
        router.push('/admin')
      } else {
        router.push('/')
      }
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 w-full max-w-md">
        <h1 className="text-2xl font-semibold text-gray-900 mb-1">Connexion</h1>
        <p className="text-sm text-gray-500 mb-8">
          {registered ? 'Compte cree ! Connectez-vous.' : 'Acces a votre compte'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email ou telephone
            </label>
            <input name="emailOrPhone" required
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="exemple@email.com ou 06XXXXXXXX" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
            <input name="password" type="password" required
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="••••••••" />
          </div>

          {error && (
            <p className="text-sm text-red-500 bg-red-50 px-4 py-2 rounded-lg">{error}</p>
          )}

          <button type="submit" disabled={loading}
            className="w-full bg-black text-white py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition disabled:opacity-50">
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        <p className="text-sm text-center text-gray-500 mt-6">
          Pas encore de compte ?{' '}
          <Link href="/register" className="text-black font-medium hover:underline">
            S'inscrire
          </Link>
        </p>
        <p className="text-xs text-center text-gray-400 mt-3">
          Vous pouvez aussi commander sans compte
        </p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}