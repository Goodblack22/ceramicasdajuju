"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { cartSubtotalCents } from "@/lib/cart";
import { fmtBRL } from "@/lib/pricing";

export default function CarrinhoPage() {
  const { items, isHydrated, setQuantity, removeItem } = useCart();
  const subtotal = cartSubtotalCents(items);

  return (
    <main className="page-enter">
      <div className="breadcrumb-bar">
        <Link href="/">Início</Link> / Carrinho
      </div>
      <div className="page-title-block">
        <span className="eyebrow">Seu carrinho</span>
        <h1>Carrinho de compras</h1>
      </div>

      <div className="container" style={{ padding: "10px 24px 80px", maxWidth: 760 }}>
        {!isHydrated ? null : items.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <p style={{ marginBottom: 20, color: "#8a7a66" }}>Seu carrinho está vazio.</p>
            <Link href="/loja" className="btn btn-primary">Ver coleção</Link>
          </div>
        ) : (
          <>
            {items.map((item) => (
              <div className="cart-line" key={item.productId} style={{ alignItems: "center" }}>
                <div className="thumb" style={{ width: 90, height: 90 }}>
                  <Image src={item.image} alt={item.name} width={90} height={90} style={{ objectFit: "cover" }} />
                </div>
                <div className="info">
                  <span className="name">{item.name}</span>
                  <span className="price">{fmtBRL(item.unitPriceCents)} cada</span>
                  <div className="qty-row">
                    <button onClick={() => setQuantity(item.productId, item.quantity - 1)}>−</button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => setQuantity(item.productId, item.quantity + 1)}
                      disabled={item.quantity >= item.stockQty}
                    >
                      +
                    </button>
                  </div>
                  <button className="remove" onClick={() => removeItem(item.productId)}>
                    remover
                  </button>
                </div>
                <b style={{ fontFamily: "'Playfair Display',serif", fontSize: 17, color: "var(--brown-dark)" }}>
                  {fmtBRL(item.unitPriceCents * item.quantity)}
                </b>
              </div>
            ))}

            <div style={{ marginTop: 24 }}>
              <div className="summary-line total">
                <span>Subtotal</span>
                <span>{fmtBRL(subtotal)}</span>
              </div>
              <p style={{ fontSize: 12.5, color: "#8a7a66", margin: "8px 0 20px" }}>
                Frete calculado na próxima etapa, a partir do seu CEP.
              </p>
              <Link href="/checkout" className="btn btn-primary" style={{ width: "100%" }}>
                Continuar para o checkout
              </Link>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
