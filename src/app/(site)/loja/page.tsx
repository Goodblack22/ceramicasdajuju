import Link from "next/link";
import { getProductsByCategory } from "@/lib/products";
import ProductCard from "@/components/ProductCard";
import type { ProductCategory } from "@/lib/types";

const CHIPS: { key: ProductCategory | "todos"; label: string }[] = [
  { key: "todos", label: "Todos" },
  { key: "pratos", label: "Pratos" },
  { key: "cozinha", label: "Cozinha" },
  { key: "decoracao", label: "Decoração" },
];

export default async function LojaPage({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string }>;
}) {
  const { cat } = await searchParams;
  const activeCat = (cat as ProductCategory | undefined) ?? "todos";
  const products = await getProductsByCategory(activeCat);

  return (
    <main id="loja" className="page-enter">
      <div className="breadcrumb-bar">
        <Link href="/">Início</Link> / Loja
      </div>
      <div className="page-title-block">
        <span className="eyebrow">Loja</span>
        <h1>Nossa coleção</h1>
      </div>
      <div className="container" style={{ padding: "30px 24px 80px" }}>
        <div className="filters">
          {CHIPS.map((chip) => (
            <Link
              key={chip.key}
              href={chip.key === "todos" ? "/loja" : `/loja?cat=${chip.key}`}
              className={`chip${activeCat === chip.key ? " active" : ""}`}
            >
              {chip.label}
            </Link>
          ))}
        </div>
        <div className="grid-products">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </main>
  );
}
