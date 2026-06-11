'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'

export default function OrderSuccessPage() {
  const t = useTranslations()

  return (
    <div className="max-w-lg mx-auto px-4 py-24 text-center">

      <p className="text-5xl mb-6">✅</p>

      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        {t('success.title')}
      </h1>

      <p className="text-sm text-gray-400 mb-8">
        {t('success.sub')}
      </p>

      <Link
        href="/products"
        className="inline-block bg-black text-white px-8 py-3 text-sm tracking-widest uppercase hover:bg-gray-800 transition"
      >
        {t('success.continue')}
      </Link>

    </div>
  )
}