import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

function slugify(text: string) {
  return text.toLowerCase().normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '') + '-' + Date.now()
}

export async function GET() {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { name: 'asc' }
  })
  return NextResponse.json(categories)
}

export async function POST(req: Request) {
  const { name, image } = await req.json()
  const category = await prisma.category.create({
    data: { name, slug: slugify(name), image: image || null }
  })
  return NextResponse.json(category, { status: 201 })
}