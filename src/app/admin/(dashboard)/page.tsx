import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { fmtBRL } from "@/lib/pricing";

export const metadata = { title: "Painel — Cerâmica da Juju" };

export default async function AdminHomePage() {
  const admin = createAdminClient();

  const { count: pendingCount } = await admin
    .from("juju_orders")
    .select("id", { count: "exact", head: true })
    .eq("status", "pending");

  const { count: toShipCount } = await admin
    .from("juju_orders")
    .select("id", { count: "exact", head: true })
    .eq("status", "paid")
    .eq("fulfillment_status", "not_shipped");

  const { data: recentOrders } = await admin
    .from("juju_orders")
    .select("id, customer_name, status, total_cents, created_at")
    .order("created_at", { ascending: false })
    .limit(5);

  return (
    <div>
      <h1 className="admin-page-title">Início</h1>

      <div className="admin-cards">
        <Link href="/admin/pedidos?status=pending" className="admin-card">
          <span className="admin-card-num">{pendingCount ?? 0}</span>
          <span className="admin-card-label">pedidos aguardando pagamento</span>
        </Link>
        <Link href="/admin/pedidos?status=paid" className="admin-card">
          <span className="admin-card-num">{toShipCount ?? 0}</span>
          <span className="admin-card-label">pagos aguardando envio</span>
        </Link>
        <Link href="/admin/produtos" className="admin-card">
          <span className="admin-card-num">→</span>
          <span className="admin-card-label">gerenciar produtos</span>
        </Link>
      </div>

      <h2 className="admin-section-title">Últimos pedidos</h2>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Cliente</th>
            <th>Status</th>
            <th>Total</th>
            <th>Data</th>
          </tr>
        </thead>
        <tbody>
          {(recentOrders ?? []).map((o) => (
            <tr key={o.id}>
              <td>
                <Link href={`/admin/pedidos/${o.id}`}>{o.customer_name}</Link>
              </td>
              <td>
                <span className={`status-badge ${o.status}`}>{o.status}</span>
              </td>
              <td>{fmtBRL(o.total_cents)}</td>
              <td>{new Date(o.created_at).toLocaleDateString("pt-BR")}</td>
            </tr>
          ))}
          {(recentOrders ?? []).length === 0 && (
            <tr>
              <td colSpan={4} className="admin-empty">
                Nenhum pedido ainda.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
