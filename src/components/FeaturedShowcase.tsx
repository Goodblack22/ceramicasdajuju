"use client";

import { useState } from "react";
import ProductCard from "./ProductCard";
import type { Product, ProductCategory } from "@/lib/types";

const CHIPS: { key: ProductCategory | "todos"; label: string }[] = [
  { key: "todos", label: "Todos" },
  { key: "pratos", label: "Pratos" },
  { key: "cozinha", label: "Cozinha" },
  { key: "decoracao", label: "Decoração" },
];

export default function FeaturedShowcase({
  allProducts,
  featuredIds,
}: {
  allProducts: Product[];
  featuredIds: string[];
}) {
  const [filter, setFilter] = useState<ProductCategory | "todos">("todos");

  const base = allProducts.filter((p) => featuredIds.includes(p.id));
  const visible = filter === "todos" ? base : allProducts.filter((p) => p.category === filter);

  return (
    <>
      <div className="filters">
        {CHIPS.map((chip) => (
          <div
            key={chip.key}
            className={`chip${filter === chip.key ? " active" : ""}`}
            onClick={() => setFilter(chip.key)}
          >
            {chip.label}
          </div>
        ))}
      </div>
      <div className="grid-products">
        {visible.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </>
  );
}
