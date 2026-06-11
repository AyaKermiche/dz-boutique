import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  const settings = await prisma.shopSettings.upsert({
    where: { id: 'singleton' },
    update: {},
    create: { id: 'singleton' },
  })
  return NextResponse.json(settings)
}

export async function PATCH(req: Request) {
  const body = await req.json()
  const settings = await prisma.shopSettings.upsert({
    where: { id: 'singleton' },
    update: body,
    create: { id: 'singleton', ...body },
  })
  return NextResponse.json(settings)
}