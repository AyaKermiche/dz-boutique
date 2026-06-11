import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

function slugify(text: string) {
  return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export async function GET() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    include: { category: true },
    orderBy: { createdAt: 'desc' }
  })
  return NextResponse.json(products)
}

export async function POST(req: Request) {
  const body = await req.json()
  const slug = slugify(body.name) + '-' + Date.now()

  const product = await prisma.product.create({
    data: { ...body, slug }
  })
  return NextResponse.json(product, { status: 201 })
}