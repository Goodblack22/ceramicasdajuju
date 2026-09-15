import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { checkPayment } from "@/lib/infinitepay";
import type { OrderStatusResponse } from "@/lib/types";

const ORDERS_TABLE = "juju_orders";
const ORDER_ITEMS_TABLE = "juju_order_items";

export async function resolveOrderStatus(
  orderId: string,
  redirectParams?: { transactionNsu?: string; slug?: string }
): Promise<OrderStatusResponse | null> {
  const supabase = createAdminClient();

  const { data: order, error } = await supabase
    .from(ORDERS_TABLE)
    .select("*")
    .eq("id", orderId)
    .maybeSingle();

  if (error || !order) return null;

  if (
    order.status === "pending" &&
    redirectParams?.transactionNsu &&
    (redirectParams.slug || order.infinitepay_slug)
  ) {
    try {
      const check = await checkPayment({
        orderNsu: order.id,
        transactionNsu: redirectParams.transactionNsu,
        slug: redirectParams.slug ?? order.infinitepay_slug,
      });
      if (check.paid) {
        await supabase.rpc("juju_confirm_order_paid", {
          p_order_id: order.id,
          p_transaction_nsu: redirectParams.transactionNsu,
          p_capture_method: check.captureMethod,
          p_paid_amount_cents: check.paidAmountCents,
        });
        order.status = "paid";
        order.capture_method = check.captureMethod;
        order.paid_at = new Date().toISOString();
      }
    } catch {
      // payment_check failed — leave order as pending, client can retry via polling
    }
  }

  const { data: items } = await supabase
    .from(ORDER_ITEMS_TABLE)
    .select("product_name, quantity, unit_price_cents")
    .eq("order_id", order.id);

  return {
    status: order.status,
    totalCents: order.total_cents,
    itemsSubtotalCents: order.items_subtotal_cents,
    shippingCostCents: order.shipping_cost_cents,
    shippingMethod: order.shipping_method,
    captureMethod: order.capture_method,
    paidAt: order.paid_at,
    items: (items ?? []).map((i) => ({
      productName: i.product_name,
      quantity: i.quantity,
      unitPriceCents: i.unit_price_cents,
    })),
  };
}
