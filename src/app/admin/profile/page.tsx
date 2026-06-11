'use client'

import { useState, useEffect } from 'react'

export default function AdminProfile() {
  const [tab, setTab] = useState<'profile' | 'shop'>('profile')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [shopForm, setShopForm] = useState({
    shopName: '',
    phone: '',
    whatsapp: '',
    instagram: '',
    address: '',
    deliveryPrice: '',
  })

  useEffect(() => {
    fetch('/api/settings')
      .then(r => r.json())
      .then(data => setShopForm({
        shopName: data.shopName || '',
        phone: data.phone || '',
        whatsapp: data.whatsapp || '',
        instagram: data.instagram || '',
        address: data.address || '',
        deliveryPrice: data.deliveryPrice || '',
      }))
  }, [])

  async function handlePasswordChange(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    const form = e.currentTarget
    const currentPassword = (form.elements.namedItem('current') as HTMLInputElement).value
    const newPassword = (form.elements.namedItem('new') as HTMLInputElement).value
    const confirm = (form.elements.namedItem('confirm') as HTMLInputElement).value

    if (newPassword !== confirm) {
      setError('Les mots de passe ne correspondent pas')
      setLoading(false)
      return
    }

    const res = await fetch('/api/admin/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentPassword, newPassword }),
    })

    if (res.ok) {
      setSuccess('Mot de passe change avec succes')
      form.reset()
    } else {
      const data = await res.json()
      setError(data.error)
    }
    setLoading(false)
  }

  async function handleShopSettings(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    const res = await fetch('/api/settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(shopForm),
    })

    if (res.ok) setSuccess('Parametres sauvegardes')
    else setError('Erreur lors de la sauvegarde')
    setLoading(false)
  }

  return (
    <div className="p-4 md:p-8 max-w-xl">
      <h1 className="text-xl font-semibold text-gray-900 mb-6">Parametres</h1>

      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-6">
        {(['profile', 'shop'] as const).map(t => (
          <button key={t} onClick={() => { setTab(t); setSuccess(''); setError('') }}
            className={`flex-1 py-2 text-sm rounded-lg transition ${
              tab === t ? 'bg-white text-gray-900 font-medium shadow-sm' : 'text-gray-500'
            }`}>
            {t === 'profile' ? 'Mot de passe' : 'Ma boutique'}
          </button>
        ))}
      </div>

      {tab === 'profile' && (
        <form onSubmit={handlePasswordChange}
          className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
          <h2 className="font-medium text-gray-900">Changer le mot de passe</h2>
          {[
            { name: 'current', label: 'Mot de passe actuel' },
            { name: 'new', label: 'Nouveau mot de passe' },
            { name: 'confirm', label: 'Confirmer le nouveau' },
          ].map(field => (
            <div key={field.name}>
              <label className="block text-sm text-gray-600 mb-1">{field.label}</label>
              <input name={field.name} type="password" required minLength={field.name === 'current' ? 1 : 6}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black" />
            </div>
          ))}

          {error && <p className="text-sm text-red-500 bg-red-50 px-4 py-2 rounded-lg">{error}</p>}
          {success && <p className="text-sm text-green-600 bg-green-50 px-4 py-2 rounded-lg">{success}</p>}

          <button type="submit" disabled={loading}
            className="w-full bg-black text-white py-2.5 rounded-lg text-sm font-medium disabled:opacity-50">
            {loading ? 'Sauvegarde...' : 'Changer le mot de passe'}
          </button>
        </form>
      )}

      {tab === 'shop' && (
        <form onSubmit={handleShopSettings}
          className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
          <h2 className="font-medium text-gray-900">Informations de la boutique</h2>

          {[
            { key: 'shopName', label: 'Nom de la boutique', placeholder: 'DZ Boutique' },
            { key: 'phone', label: 'Telephone', placeholder: '05XXXXXXXX' },
            { key: 'whatsapp', label: 'WhatsApp (avec indicatif)', placeholder: '213XXXXXXXXX' },
            { key: 'instagram', label: 'Instagram', placeholder: '@maboutique' },
            { key: 'address', label: 'Adresse', placeholder: 'Alger...' },
            { key: 'deliveryPrice', label: 'Prix livraison', placeholder: 'Gratuit / 400 DA...' },
          ].map(field => (
            <div key={field.key}>
              <label className="block text-sm text-gray-600 mb-1">{field.label}</label>
              <input
                value={shopForm[field.key as keyof typeof shopForm]}
                onChange={e => setShopForm({ ...shopForm, [field.key]: e.target.value })}
                placeholder={field.placeholder}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
          ))}

          {error && <p className="text-sm text-red-500 bg-red-50 px-4 py-2 rounded-lg">{error}</p>}
          {success && <p className="text-sm text-green-600 bg-green-50 px-4 py-2 rounded-lg">{success}</p>}

          <button type="submit" disabled={loading}
            className="w-full bg-black text-white py-2.5 rounded-lg text-sm font-medium disabled:opacity-50">
            {loading ? 'Sauvegarde...' : 'Sauvegarder'}
          </button>
        </form>
      )}
    </div>
  )
}