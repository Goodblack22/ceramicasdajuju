import Link from "next/link";
import { requireAdmin } from "@/lib/admin-auth";
import { logout } from "@/app/admin/actions";

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAdmin();

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-brand">Cerâmica da Juju</div>
        <nav className="admin-nav">
          <Link href="/admin">Início</Link>
          <Link href="/admin/pedidos">Pedidos</Link>
          <Link href="/admin/produtos">Produtos</Link>
        </nav>
        <div className="admin-sidebar-foot">
          <span className="admin-user-email">{user.email}</span>
          <form action={logout}>
            <button type="submit" className="admin-logout-btn">
              Sair
            </button>
          </form>
        </div>
      </aside>
      <main className="admin-main">{children}</main>
    </div>
  );
}
