import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { OrderReviewForm } from '@/components/shop/OrderReviewForm'

export default async function AccountPage() {
  const session = await auth()
  if (!session || session.user.role !== 'CUSTOMER') redirect('/login')

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    include: {
      items: { include: { product: true } },
      review: true,
    },
    orderBy: { createdAt: 'desc' },
  })

  const statusColors: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-700',
    CONFIRMED: 'bg-blue-100 text-blue-700',
    SHIPPED: 'bg-purple-100 text-purple-700',
    DELIVERED: 'bg-green-100 text-green-700',
    CANCELLED: 'bg-red-100 text-red-700',
  }

  const statusLabels: Record<string, string> = {
    PENDING: 'En attente',
    CONFIRMED: 'Confirmée',
    SHIPPED: 'Expédiée',
    DELIVERED: 'Livrée',
    CANCELLED: 'Annulée',
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-semibold text-gray-900 mb-2">Mon compte</h1>
      <p className="text-sm text-gray-500 mb-8">{session.user.email}</p>

      <h2 className="text-xs tracking-[0.3em] uppercase text-gray-400 mb-4">Mes commandes</h2>

      {orders.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-2xl">
          <p className="text-gray-400 text-sm">Aucune commande pour l'instant</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white border border-gray-100 rounded-2xl p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-xs text-gray-400">
                    {new Date(order.createdAt).toLocaleDateString('fr-DZ')}
                  </p>
                  <p className="font-semibold text-gray-900 mt-1">
                    {Number(order.total).toLocaleString()} DA
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                  {statusLabels[order.status]}
                </span>
              </div>

              <div className="space-y-1 mb-4">
                {order.items.map((item) => (
                  <p key={item.id} className="text-sm text-gray-500">
                    {item.product.name} x{item.quantity}
                  </p>
                ))}
              </div>

              {/* Rating — seulement si livrée */}
              {order.status === 'DELIVERED' && (
                <OrderReviewForm
                  orderId={order.id}
                  existingReview={order.review}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}