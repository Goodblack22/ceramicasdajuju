"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fmtBRL } from "@/lib/pricing";
import type { OrderStatusResponse } from "@/lib/types";

const CAPTURE_LABEL: Record<NonNullable<OrderStatusResponse["captureMethod"]>, string> = {
  pix: "Pix",
  credit_card: "Cartão de crédito",
};

const TIMELINE: { key: string; label: string }[] = [
  { key: "paid", label: "Pagamento confirmado" },
  { key: "not_shipped", label: "Em preparação" },
  { key: "shipped", label: "Enviado" },
  { key: "delivered", label: "Entregue" },
];

// How far along the timeline the order is (index of the last reached step).
function timelineIndex(s: OrderStatusResponse): number {
  if (s.status !== "paid") return -1;
  if (s.fulfillmentStatus === "delivered") return 3;
  if (s.fulfillmentStatus === "shipped") return 2;
  return 1;
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path className="order-check-path" d="M5 12.5l4.5 4.5L19 7.5" />
    </svg>
  );
}

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

  const shortId = orderId.slice(0, 8).toUpperCase();
  const reached = timelineIndex(status);

  return (
    <main className="page-enter">
      <div className="container order-page">
        <section className={`order-hero ${status.status}`}>
          {status.status === "paid" && (
            <>
              <div className="order-hero-icon paid"><CheckIcon /></div>
              <span className="eyebrow">Pedido #{shortId}</span>
              <h1>Obrigada pela sua compra!</h1>
              <p>
                Seu pagamento foi confirmado
                {status.captureMethod ? ` via ${CAPTURE_LABEL[status.captureMethod]}` : ""}.
                Agora é com a gente: cada peça é embalada à mão, com todo cuidado.
              </p>
              <span className="signature">com carinho, Juju</span>
            </>
          )}

          {status.status === "pending" && (
            <>
              <div className="order-hero-icon pending" aria-hidden="true" />
              <span className="eyebrow">Pedido #{shortId}</span>
              <h1>Confirmando seu pagamento…</h1>
              <p>
                Isso costuma levar poucos segundos. Esta página atualiza sozinha,
                não precisa recarregar.
              </p>
            </>
          )}

          {(status.status === "canceled" || status.status === "expired") && (
            <>
              <span className="eyebrow">Pedido #{shortId}</span>
              <h1>{status.status === "expired" ? "O pagamento expirou" : "Pedido cancelado"}</h1>
              <p>
                Nenhuma cobrança foi feita. Se ainda quiser as peças, é só montar o
                carrinho de novo.
              </p>
            </>
          )}
        </section>

        {status.status === "paid" && (
          <section className="order-card">
            <h3>Acompanhe seu pedido</h3>
            <ol className="order-timeline">
              {TIMELINE.map((step, i) => (
                <li key={step.key} className={i < reached ? "done" : i === reached ? "current" : ""}>
                  <span className="dot" aria-hidden="true" />
                  <span>{step.label}</span>
                </li>
              ))}
            </ol>
            {status.trackingCode ? (
              <p className="order-tracking">
                Código de rastreio: <strong>{status.trackingCode}</strong>
              </p>
            ) : (
              <p className="order-muted">
                O código de rastreio aparece aqui assim que a peça for postada.
                Guarde o link desta página.
              </p>
            )}
          </section>
        )}

        <section className="order-card">
          <h3>Resumo</h3>
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
        </section>

        <div className="order-actions">
          <Link href="/loja" className={status.status === "paid" ? "btn btn-outline" : "btn btn-primary"}>
            {status.status === "paid" ? "Continuar comprando" : "Voltar para a loja"}
          </Link>
        </div>
      </div>
    </main>
  );
}
