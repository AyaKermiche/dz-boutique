import { prisma } from '@/lib/prisma'
import OrderStatusUpdater from './OrderStatusUpdater'
import Link from 'next/link'

const STATUS_LABELS: Record<string, string> = {
  PENDING: 'En attente',
  CONFIRMED: 'Confirmee',
  SHIPPED: 'Expediee',
  DELIVERED: 'Livree',
  CANCELLED: 'Annulee',
}

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-amber-100 text-amber-700',
  CONFIRMED: 'bg-blue-100 text-blue-700',
  SHIPPED: 'bg-purple-100 text-purple-700',
  DELIVERED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-700',
}

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  const { status } = await searchParams

  const orders = await prisma.order.findMany({
    where: status ? { status: status as any } : {},
    orderBy: { createdAt: 'desc' },
    include: { items: { include: { product: true } } },
  })

  const counts = await prisma.order.groupBy({
    by: ['status'],
    _count: true,
  })

  const countMap = Object.fromEntries(counts.map(c => [c.status, c._count]))

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-xl font-semibold text-gray-900 mb-6">
        Commandes ({orders.length})
      </h1>

      {/* Status filter tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
        <Link href="/admin/orders"
          className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs border transition ${
            !status ? 'bg-black text-white border-black' : 'border-gray-200 text-gray-600'
          }`}>
          Toutes ({orders.length})
        </Link>
        {Object.entries(STATUS_LABELS).map(([key, label]) => (
          <Link key={key} href={`/admin/orders?status=${key}`}
            className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs border transition ${
              status === key ? 'bg-black text-white border-black' : 'border-gray-200 text-gray-600'
            }`}>
            {label} ({countMap[key] ?? 0})
          </Link>
        ))}
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <p className="text-4xl mb-3">📦</p>
          <p className="text-gray-400 text-sm">Aucune commande</p>
        </div>
      ) : (
        <div className="space-y-2">
          {orders.map(order => (
            <div key={order.id}
              className="bg-white border border-gray-100 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{order.fullName}</p>
                    <p className="text-xs text-gray-400">{order.phone} · {order.wilaya}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900 text-sm">
                    {Number(order.total).toLocaleString()} DA
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(order.createdAt).toLocaleDateString('fr-DZ')}
                  </p>
                </div>
              </div>

              {/* Items summary */}
              <p className="text-xs text-gray-500 mb-3">
                {order.items.map(i => `${i.product.name} ×${i.quantity}`).join(', ')}
              </p>

              <div className="flex items-center justify-between">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[order.status]}`}>
                  {STATUS_LABELS[order.status]}
                </span>
                <OrderStatusUpdater orderId={order.id} currentStatus={order.status} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}