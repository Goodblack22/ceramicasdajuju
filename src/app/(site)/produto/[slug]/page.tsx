import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductBySlug, getRelatedProducts } from "@/lib/products";
import { categoryLabel } from "@/lib/format";
import ProductCard from "@/components/ProductCard";
import ProductGallery from "@/components/ProductGallery";
import ProductTabs from "@/components/ProductTabs";
import ProductPurchasePanel from "@/components/ProductPurchasePanel";
import FreightCalculator from "@/components/FreightCalculator";
import { fmtBRL, installmentsLabel } from "@/lib/pricing";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const related = await getRelatedProducts(product.id, 3);

  return (
    <main id="produto" className="page-enter">
      <div className="breadcrumb-bar">
        <Link href="/">Início</Link> / <Link href="/loja">Loja</Link> /{" "}
        <span>{product.name}</span>
      </div>

      <div className="product-detail">
        <ProductGallery images={product.images} name={product.name} />
        <div className="pd-info">
          <span className="cat">{categoryLabel(product.category)}</span>
          <h1>{product.name}</h1>
          <div className="pd-specs">{product.specs}</div>

          <div className="pd-price-block">
            <div className="pd-price-row">
              <b>{fmtBRL(product.price_cents)}</b>
            </div>
            <div className="pd-price-row">
              <small>{installmentsLabel(product.price_cents)}</small>
            </div>
          </div>

          <div className="pd-shipbadge">
            {product.stock_qty > 0
              ? "Pronta-entrega · envio em até 7 dias úteis"
              : "Sob encomenda · consulte prazo pelo WhatsApp"}
          </div>

          <FreightCalculator items={[{ productId: product.id, quantity: 1 }]} />

          <div
            className="pd-shipbadge"
            style={{
              background: "transparent",
              border: "1px dashed var(--brown-light)",
              color: "var(--brown)",
              marginBottom: 22,
            }}
          >
            Peça artesanal · pequenas variações fazem parte de cada exemplar
          </div>

          <ProductPurchasePanel product={product} />

          <div className="pd-share">
            <span className="label">Compartilhe</span>
            <div className="icn">
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
              </svg>
            </div>
            <div className="icn">
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8">
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1" />
              </svg>
            </div>
            <div className="icn">
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <ProductTabs description={product.description} />

      <div className="container">
        <div className="section-head related-head">
          <span className="eyebrow">Combine também com</span>
          <h2>Veja também</h2>
        </div>
        <div className="grid-products" style={{ marginBottom: 80 }}>
          {related.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </main>
  );
}
