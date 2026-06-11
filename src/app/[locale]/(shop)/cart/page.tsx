'use client'

import { useCart } from '@/lib/cart'
import Link from 'next/link'
import Image from 'next/image'
import { useTranslations } from 'next-intl'

export default function CartPage() {
  const t = useTranslations()
  const { items, removeItem, updateQuantity, total } = useCart()

  if (items.length === 0) {
    return (
      <div className="max-w-lg mx-auto px-4 py-24 text-center">
        <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>

        <h1 className="font-display text-2xl font-bold text-stone-900 mb-2">
          {t('cart.empty_title')}
        </h1>

        <p className="text-sm text-stone-400 mb-8">
          {t('cart.empty_sub')}
        </p>

        <Link href="/products"
          className="inline-block bg-stone-900 text-white px-8 py-4 text-sm tracking-widest uppercase hover:bg-stone-700 transition">
          {t('cart.continue')}
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 md:py-12">
      <h1 className="font-display text-2xl md:text-3xl font-bold text-stone-900 mb-8">
        {t('cart.title')} ({items.length})
      </h1>

      <div className="flex flex-col md:flex-row gap-8">

        {/* Items */}
        <div className="flex-1 space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex gap-4 pb-4 border-b border-stone-100">
              <div className="w-24 h-32 bg-stone-100 relative flex-shrink-0 overflow-hidden">
                {item.image ? (
                  <Image src={item.image} alt={item.name} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-stone-300" />
                )}
              </div>

              <div className="flex-1">
                <p className="font-medium text-stone-900 text-sm mb-1">
                  {item.name}
                </p>

                <p className="text-sm font-bold text-stone-900 mb-4">
                  {item.price.toLocaleString()} DA
                </p>

                <div className="flex items-center gap-3">
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                    −
                  </button>

                  <span>{item.quantity}</span>

                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                    +
                  </button>

                  <button onClick={() => removeItem(item.id)} className="ml-auto text-xs">
                    {t('cart.remove')}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="md:w-72">
          <div className="bg-stone-50 p-6 sticky top-20">
            <h2 className="text-xs uppercase tracking-widest mb-4">
              {t('cart.summary')}
            </h2>

            <div className="flex justify-between text-sm mb-2">
              <span>{t('cart.subtotal')}</span>
              <span>{total().toLocaleString()} DA</span>
            </div>

            <div className="flex justify-between text-sm mb-4">
              <span>{t('cart.delivery')}</span>
              <span>{t('cart.delivery_value')}</span>
            </div>

            <div className="flex justify-between font-bold mb-6">
              <span>{t('cart.total')}</span>
              <span>{total().toLocaleString()} DA</span>
            </div>

            <Link href="/checkout"
              className="block w-full bg-stone-900 text-white text-center py-4 text-sm uppercase">
              {t('cart.checkout')}
            </Link>

            <Link href="/products"
              className="block text-center mt-3 text-sm text-stone-400">
              {t('cart.continue')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}