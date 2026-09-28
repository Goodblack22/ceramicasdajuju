import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { fmtBRL } from "@/lib/pricing";
import type { OrderStatus } from "@/lib/types";

export const metadata = { title: "Pedidos — Cerâmica da Juju" };

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Aguardando pagamento",
  paid: "Pago",
  canceled: "Cancelado",
  expired: "Expirado",
};

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const admin = createAdminClient();

  let query = admin
    .from("juju_orders")
    .select("id, customer_name, customer_email, status, fulfillment_status, total_cents, created_at")
    .order("created_at", { ascending: false });

  if (status) query = query.eq("status", status);

  const { data: orders } = await query;

  return (
    <div>
      <h1 className="admin-page-title">Pedidos</h1>

      <div className="admin-filters">
        <Link href="/admin/pedidos" className={!status ? "chip active" : "chip"}>
          Todos
        </Link>
        {(Object.keys(STATUS_LABELS) as OrderStatus[]).map((s) => (
          <Link key={s} href={`/admin/pedidos?status=${s}`} className={status === s ? "chip active" : "chip"}>
            {STATUS_LABELS[s]}
          </Link>
        ))}
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Cliente</th>
            <th>E-mail</th>
            <th>Pagamento</th>
            <th>Envio</th>
            <th>Total</th>
            <th>Data</th>
          </tr>
        </thead>
        <tbody>
          {(orders ?? []).map((o) => (
            <tr key={o.id}>
              <td>
                <Link href={`/admin/pedidos/${o.id}`}>{o.customer_name}</Link>
              </td>
              <td>{o.customer_email}</td>
              <td>
                <span className={`status-badge ${o.status}`}>{STATUS_LABELS[o.status as OrderStatus]}</span>
              </td>
              <td>{o.fulfillment_status === "not_shipped" ? "Não enviado" : o.fulfillment_status === "shipped" ? "Enviado" : "Entregue"}</td>
              <td>{fmtBRL(o.total_cents)}</td>
              <td>{new Date(o.created_at).toLocaleDateString("pt-BR")}</td>
            </tr>
          ))}
          {(orders ?? []).length === 0 && (
            <tr>
              <td colSpan={6} className="admin-empty">
                Nenhum pedido encontrado.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
