'use client'

import { useCart } from '@/lib/cart'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'

const WILAYAS = [
  'Adrar','Chlef','Laghouat','Oum El Bouaghi','Batna','Béjaïa','Biskra','Béchar',
  'Blida','Bouira','Tamanrasset','Tébessa','Tlemcen','Tiaret','Tizi Ouzou','Alger',
  'Djelfa','Jijel','Sétif','Saïda','Skikda','Sidi Bel Abbès','Annaba','Guelma',
  'Constantine','Médéa','Mostaganem','M\'Sila','Mascara','Ouargla','Oran','El Bayadh',
  'Illizi','Bordj Bou Arréridj','Boumerdès','El Tarf','Tindouf','Tissemsilt','El Oued',
  'Khenchela','Souk Ahras','Tipaza','Mila','Aïn Defla','Naâma','Aïn Témouchent',
  'Ghardaïa','Relizane','Timimoun','Bordj Badji Mokhtar','Ouled Djellal','Béni Abbès',
  'In Salah','In Guezzam','Touggourt','Djanet','El M\'Ghair','El Meniaa'
]

export default function CheckoutPage() {
  const t = useTranslations()
  const { items, total, clearCart } = useCart()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // ✅ FIX: redirect safely
  useEffect(() => {
    if (items.length === 0) {
      router.push('/cart')
    }
  }, [items.length, router])

  if (items.length === 0) return null

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const form = e.currentTarget
    const getValue = (name: string) =>
      (form.elements.namedItem(name) as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement)?.value

    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: getValue('fullName'),
        phone: getValue('phone'),
        wilaya: getValue('wilaya'),
        commune: getValue('commune'),
        address: getValue('address'),
        deliveryNote: getValue('deliveryNote'),
        total: total(),
        items: items.map((i) => ({
          productId: i.id,
          quantity: i.quantity,
          price: i.price,
        })),
      }),
    })

    if (res.ok) {
  const data = await res.json()
  console.log(data)

  clearCart()

  router.push('/order-success')
}

else {
  setError('Something went wrong')
  setLoading(false)
}
}


  return (
    <div className="max-w-4xl mx-auto px-4 py-12">

      <h1 className="text-xs tracking-[0.3em] uppercase text-gray-400 mb-8">
        {t('checkout.title')}
      </h1>

      <div className="grid md:grid-cols-3 gap-8">

        {/* FORM */}
        <form onSubmit={handleSubmit} className="md:col-span-2 space-y-4">

          <div className="grid grid-cols-2 gap-4">

            <div>
              <label className="block text-xs text-gray-500 mb-1">
                {t('checkout.fullname')} *
              </label>
              <input name="fullName" required
                className="w-full px-4 py-2.5 border border-gray-200 text-sm" />
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1">
                {t('checkout.phone')} *
              </label>
              <input name="phone" required type="tel"
                className="w-full px-4 py-2.5 border border-gray-200 text-sm" />
            </div>

          </div>

          <div className="grid grid-cols-2 gap-4">

            <div>
              <label className="block text-xs text-gray-500 mb-1">
                {t('checkout.wilaya')} *
              </label>
              <select name="wilaya" required className="w-full px-4 py-2.5 border bg-white text-sm">
                <option value="">{t('checkout.choose')}</option>
                {WILAYAS.map((w) => <option key={w} value={w}>{w}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1">
                {t('checkout.commune')} *
              </label>
              <input name="commune" required className="w-full px-4 py-2.5 border text-sm" />
            </div>

          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1">
              {t('checkout.address')} *
            </label>
            <input name="address" required className="w-full px-4 py-2.5 border text-sm" />
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1">
              {t('checkout.note')}
            </label>
            <textarea name="deliveryNote" rows={2}
              className="w-full px-4 py-2.5 border text-sm" />
          </div>

          {/* COD */}
          <div className="bg-amber-50 border border-amber-100 p-4 text-sm text-amber-700">
            {t('checkout.cod_notice')}
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button type="submit" disabled={loading}
            className="w-full bg-black text-white py-4 text-sm uppercase">
            {loading ? t('checkout.sending') : t('checkout.confirm')}
          </button>

        </form>

        {/* SUMMARY */}
        <div className="bg-gray-50 p-6 h-fit">

          <h2 className="text-sm uppercase tracking-widest mb-4">
            {t('checkout.your_order')}
          </h2>

          <div className="space-y-3 mb-4">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-gray-600">
                  {item.name} x{item.quantity}
                </span>
                <span>{(item.price * item.quantity).toLocaleString()} DA</span>
              </div>
            ))}
          </div>

          <div className="border-t pt-4 flex justify-between font-semibold text-sm">
            <span>Total</span>
            <span>{total().toLocaleString()} DA</span>
          </div>

        </div>

      </div>
    </div>
  )
}
