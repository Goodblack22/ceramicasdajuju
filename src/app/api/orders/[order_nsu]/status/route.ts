import { NextResponse } from "next/server";
import { resolveOrderStatus } from "@/lib/orders";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ order_nsu: string }> }
) {
  const { order_nsu } = await params;
  const { searchParams } = new URL(req.url);

  const result = await resolveOrderStatus(order_nsu, {
    transactionNsu: searchParams.get("transaction_nsu") ?? undefined,
    slug: searchParams.get("slug") ?? undefined,
  });

  if (!result) {
    return NextResponse.json({ error: "Pedido não encontrado" }, { status: 404 });
  }

  return NextResponse.json(result);
}
