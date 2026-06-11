import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { signOut } from '@/lib/auth'
import AdminNav from '@/components/admin/AdminNav'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session || session.user?.role !== 'ADMIN') redirect('/login')

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav email={session.user?.email ?? ''} />
      <div className="md:pl-56">
        {children}
      </div>
    </div>
  )
}