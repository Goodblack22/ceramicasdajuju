import Link from "next/link";
import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { fmtBRL } from "@/lib/pricing";
import { updateOrderStatus, updateFulfillmentStatus, updateTrackingCode } from "@/app/admin/actions";
import type { OrderStatus, FulfillmentStatus } from "@/lib/types";

export const metadata = { title: "Pedido — Cerâmica da Juju" };

type ShippingAddress = {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
};

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const admin = createAdminClient();

  const { data: order } = await admin.from("juju_orders").select("*").eq("id", id).maybeSingle();
  if (!order) notFound();

  const { data: items } = await admin
    .from("juju_order_items")
    .select("product_name, quantity, unit_price_cents, line_total_cents")
    .eq("order_id", id);

  const address = order.shipping_address as ShippingAddress;

  async function setStatus(formData: FormData) {
    "use server";
    await updateOrderStatus(id, formData.get("status") as OrderStatus);
  }

  async function setFulfillment(formData: FormData) {
    "use server";
    await updateFulfillmentStatus(id, formData.get("fulfillment_status") as FulfillmentStatus);
  }

  async function setTracking(formData: FormData) {
    "use server";
    await updateTrackingCode(id, (formData.get("tracking_code") as string).trim());
  }

  return (
    <div>
      <Link href="/admin/pedidos" className="admin-back-link">
        ← Voltar
      </Link>
      <h1 className="admin-page-title">Pedido de {order.customer_name}</h1>

      <div className="admin-order-grid">
        <div className="admin-panel">
          <h3>Itens</h3>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Produto</th>
                <th>Qtd</th>
                <th>Unit.</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {(items ?? []).map((i, idx) => (
                <tr key={idx}>
                  <td>{i.product_name}</td>
                  <td>{i.quantity}</td>
                  <td>{fmtBRL(i.unit_price_cents)}</td>
                  <td>{fmtBRL(i.line_total_cents)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="admin-summary">
            <div className="summary-line">
              <span>Subtotal</span>
              <span>{fmtBRL(order.items_subtotal_cents)}</span>
            </div>
            <div className="summary-line">
              <span>Frete ({order.shipping_method ?? "—"})</span>
              <span>{fmtBRL(order.shipping_cost_cents)}</span>
            </div>
            <div className="summary-line total">
              <span>Total</span>
              <span>{fmtBRL(order.total_cents)}</span>
            </div>
          </div>
        </div>

        <div className="admin-panel">
          <h3>Cliente</h3>
          <p>{order.customer_name}</p>
          <p>{order.customer_email}</p>
          {order.customer_phone && <p>{order.customer_phone}</p>}

          <h3 style={{ marginTop: 20 }}>Endereço de entrega</h3>
          <p>
            {address.street}, {address.number}
            {address.complement ? ` — ${address.complement}` : ""}
          </p>
          <p>
            {address.neighborhood} — {address.city}/{address.state}
          </p>
          <p>CEP {order.shipping_cep}</p>

          <h3 style={{ marginTop: 20 }}>Status do pagamento</h3>
          <form action={setStatus} className="admin-inline-form">
            <select name="status" defaultValue={order.status}>
              <option value="pending">Aguardando pagamento</option>
              <option value="paid">Pago</option>
              <option value="canceled">Cancelado</option>
              <option value="expired">Expirado</option>
            </select>
            <button type="submit" className="btn btn-outline">
              Salvar
            </button>
          </form>

          <h3 style={{ marginTop: 20 }}>Status do envio</h3>
          <form action={setFulfillment} className="admin-inline-form">
            <select name="fulfillment_status" defaultValue={order.fulfillment_status}>
              <option value="not_shipped">Não enviado</option>
              <option value="shipped">Enviado</option>
              <option value="delivered">Entregue</option>
            </select>
            <button type="submit" className="btn btn-outline">
              Salvar
            </button>
          </form>

          <h3 style={{ marginTop: 20 }}>Código de rastreio</h3>
          <form action={setTracking} className="admin-inline-form">
            <input
              type="text"
              name="tracking_code"
              defaultValue={order.tracking_code ?? ""}
              placeholder="Ex: BR123456789BR"
            />
            <button type="submit" className="btn btn-outline">
              Salvar
            </button>
          </form>
          <p className="admin-hint">O cliente vê esse código na página de acompanhamento do pedido dele.</p>
        </div>
      </div>
    </div>
  );
}
