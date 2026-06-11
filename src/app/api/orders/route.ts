import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { sendEmail } from '@/lib/email'
import { orderNotificationEmail } from '@/lib/emailTemplates'
import { auth } from '@/lib/auth'

export async function POST(req: Request) {
  const session = await auth()
  const body = await req.json()
  const { items, total, ...shipping } = body

  try {
    const order = await prisma.$transaction(async (tx) => {
      for (const item of items) {
        const product = await tx.product.findUnique({ where: { id: item.productId } })
        if (!product) throw new Error(`Produit introuvable`)
        if (product.stock < item.quantity) throw new Error(`Stock insuffisant pour ${product.name}`)
      }

      for (const item of items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        })
      }

      return tx.order.create({
        data: {
          ...shipping,
          total,
          userId: session?.user?.id ?? null,
          items: {
            create: items.map((item: any) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
            })),
          },
        },
        include: { items: { include: { product: true } } },
      })
    })

    const adminEmail = process.env.ADMIN_EMAIL
    if (adminEmail) {
      sendEmail({
        to: adminEmail,
        subject: `Nouvelle commande — ${order.fullName} — ${Number(order.total).toLocaleString()} DA`,
        htmlContent: orderNotificationEmail({
          orderId: order.id,
          fullName: order.fullName,
          phone: order.phone,
          wilaya: order.wilaya,
          commune: order.commune,
          address: order.address,
          deliveryNote: order.deliveryNote,
          items: order.items.map(i => ({
            productName: i.product.name,
            quantity: i.quantity,
            price: Number(i.price),
          })),
          total: Number(order.total),
        }),
      }).catch(err => console.error('Email failed:', err))
    }

    return NextResponse.json(order, { status: 201 })

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}