"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { cartSubtotalCents } from "@/lib/cart";
import { fmtBRL } from "@/lib/pricing";
import type { FreightOption } from "@/lib/types";

export default function CheckoutPage() {
  const { items, isHydrated, clearCart } = useCart();
  const subtotal = cartSubtotalCents(items);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [cep, setCep] = useState("");
  const [street, setStreet] = useState("");
  const [number, setNumber] = useState("");
  const [complement, setComplement] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");

  const [freightOptions, setFreightOptions] = useState<FreightOption[] | null>(null);
  const [selectedFreight, setSelectedFreight] = useState<FreightOption | null>(null);
  const [freightLoading, setFreightLoading] = useState(false);
  const [freightError, setFreightError] = useState<string | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const total = subtotal + (selectedFreight?.priceCents ?? 0);

  async function handleCalculateFreight() {
    setFreightError(null);
    setFreightOptions(null);
    setSelectedFreight(null);
    if (cep.replace(/\D/g, "").length !== 8) {
      setFreightError("Digite um CEP válido (8 dígitos).");
      return;
    }
    setFreightLoading(true);
    try {
      const res = await fetch("/api/freight", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destinationCep: cep,
          items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 400 && data.error) {
          setFreightError(data.error);
          return;
        }
        throw new Error();
      }
      setFreightOptions(data.options);
      if (data.options?.length) setSelectedFreight(data.options[0]);
    } catch {
      setFreightError("Não foi possível calcular o frete agora. Tente novamente.");
    } finally {
      setFreightLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError(null);

    if (!selectedFreight) {
      setSubmitError("Calcule e escolha uma opção de frete antes de continuar.");
      return;
    }
    if (!name || !email || !street || !number || !neighborhood || !city || !state) {
      setSubmitError("Preencha todos os campos obrigatórios.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/checkout/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
          customer: { name, email, phone },
          shipping: {
            cep,
            street,
            number,
            complement,
            neighborhood,
            city,
            state,
            method: selectedFreight.name,
            costCents: selectedFreight.priceCents,
          },
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setSubmitError(data.error ?? "Não foi possível criar o pedido. Tente novamente.");
        setSubmitting(false);
        return;
      }
      clearCart();
      window.location.href = data.checkoutUrl;
    } catch {
      setSubmitError("Erro de conexão. Tente novamente.");
      setSubmitting(false);
    }
  }

  if (isHydrated && items.length === 0) {
    return (
      <main className="page-enter">
        <div className="container" style={{ padding: "60px 24px", textAlign: "center" }}>
          <p style={{ marginBottom: 20, color: "#8a7a66" }}>Seu carrinho está vazio.</p>
          <Link href="/loja" className="btn btn-primary">Ver coleção</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="page-enter">
      <div className="breadcrumb-bar">
        <Link href="/">Início</Link> / <Link href="/carrinho">Carrinho</Link> / Checkout
      </div>
      <div className="page-title-block">
        <span className="eyebrow">Finalizar</span>
        <h1>Checkout</h1>
      </div>

      <form className="checkout-grid" onSubmit={handleSubmit}>
        <div>
          <div className="form-block">
            <span className="label">Seus dados</span>
            <div className="form-row">
              <input placeholder="Nome completo" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="form-row">
              <input type="email" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} required />
              <input placeholder="Telefone / WhatsApp" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
          </div>

          <div className="form-block">
            <span className="label">Endereço de entrega</span>
            <div className="form-row">
              <input placeholder="CEP" value={cep} onChange={(e) => setCep(e.target.value)} required />
              <button type="button" className="btn btn-outline" onClick={handleCalculateFreight} disabled={freightLoading}>
                {freightLoading ? "Calculando..." : "Calcular frete"}
              </button>
            </div>
            {freightError && <div className="freight-error">{freightError}</div>}
            {freightOptions && (
              <ul className="freight-options">
                {freightOptions.map((opt) => (
                  <li
                    key={opt.id}
                    className={selectedFreight?.id === opt.id ? "active" : ""}
                    onClick={() => setSelectedFreight(opt)}
                  >
                    <span>{opt.company} — {opt.name} ({opt.deliveryDays} dias úteis)</span>
                    <b>{fmtBRL(opt.priceCents)}</b>
                  </li>
                ))}
              </ul>
            )}
            <div className="form-row">
              <input placeholder="Rua" value={street} onChange={(e) => setStreet(e.target.value)} required />
              <input placeholder="Número" value={number} onChange={(e) => setNumber(e.target.value)} required />
            </div>
            <div className="form-row">
              <input placeholder="Complemento" value={complement} onChange={(e) => setComplement(e.target.value)} />
              <input placeholder="Bairro" value={neighborhood} onChange={(e) => setNeighborhood(e.target.value)} required />
            </div>
            <div className="form-row">
              <input placeholder="Cidade" value={city} onChange={(e) => setCity(e.target.value)} required />
              <input placeholder="UF" value={state} onChange={(e) => setState(e.target.value)} maxLength={2} required />
            </div>
          </div>

          {submitError && <div className="error-text">{submitError}</div>}

          <button className="btn btn-primary" type="submit" disabled={submitting} style={{ width: "100%" }}>
            {submitting ? "Gerando pagamento..." : "Ir para pagamento"}
          </button>
        </div>

        <aside className="checkout-summary">
          <h3>Resumo do pedido</h3>
          {items.map((item) => (
            <div className="summary-line" key={item.productId}>
              <span>{item.quantity}x {item.name}</span>
              <span>{fmtBRL(item.unitPriceCents * item.quantity)}</span>
            </div>
          ))}
          <div className="summary-line">
            <span>Subtotal</span>
            <span>{fmtBRL(subtotal)}</span>
          </div>
          <div className="summary-line">
            <span>Frete</span>
            <span>{selectedFreight ? fmtBRL(selectedFreight.priceCents) : "—"}</span>
          </div>
          <div className="summary-line total">
            <span>Total</span>
            <span>{fmtBRL(total)}</span>
          </div>
        </aside>
      </form>
    </main>
  );
}
