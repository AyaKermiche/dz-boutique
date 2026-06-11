import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Non connecté' }, { status: 401 })

  const { orderId, rating, comment } = await req.json()

  if (rating < 1 || rating > 5) {
    return NextResponse.json({ error: 'Note invalide' }, { status: 400 })
  }

  // Vérifie que la commande appartient au user
  const order = await prisma.order.findFirst({
    where: { id: orderId, userId: session.user.id, status: 'DELIVERED' },
  })

  if (!order) {
    return NextResponse.json({ error: 'Commande introuvable ou non livrée' }, { status: 404 })
  }

  const review = await prisma.review.upsert({
    where: { orderId },
    update: { rating, comment },
    create: { orderId, userId: session.user.id, rating, comment },
  })

  return NextResponse.json(review, { status: 201 })
}