'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'

type Props = {
  value: string[]
  onChange: (urls: string[]) => void
  max?: number
}

export function ImageUploader({ value, onChange, max = 5 }: Props) {
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFiles(files: FileList) {
    setUploading(true)
    const newUrls: string[] = []

    for (const file of Array.from(files)) {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()
      if (data.url) newUrls.push(data.url)
    }

    onChange([...value, ...newUrls].slice(0, max))
    setUploading(false)
  }

  function removeImage(url: string) {
    onChange(value.filter(u => u !== url))
  }

  return (
    <div>
      {/* Preview grid */}
      {value.length > 0 && (
        <div className="grid grid-cols-3 gap-2 mb-3">
          {value.map((url, i) => (
            <div key={url} className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden group">
              <Image src={url} alt={`Image ${i + 1}`} fill className="object-cover" />
              <button
                type="button"
                onClick={() => removeImage(url)}
                className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                ×
              </button>
              {i === 0 && (
                <span className="absolute bottom-1 left-1 bg-black text-white text-xs px-1.5 py-0.5 rounded">
                  Principale
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Upload zone */}
      {value.length < max && (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={e => e.preventDefault()}
          onDrop={e => {
            e.preventDefault()
            handleFiles(e.dataTransfer.files)
          }}
          className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center cursor-pointer hover:border-black transition">
          {uploading ? (
            <div className="flex items-center justify-center gap-2 text-gray-500">
              <div className="w-4 h-4 border-2 border-gray-300 border-t-black rounded-full animate-spin" />
              <span className="text-sm">Upload en cours...</span>
            </div>
          ) : (
            <>
              <div className="text-3xl mb-2">📸</div>
              <p className="text-sm font-medium text-gray-700">
                Appuyez pour ajouter des photos
              </p>
              <p className="text-xs text-gray-400 mt-1">
                JPG, PNG — max {max} photo(s)
              </p>
            </>
          )}
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={e => e.target.files && handleFiles(e.target.files)}
            capture="environment"
          />
        </div>
      )}
    </div>
  )
}