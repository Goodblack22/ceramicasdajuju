import Link from "next/link";
import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Product } from "@/lib/types";
import ProductForm from "../ProductForm";

export const metadata = { title: "Editar produto — Cerâmica da Juju" };

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const admin = createAdminClient();
  const { data: product } = await admin.from("juju_products").select("*").eq("id", id).maybeSingle();

  if (!product) notFound();

  return (
    <div>
      <Link href="/admin/produtos" className="admin-back-link">
        ← Voltar
      </Link>
      <h1 className="admin-page-title">Editar produto</h1>
      <ProductForm product={product as Product} />
    </div>
  );
}
