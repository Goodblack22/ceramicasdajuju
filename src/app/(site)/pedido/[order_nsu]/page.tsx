import { notFound } from "next/navigation";
import { resolveOrderStatus } from "@/lib/orders";
import OrderStatusView from "@/components/OrderStatusView";

export default async function OrderStatusPage({
  params,
  searchParams,
}: {
  params: Promise<{ order_nsu: string }>;
  searchParams: Promise<{ transaction_nsu?: string; slug?: string }>;
}) {
  const { order_nsu } = await params;
  const { transaction_nsu, slug } = await searchParams;

  const status = await resolveOrderStatus(order_nsu, { transactionNsu: transaction_nsu, slug });
  if (!status) notFound();

  return <OrderStatusView orderId={order_nsu} initial={status} />;
}
