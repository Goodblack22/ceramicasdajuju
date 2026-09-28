"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fmtBRL } from "@/lib/pricing";
import type { OrderStatusResponse } from "@/lib/types";

const STATUS_LABEL: Record<OrderStatusResponse["status"], string> = {
  pending: "Aguardando pagamento",
  paid: "Pagamento confirmado",
  canceled: "Cancelado",
  expired: "Expirado",
};

const FULFILLMENT_LABEL: Record<OrderStatusResponse["fulfillmentStatus"], string> = {
  not_shipped: "Em preparação",
  shipped: "Enviado",
  delivered: "Entregue",
};

export default function OrderStatusView({
  orderId,
  initial,
}: {
  orderId: string;
  initial: OrderStatusResponse;
}) {
  const [status, setStatus] = useState(initial);

  useEffect(() => {
    if (status.status !== "pending") return;
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/orders/${orderId}/status`);
        if (res.ok) {
          const data: OrderStatusResponse = await res.json();
          setStatus(data);
        }
      } catch {
        // keep polling silently
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [orderId, status.status]);

  return (
    <main className="page-enter">
      <div className="page-title-block">
        <span className="eyebrow">Pedido</span>
        <h1>Status do pedido</h1>
      </div>

      <div className="container" style={{ maxWidth: 560, padding: "20px 24px 80px", textAlign: "center" }}>
        <span className={`status-badge ${status.status}`}>{STATUS_LABEL[status.status]}</span>

        {status.status === "pending" && (
          <p style={{ marginTop: 18, color: "#8a7a66", fontSize: 13.5 }}>
            Assim que o pagamento for confirmado, esta página atualiza automaticamente.
          </p>
        )}

        {status.status === "paid" && (
          <div style={{ textAlign: "left", marginTop: 24, border: "1px solid var(--cream-3)", borderRadius: 10, padding: 24 }}>
            <h3 style={{ fontSize: 15, marginBottom: 10 }}>Envio</h3>
            <p style={{ fontSize: 13.5, color: "#5c4a3a", marginBottom: 4 }}>
              Status: <strong>{FULFILLMENT_LABEL[status.fulfillmentStatus]}</strong>
            </p>
            {status.trackingCode ? (
              <p style={{ fontSize: 13.5, color: "#5c4a3a" }}>
                Código de rastreio: <strong>{status.trackingCode}</strong>
              </p>
            ) : (
              <p style={{ fontSize: 13, color: "#8a7a66" }}>
                O código de rastreio aparece aqui assim que a peça for postada.
              </p>
            )}
          </div>
        )}

        <div style={{ textAlign: "left", marginTop: 24, border: "1px solid var(--cream-3)", borderRadius: 10, padding: 24 }}>
          {status.items.map((item, i) => (
            <div className="summary-line" key={i}>
              <span>{item.quantity}x {item.productName}</span>
              <span>{fmtBRL(item.unitPriceCents * item.quantity)}</span>
            </div>
          ))}
          <div className="summary-line">
            <span>Subtotal</span>
            <span>{fmtBRL(status.itemsSubtotalCents)}</span>
          </div>
          <div className="summary-line">
            <span>Frete{status.shippingMethod ? ` (${status.shippingMethod})` : ""}</span>
            <span>{fmtBRL(status.shippingCostCents)}</span>
          </div>
          <div className="summary-line total">
            <span>Total</span>
            <span>{fmtBRL(status.totalCents)}</span>
          </div>
        </div>

        <Link href="/loja" className="btn btn-outline" style={{ marginTop: 28 }}>
          Voltar para a loja
        </Link>
      </div>
    </main>
  );
}
