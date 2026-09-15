"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { fmtBRL, installmentsLabel } from "@/lib/pricing";
import { categoryLabel } from "@/lib/format";
import type { Product } from "@/lib/types";

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const outOfStock = product.stock_qty <= 0;

  return (
    <div className="p-card">
      <Link href={`/produto/${product.slug}`} style={{ display: "contents" }}>
        <div className="thumb">
          {product.tag && <span className="p-tag">{product.tag}</span>}
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 560px) 100vw, (max-width: 1000px) 50vw, 25vw"
            style={{ objectFit: "cover" }}
          />
        </div>
        <div className="p-info">
          <span className="cat">{categoryLabel(product.category)}</span>
          <h3>{product.name}</h3>
          <div className="p-price-block">
            <div className="p-price-row">
              <b>{fmtBRL(product.price_cents)}</b>
            </div>
            <div className="p-price-row card-row">{installmentsLabel(product.price_cents)}</div>
          </div>
        </div>
      </Link>
      <button
        className="p-buy-btn"
        disabled={outOfStock}
        onClick={(e) => {
          e.preventDefault();
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
        }}
      >
        {outOfStock ? "Esgotado" : "Comprar"}
      </button>
    </div>
  );
}
