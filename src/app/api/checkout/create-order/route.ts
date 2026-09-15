import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createPaymentLink } from "@/lib/infinitepay";

type Body = {
  items: { productId: string; quantity: number }[];
  customer: { name: string; email: string; phone?: string };
  shipping: {
    cep: string;
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    method: string;
    costCents: number;
  };
};

export async function POST(req: Request) {
  const body: Body = await req.json();
  const { items, customer, shipping } = body;

  if (!items?.length || !customer?.name || !customer?.email || !shipping?.cep) {
    return NextResponse.json({ error: "Dados incompletos" }, { status: 400 });
  }

  const supabase = createAdminClient();

  const { data: products, error: productsError } = await supabase
    .from("juju_products")
    .select("id, name, price_cents, stock_qty, active")
    .in(
      "id",
      items.map((i) => i.productId)
    );

  if (productsError || !products) {
    return NextResponse.json({ error: "Não foi possível validar os produtos" }, { status: 500 });
  }

  const orderItems: { product_id: string; product_name: string; unit_price_cents: number; quantity: number; line_total_cents: number }[] = [];
  let subtotalCents = 0;

  for (const item of items) {
    const product = products.find((p) => p.id === item.productId);
    if (!product || !product.active) {
      return NextResponse.json({ error: "Um dos produtos não está mais disponível" }, { status: 409 });
    }
    if (item.quantity < 1 || item.quantity > product.stock_qty) {
      return NextResponse.json(
        { error: `Estoque insuficiente para "${product.name}" (disponível: ${product.stock_qty})` },
        { status: 409 }
      );
    }
    const lineTotal = product.price_cents * item.quantity;
    subtotalCents += lineTotal;
    orderItems.push({
      product_id: product.id,
      product_name: product.name,
      unit_price_cents: product.price_cents,
      quantity: item.quantity,
      line_total_cents: lineTotal,
    });
  }

  const shippingCostCents = Math.max(0, Math.round(shipping.costCents));
  const totalCents = subtotalCents + shippingCostCents;

  const { data: order, error: orderError } = await supabase
    .from("juju_orders")
    .insert({
      status: "pending",
      customer_name: customer.name,
      customer_email: customer.email,
      customer_phone: customer.phone ?? null,
      shipping_cep: shipping.cep,
      shipping_address: {
        street: shipping.street,
        number: shipping.number,
        complement: shipping.complement ?? "",
        neighborhood: shipping.neighborhood,
        city: shipping.city,
        state: shipping.state,
      },
      shipping_method: shipping.method,
      shipping_cost_cents: shippingCostCents,
      items_subtotal_cents: subtotalCents,
      total_cents: totalCents,
    })
    .select()
    .single();

  if (orderError || !order) {
    return NextResponse.json({ error: "Não foi possível criar o pedido" }, { status: 500 });
  }

  const { error: itemsError } = await supabase
    .from("juju_order_items")
    .insert(orderItems.map((i) => ({ ...i, order_id: order.id })));

  if (itemsError) {
    return NextResponse.json({ error: "Não foi possível registrar os itens do pedido" }, { status: 500 });
  }

  const siteUrl = process.env.SITE_URL!;

  try {
    const linkItems = orderItems.map((i) => ({
      quantity: i.quantity,
      priceCents: i.unit_price_cents,
      description: i.product_name,
    }));
    if (shippingCostCents > 0) {
      linkItems.push({ quantity: 1, priceCents: shippingCostCents, description: `Frete — ${shipping.method}` });
    }

    const { checkoutUrl, slug } = await createPaymentLink({
      orderNsu: order.id,
      items: linkItems,
      redirectUrl: `${siteUrl}/pedido/${order.id}`,
      webhookUrl: `${siteUrl}/api/webhooks/infinitepay`,
      customer: { name: customer.name, email: customer.email, phoneNumber: customer.phone },
      address: {
        cep: shipping.cep,
        street: shipping.street,
        neighborhood: shipping.neighborhood,
        number: shipping.number,
        complement: shipping.complement,
      },
    });

    await supabase
      .from("juju_orders")
      .update({ infinitepay_slug: slug, infinitepay_checkout_url: checkoutUrl })
      .eq("id", order.id);

    return NextResponse.json({ checkoutUrl, orderId: order.id });
  } catch {
    return NextResponse.json(
      { error: "Pedido criado, mas houve falha ao gerar o link de pagamento. Tente novamente." },
      { status: 502 }
    );
  }
}
