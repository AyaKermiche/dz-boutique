import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

export async function PATCH(req: Request) {
  const session = await auth()
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Non autorise' }, { status: 401 })
  }

  const { currentPassword, newPassword, name } = await req.json()

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  })
  if (!user) return NextResponse.json({ error: 'Utilisateur introuvable' }, { status: 404 })

  if (currentPassword && newPassword) {
    const valid = await bcrypt.compare(currentPassword, user.password)
    if (!valid) {
      return NextResponse.json({ error: 'Mot de passe actuel incorrect' }, { status: 400 })
    }
    const hashed = await bcrypt.hash(newPassword, 10)
    await prisma.user.update({
      where: { id: session.user.id },
      data: { password: hashed, ...(name ? { name } : {}) },
    })
  } else if (name) {
    await prisma.user.update({
      where: { id: session.user.id },
      data: { name },
    })
  }

  return NextResponse.json({ success: true })
}