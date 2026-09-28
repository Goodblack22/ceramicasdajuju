"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { upsertProduct, uploadProductImage, type ProductFormInput } from "@/app/admin/actions";
import type { Product } from "@/lib/types";

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function ProductForm({ product }: { product?: Product }) {
  const router = useRouter();
  const [name, setName] = useState(product?.name ?? "");
  const [slug, setSlug] = useState(product?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(!!product);
  const [category, setCategory] = useState(product?.category ?? "pratos");
  const [description, setDescription] = useState(product?.description ?? "");
  const [specs, setSpecs] = useState(product?.specs ?? "");
  const [tag, setTag] = useState(product?.tag ?? "");
  const [priceReais, setPriceReais] = useState(product ? (product.price_cents / 100).toFixed(2) : "");
  const [stockQty, setStockQty] = useState(product?.stock_qty ?? 10);
  const [weightKg, setWeightKg] = useState(product?.weight_kg ?? 0.4);
  const [widthCm, setWidthCm] = useState(product?.width_cm ?? 15);
  const [heightCm, setHeightCm] = useState(product?.height_cm ?? 15);
  const [lengthCm, setLengthCm] = useState(product?.length_cm ?? 8);
  const [active, setActive] = useState(product?.active ?? true);
  const [images, setImages] = useState<string[]>(product?.images ?? []);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const url = await uploadProductImage(formData);
      setImages((prev) => [...prev, url]);
    } catch {
      setError("Falha ao enviar a foto. Tente novamente.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  function removeImage(url: string) {
    setImages((prev) => prev.filter((i) => i !== url));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const priceCents = Math.round(parseFloat(priceReais.replace(",", ".")) * 100);
    if (!name || !slug || Number.isNaN(priceCents) || images.length === 0) {
      setError("Preencha nome, slug, preço e adicione ao menos uma foto.");
      return;
    }

    setSaving(true);
    const input: ProductFormInput = {
      id: product?.id,
      slug,
      name,
      category,
      description,
      specs,
      tag: tag || null,
      price_cents: priceCents,
      images,
      stock_qty: Number(stockQty),
      weight_kg: Number(weightKg),
      width_cm: Number(widthCm),
      height_cm: Number(heightCm),
      length_cm: Number(lengthCm),
      insurance_value_cents: priceCents,
      active,
    };

    try {
      await upsertProduct(input);
      router.push("/admin/produtos");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao salvar o produto.");
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="admin-product-form">
      <div className="form-block">
        <label className="label">Nome</label>
        <input
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (!slugTouched) setSlug(slugify(e.target.value));
          }}
          required
        />
      </div>

      <div className="form-block">
        <label className="label">Slug (URL)</label>
        <input
          value={slug}
          onChange={(e) => {
            setSlug(e.target.value);
            setSlugTouched(true);
          }}
          required
        />
      </div>

      <div className="form-row">
        <div className="form-block" style={{ flex: 1 }}>
          <label className="label">Categoria</label>
          <select value={category} onChange={(e) => setCategory(e.target.value as typeof category)}>
            <option value="pratos">Pratos</option>
            <option value="cozinha">Cozinha</option>
            <option value="decoracao">Decoração</option>
          </select>
        </div>
        <div className="form-block" style={{ flex: 1 }}>
          <label className="label">Etiqueta (opcional)</label>
          <input value={tag ?? ""} onChange={(e) => setTag(e.target.value)} placeholder="Ex: Mais vendido, Novo" />
        </div>
      </div>

      <div className="form-block">
        <label className="label">Descrição</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} />
      </div>

      <div className="form-block">
        <label className="label">Especificações (ex: dimensões, material)</label>
        <input value={specs} onChange={(e) => setSpecs(e.target.value)} />
      </div>

      <div className="form-row">
        <div className="form-block" style={{ flex: 1 }}>
          <label className="label">Preço (R$)</label>
          <input value={priceReais} onChange={(e) => setPriceReais(e.target.value)} placeholder="69,90" required />
        </div>
        <div className="form-block" style={{ flex: 1 }}>
          <label className="label">Estoque</label>
          <input type="number" min={0} value={stockQty} onChange={(e) => setStockQty(Number(e.target.value))} />
        </div>
      </div>

      <div className="form-row">
        <div className="form-block" style={{ flex: 1 }}>
          <label className="label">Peso (kg)</label>
          <input type="number" step="0.01" value={weightKg} onChange={(e) => setWeightKg(Number(e.target.value))} />
        </div>
        <div className="form-block" style={{ flex: 1 }}>
          <label className="label">Largura (cm)</label>
          <input type="number" value={widthCm} onChange={(e) => setWidthCm(Number(e.target.value))} />
        </div>
        <div className="form-block" style={{ flex: 1 }}>
          <label className="label">Altura (cm)</label>
          <input type="number" value={heightCm} onChange={(e) => setHeightCm(Number(e.target.value))} />
        </div>
        <div className="form-block" style={{ flex: 1 }}>
          <label className="label">Comprimento (cm)</label>
          <input type="number" value={lengthCm} onChange={(e) => setLengthCm(Number(e.target.value))} />
        </div>
      </div>

      <div className="form-block">
        <label className="label">Fotos</label>
        <div className="admin-image-grid">
          {images.map((url) => (
            // eslint-disable-next-line @next/next/no-img-element
            <div key={url} className="admin-image-item">
              <img src={url} alt="" />
              <button type="button" onClick={() => removeImage(url)}>
                Remover
              </button>
            </div>
          ))}
        </div>
        <input type="file" accept="image/*" onChange={handleFileChange} disabled={uploading} />
        {uploading && <p className="admin-hint">Enviando foto...</p>}
      </div>

      <div className="form-block">
        <label className="admin-checkbox-label">
          <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} />
          Produto ativo (visível na loja)
        </label>
      </div>

      {error && <p className="error-text">{error}</p>}

      <button type="submit" className="btn btn-primary" disabled={saving || uploading}>
        {saving ? "Salvando..." : "Salvar produto"}
      </button>
    </form>
  );
}
