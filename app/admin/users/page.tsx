import { AdminHeader } from "@/components/admin-header"
import { getUsers } from "@/lib/actions/user-actions"
import { AdminUsersClient } from "@/components/admin-users-client"

export default async function UsersPage() {
  const users = await getUsers()

  return (
    <div className="min-h-screen gradient-bg">
      <AdminHeader />
      <AdminUsersClient initialUsers={users} />
    </div>
  )
}
