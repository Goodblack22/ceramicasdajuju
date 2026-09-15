"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { fmtBRL } from "@/lib/pricing";
import type { Product } from "@/lib/types";

export default function ProductPurchasePanel({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [showSticky, setShowSticky] = useState(false);
  const outOfStock = product.stock_qty <= 0;

  useEffect(() => {
    function onScroll() {
      setShowSticky(window.scrollY > 420);
    }
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function handleAdd() {
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image: product.images[0],
      unitPriceCents: product.price_cents,
      quantity: 1,
      weightKg: product.weight_kg,
      widthCm: product.width_cm,
      heightCm: product.height_cm,
      lengthCm: product.length_cm,
      stockQty: product.stock_qty,
    });
  }

  return (
    <>
      <div className="pd-actions">
        <button className="btn btn-primary" disabled={outOfStock} onClick={handleAdd}>
          {outOfStock ? "Produto esgotado" : "Comprar agora"}
        </button>
      </div>

      <div className={`sticky-buy${showSticky ? " show" : ""}`}>
        <div className="thumb">
          <Image src={product.images[0]} alt="" width={48} height={48} style={{ objectFit: "cover" }} />
        </div>
        <div className="name">{product.name}</div>
        <div className="price">{fmtBRL(product.price_cents)}</div>
        <button className="btn btn-primary" disabled={outOfStock} onClick={handleAdd}>
          Comprar
        </button>
      </div>
    </>
  );
}
