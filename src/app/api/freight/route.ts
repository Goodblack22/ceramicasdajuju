import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { calculateShipping } from "@/lib/melhorenvio";

export async function POST(req: Request) {
  const body = await req.json();
  const { destinationCep, items } = body as {
    destinationCep: string;
    items: { productId: string; quantity: number }[];
  };

  if (!destinationCep || !items?.length) {
    return NextResponse.json({ error: "CEP e itens são obrigatórios" }, { status: 400 });
  }

  const supabase = await createClient();
  const { data: products, error } = await supabase
    .from("juju_products")
    .select("id, weight_kg, width_cm, height_cm, length_cm, insurance_value_cents")
    .in(
      "id",
      items.map((i) => i.productId)
    );

  if (error || !products?.length) {
    return NextResponse.json({ error: "Produtos não encontrados" }, { status: 404 });
  }

  const meProducts = items.map((item) => {
    const p = products.find((prod) => prod.id === item.productId)!;
    return {
      id: p.id,
      width: Math.max(p.width_cm, 11),
      height: Math.max(p.height_cm, 2),
      length: Math.max(p.length_cm, 16),
      weight: Math.max(p.weight_kg, 0.1),
      insurance_value: p.insurance_value_cents / 100,
      quantity: item.quantity,
    };
  });

  try {
    const options = await calculateShipping(destinationCep, meProducts);
    return NextResponse.json({ options });
  } catch {
    return NextResponse.json({ error: "Falha ao consultar o frete" }, { status: 502 });
  }
}
