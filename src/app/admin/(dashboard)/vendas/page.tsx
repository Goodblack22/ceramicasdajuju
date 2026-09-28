import { createAdminClient } from "@/lib/supabase/admin";
import { fmtBRL } from "@/lib/pricing";

export const metadata = { title: "Vendas — Cerâmica da Juju" };

function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

export default async function AdminSalesPage() {
  const admin = createAdminClient();

  const { data: paidOrders } = await admin
    .from("juju_orders")
    .select("id, total_cents, created_at")
    .eq("status", "paid")
    .order("created_at", { ascending: true });

  const orders = paidOrders ?? [];

  const totalRevenueCents = orders.reduce((sum, o) => sum + o.total_cents, 0);
  const ordersCount = orders.length;
  const avgTicketCents = ordersCount > 0 ? Math.round(totalRevenueCents / ordersCount) : 0;

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthRevenueCents = orders
    .filter((o) => new Date(o.created_at) >= monthStart)
    .reduce((sum, o) => sum + o.total_cents, 0);

  const DAYS = 14;
  const dayBuckets: { label: string; cents: number }[] = [];
  for (let i = DAYS - 1; i >= 0; i--) {
    const day = startOfDay(new Date(now.getTime() - i * 86400000));
    const nextDay = new Date(day.getTime() + 86400000);
    const cents = orders
      .filter((o) => {
        const created = new Date(o.created_at);
        return created >= day && created < nextDay;
      })
      .reduce((sum, o) => sum + o.total_cents, 0);
    dayBuckets.push({
      label: day.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }),
      cents,
    });
  }
  const maxDayCents = Math.max(1, ...dayBuckets.map((d) => d.cents));

  const paidOrderIds = orders.map((o) => o.id);
  let topProducts: { name: string; qty: number; revenueCents: number }[] = [];
  if (paidOrderIds.length > 0) {
    const { data: items } = await admin
      .from("juju_order_items")
      .select("product_name, quantity, line_total_cents")
      .in("order_id", paidOrderIds);

    const byProduct = new Map<string, { qty: number; revenueCents: number }>();
    for (const item of items ?? []) {
      const entry = byProduct.get(item.product_name) ?? { qty: 0, revenueCents: 0 };
      entry.qty += item.quantity;
      entry.revenueCents += item.line_total_cents;
      byProduct.set(item.product_name, entry);
    }
    topProducts = Array.from(byProduct.entries())
      .map(([name, v]) => ({ name, ...v }))
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 5);
  }

  return (
    <div>
      <h1 className="admin-page-title">Vendas</h1>

      <div className="admin-cards">
        <div className="admin-card">
          <span className="admin-card-num">{fmtBRL(totalRevenueCents)}</span>
          <span className="admin-card-label">faturamento total</span>
        </div>
        <div className="admin-card">
          <span className="admin-card-num">{fmtBRL(monthRevenueCents)}</span>
          <span className="admin-card-label">faturamento no mês</span>
        </div>
        <div className="admin-card">
          <span className="admin-card-num">{ordersCount}</span>
          <span className="admin-card-label">pedidos pagos</span>
        </div>
        <div className="admin-card">
          <span className="admin-card-num">{fmtBRL(avgTicketCents)}</span>
          <span className="admin-card-label">ticket médio</span>
        </div>
      </div>

      <h2 className="admin-section-title">Últimos 14 dias</h2>
      <div className="admin-panel">
        <div className="admin-chart">
          {dayBuckets.map((d, i) => (
            <div key={i} className="admin-chart-col">
              <div className="admin-chart-bar-wrap">
                <div
                  className="admin-chart-bar"
                  style={{ height: `${Math.max(2, (d.cents / maxDayCents) * 100)}%` }}
                  title={fmtBRL(d.cents)}
                />
              </div>
              <span className="admin-chart-label">{d.label}</span>
            </div>
          ))}
        </div>
      </div>

      <h2 className="admin-section-title">Mais vendidos</h2>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Produto</th>
            <th>Qtd. vendida</th>
            <th>Faturamento</th>
          </tr>
        </thead>
        <tbody>
          {topProducts.map((p) => (
            <tr key={p.name}>
              <td>{p.name}</td>
              <td>{p.qty}</td>
              <td>{fmtBRL(p.revenueCents)}</td>
            </tr>
          ))}
          {topProducts.length === 0 && (
            <tr>
              <td colSpan={3} className="admin-empty">
                Nenhuma venda ainda.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
