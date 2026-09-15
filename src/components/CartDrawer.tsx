"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { cartSubtotalCents } from "@/lib/cart";
import { fmtBRL } from "@/lib/pricing";

export default function CartDrawer() {
  const { items, isDrawerOpen, closeDrawer, setQuantity, removeItem } = useCart();
  const subtotal = cartSubtotalCents(items);

  return (
    <>
      <div
        className={`cart-drawer-overlay${isDrawerOpen ? " open" : ""}`}
        onClick={closeDrawer}
      />
      <div className={`cart-drawer${isDrawerOpen ? " open" : ""}`}>
        <div className="cart-drawer-head">
          <h3>Seu carrinho</h3>
          <button className="cart-drawer-close" onClick={closeDrawer} aria-label="Fechar">
            ×
          </button>
        </div>
        <div className="cart-drawer-body">
          {items.length === 0 ? (
            <div className="cart-drawer-empty">Seu carrinho está vazio.</div>
          ) : (
            items.map((item) => (
              <div className="cart-line" key={item.productId}>
                <div className="thumb">
                  <Image src={item.image} alt={item.name} width={64} height={64} style={{ objectFit: "cover" }} />
                </div>
                <div className="info">
                  <span className="name">{item.name}</span>
                  <span className="price">{fmtBRL(item.unitPriceCents)}</span>
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
              </div>
            ))
          )}
        </div>
        {items.length > 0 && (
          <div className="cart-drawer-foot">
            <div className="cart-total-row">
              <span>Subtotal</span>
              <b>{fmtBRL(subtotal)}</b>
            </div>
            <Link
              href="/carrinho"
              className="btn btn-primary"
              style={{ width: "100%" }}
              onClick={closeDrawer}
            >
              Ver carrinho
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
