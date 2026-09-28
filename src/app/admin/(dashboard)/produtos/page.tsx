import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { fmtBRL } from "@/lib/pricing";
import { toggleProductActive } from "@/app/admin/actions";

export const metadata = { title: "Produtos — Cerâmica da Juju" };

export default async function AdminProductsPage() {
  const admin = createAdminClient();
  const { data: products } = await admin
    .from("juju_products")
    .select("id, name, category, price_cents, stock_qty, active, images")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="admin-page-head">
        <h1 className="admin-page-title">Produtos</h1>
        <Link href="/admin/produtos/novo" className="btn btn-primary">
          + Novo produto
        </Link>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th></th>
            <th>Nome</th>
            <th>Categoria</th>
            <th>Preço</th>
            <th>Estoque</th>
            <th>Ativo</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {(products ?? []).map((p) => (
            <tr key={p.id}>
              <td>
                {p.images?.[0] && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.images[0]} alt="" className="admin-thumb" />
                )}
              </td>
              <td>
                <Link href={`/admin/produtos/${p.id}`}>{p.name}</Link>
              </td>
              <td>{p.category}</td>
              <td>{fmtBRL(p.price_cents)}</td>
              <td>{p.stock_qty}</td>
              <td>
                <form
                  action={async () => {
                    "use server";
                    await toggleProductActive(p.id, !p.active);
                  }}
                >
                  <button type="submit" className={`admin-toggle ${p.active ? "on" : ""}`}>
                    {p.active ? "Ativo" : "Inativo"}
                  </button>
                </form>
              </td>
              <td>
                <Link href={`/admin/produtos/${p.id}`} className="admin-edit-link">
                  Editar
                </Link>
              </td>
            </tr>
          ))}
          {(products ?? []).length === 0 && (
            <tr>
              <td colSpan={7} className="admin-empty">
                Nenhum produto cadastrado.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
