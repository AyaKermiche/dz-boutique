'use client'

import { useState } from 'react'
import Image from 'next/image'

type Props = {
  images: string[]
  name: string
  isSoldOut: boolean
}

export function ProductGallery({ images, name, isSoldOut }: Props) {
  const [active, setActive] = useState(0)

  if (images.length === 0) {
    return (
      <div className="aspect-[3/4] bg-neutral-100 flex items-center justify-center text-neutral-300">
        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" />
        </svg>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Main image */}
      <div className="relative aspect-[3/4] bg-neutral-100 overflow-hidden">
        <Image
          src={images[active]}
          alt={`${name} - image ${active + 1}`}
          fill
          className="object-cover transition duration-300"
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        {isSoldOut && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
            <span className="bg-neutral-900 text-white text-xs tracking-widest uppercase px-6 py-3">
              Epuise
            </span>
          </div>
        )}
        {/* Navigation arrows for mobile swipe feel */}
        {images.length > 1 && (
          <>
            <button
              onClick={() => setActive(i => (i - 1 + images.length) % images.length)}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 flex items-center justify-center text-neutral-700 hover:bg-white transition">
              ‹
            </button>
            <button
              onClick={() => setActive(i => (i + 1) % images.length)}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 flex items-center justify-center text-neutral-700 hover:bg-white transition">
              ›
            </button>
          </>
        )}
        {/* Dots indicator mobile */}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, i) => (
              <button key={i} onClick={() => setActive(i)}
                className={`w-1.5 h-1.5 rounded-full transition ${
                  i === active ? 'bg-white' : 'bg-white/50'
                }`} />
            ))}
          </div>
        )}
      </div>

      {/* Thumbnails — desktop */}
      {images.length > 1 && (
        <div className="hidden md:flex gap-2">
          {images.map((img, i) => (
            <button key={i} onClick={() => setActive(i)}
              className={`relative w-16 h-20 bg-neutral-100 overflow-hidden flex-shrink-0 border-2 transition ${
                i === active ? 'border-neutral-900' : 'border-transparent hover:border-neutral-300'
              }`}>
              <Image src={img} alt={`${name} ${i + 1}`} fill className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}