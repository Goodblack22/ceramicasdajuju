import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { checkPayment } from "@/lib/infinitepay";

/**
 * InfinitePay webhook payloads have no documented signature verification,
 * so this handler never trusts the body for money-affecting writes — it
 * only uses it as a trigger to re-confirm payment via payment_check.
 */
export async function POST(req: Request) {
  let payload: Record<string, unknown>;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ ok: true });
  }

  const orderNsu = (payload.order_nsu ?? payload.orderNsu) as string | undefined;
  const transactionNsu = (payload.transaction_nsu ?? payload.transactionNsu) as string | undefined;
  const slug = payload.slug as string | undefined;

  if (!orderNsu) {
    return NextResponse.json({ ok: true });
  }

  const supabase = createAdminClient();
  const { data: order } = await supabase
    .from("juju_orders")
    .select("id, status, infinitepay_slug")
    .eq("id", orderNsu)
    .maybeSingle();

  if (!order) {
    return NextResponse.json({ ok: true });
  }

  if (order.status === "paid") {
    return NextResponse.json({ ok: true });
  }

  try {
    const check = await checkPayment({
      orderNsu: order.id,
      transactionNsu: transactionNsu ?? "",
      slug: slug ?? order.infinitepay_slug ?? "",
    });

    if (check.paid) {
      await supabase.rpc("juju_confirm_order_paid", {
        p_order_id: order.id,
        p_transaction_nsu: transactionNsu ?? null,
        p_capture_method: check.captureMethod,
        p_paid_amount_cents: check.paidAmountCents,
      });
    }
  } catch {
    // transient failure — InfinitePay will retry the webhook, and the RPC is idempotent
  }

  return NextResponse.json({ ok: true });
}
