'use client'

import Link from 'next/link'
import Image from 'next/image'

interface CategoryWithCount {
  id: string
  name: string
  slug: string
  image: string | null
  _count: {
    products: number
  }
}

export function CategorySlider({
  categories,
}: {
  categories: CategoryWithCount[]
}) {
  return (
    <div className="overflow-x-auto scrollbar-hide -mx-4 px-4">
      <div className="flex gap-4 md:gap-6 w-max md:w-full md:grid md:grid-cols-3">

        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/products?category=${cat.slug}`}
            className="group relative w-[260px] md:w-auto h-[360px] rounded-[32px] overflow-hidden flex-shrink-0"
          >
            {/* Image */}
            {cat.image ? (
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                sizes="(max-width:768px) 260px, 33vw"
                className="object-cover transition duration-700 group-hover:scale-110"
              />
            ) : (
              <div className="absolute inset-0 bg-neutral-200" />
            )}

            {/* Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            {/* Hover glow */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-white/10 backdrop-blur-[2px]" />

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-6">

              <div className="inline-flex items-center rounded-full bg-white/15 backdrop-blur-md border border-white/20 px-3 py-1 mb-3">
                <span className="text-white text-xs tracking-wider uppercase">
                  {cat._count.products} Articles
                </span>
              </div>

              <h3 className="text-white text-2xl font-bold leading-tight mb-2">
                {cat.name}
              </h3>

              <div className="flex items-center gap-2 text-white/80 text-sm group-hover:text-white transition">
                <span>Découvrir</span>

                <svg
                  className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>

            </div>
          </Link>
        ))}

      </div>
    </div>
  )
}