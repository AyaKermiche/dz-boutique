'use client'

import { useLocale } from 'next-intl'
import { useRouter, usePathname } from 'next/navigation'
import { useState } from 'react'

const LOCALES = [
  { code: 'fr', label: 'FR', flag: '🇫🇷' },
  { code: 'ar', label: 'عر', flag: '🇩🇿' },
  { code: 'en', label: 'EN', flag: '🇬🇧' },
]

export function LocaleSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  function switchLocale(newLocale: string) {
    // Replace current locale prefix in pathname
    const segments = pathname.split('/')
    segments[1] = newLocale
    router.push(segments.join('/'))
    setOpen(false)
  }

  const current = LOCALES.find(l => l.code === locale)

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 text-neutral-500 hover:text-neutral-900 transition text-sm px-2 py-1 border border-neutral-200 rounded-lg">
        <span>{current?.flag}</span>
        <span className="text-xs font-medium">{current?.label}</span>
        <span className="text-xs">▾</span>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-1 bg-white border border-neutral-100 rounded-xl shadow-lg z-20 overflow-hidden min-w-[80px]">
            {LOCALES.map(l => (
              <button
                key={l.code}
                onClick={() => switchLocale(l.code)}
                className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-neutral-50 transition ${
                  l.code === locale ? 'font-bold text-neutral-900' : 'text-neutral-600'
                }`}>
                <span>{l.flag}</span>
                <span>{l.label}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}