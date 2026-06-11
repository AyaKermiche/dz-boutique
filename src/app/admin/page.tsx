import { prisma } from '@/lib/prisma'

export default async function AdminDashboard() {
  const [ordersCount, productsCount, revenue, recentOrders] = await Promise.all([
    prisma.order.count(),
    prisma.product.count(),
    prisma.order.aggregate({
      _sum: { total: true },
      where: { status: { not: 'CANCELLED' } }
    }),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { items: true }
    })
  ])

  const stats = [
    { label: 'Total Commandes', value: ordersCount, icon: '📦' },
    { label: 'Produits', value: productsCount, icon: '👗' },
    { label: 'Chiffre d\'affaires', value: `${Number(revenue._sum.total ?? 0).toLocaleString()} DA`, icon: '💰' },
  ]

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
    <div className="p-4 pt-20 md:p-8">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6 md:mb-8">Tableau de bord</h1>

      {/* Stats - Stacks on mobile, multi-column on desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-5 md:p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-500">{s.label}</p>
              <span className="text-2xl">{s.icon}</span>
            </div>
            <p className="text-2xl md:text-3xl font-bold text-gray-900 break-words">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Orders Wrapper */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 md:p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Commandes récentes</h2>
        {recentOrders.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-8">Aucune commande pour l'instant</p>
        ) : (
          <>
            {/* Mobile View: Shows up as clean card lists */}
            <div className="block md:hidden divide-y divide-gray-100">
              {recentOrders.map((order) => (
                <div key={order.id} className="py-4 first:pt-0 last:pb-0 flex flex-col gap-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{order.fullName}</p>
                      <p className="text-xs text-gray-400">{order.items.length} article(s)</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                      {statusLabels[order.status]}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-1">
                    <span className="text-xs text-gray-400">Total</span>
                    <span className="text-sm font-bold text-gray-900">
                      {Number(order.total).toLocaleString()} DA
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Laptop/Desktop View: Standard optimized layout table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-400 border-b border-gray-50">
                    <th className="pb-3 font-medium">Client</th>
                    <th className="pb-3 font-medium">Articles</th>
                    <th className="pb-3 font-medium">Total</th>
                    <th className="pb-3 font-medium">Statut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {recentOrders.map((order) => (
                    <tr key={order.id}>
                      <td className="py-3 font-medium text-gray-900">{order.fullName}</td>
                      <td className="py-3 text-gray-500">{order.items.length} article(s)</td>
                      <td className="py-3 text-gray-900">{Number(order.total).toLocaleString()} DA</td>
                      <td className="py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                          {statusLabels[order.status]}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  )
}