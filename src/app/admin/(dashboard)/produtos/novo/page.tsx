import Link from "next/link";
import ProductForm from "../ProductForm";

export const metadata = { title: "Novo produto — Cerâmica da Juju" };

export default function NewProductPage() {
  return (
    <div>
      <Link href="/admin/produtos" className="admin-back-link">
        ← Voltar
      </Link>
      <h1 className="admin-page-title">Novo produto</h1>
      <ProductForm />
    </div>
  );
}
