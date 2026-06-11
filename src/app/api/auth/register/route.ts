import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

export async function POST(req: Request) {
  const { name, email, phone, password } = await req.json()

  if (!email && !phone) {
    return NextResponse.json({ error: 'Email ou téléphone requis' }, { status: 400 })
  }

  // Check existing user
  const existing = await prisma.user.findFirst({
    where: {
      OR: [
        email ? { email } : {},
        phone ? { phone } : {},
      ],
    },
  })

  if (existing) {
    return NextResponse.json(
      { error: 'Un compte existe déjà avec cet email ou téléphone' },
      { status: 400 }
    )
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await prisma.user.create({
    data: { name, email, phone, password: hashedPassword },
  })

  return NextResponse.json({ id: user.id }, { status: 201 })
}