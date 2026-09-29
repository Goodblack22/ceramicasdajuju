import "server-only";

const LINKS_URL = "https://api.checkout.infinitepay.io/links";
const PAYMENT_CHECK_URL = "https://api.checkout.infinitepay.io/payment_check";

export type CreatePaymentLinkInput = {
  orderNsu: string;
  items: { quantity: number; priceCents: number; description: string }[];
  redirectUrl: string;
  webhookUrl: string;
  customer: { name: string; email: string; phoneNumber?: string };
  address?: {
    cep: string;
    street: string;
    neighborhood: string;
    number: string;
    complement?: string;
  };
};

export type CreatePaymentLinkResult = {
  checkoutUrl: string;
  // Not returned by /links in practice (response is just `{ url }`); the real
  // slug arrives later via the redirect query string and the webhook payload.
  slug: string | null;
};

/**
 * NOTE: the exact field names in InfinitePay's /links response weren't
 * fully documented at implementation time — `url`/`slug` are the expected
 * shape based on their docs, but verify against a live response and adjust
 * the fallbacks below if the real payload differs.
 */
export async function createPaymentLink(
  input: CreatePaymentLinkInput
): Promise<CreatePaymentLinkResult> {
  const handle = process.env.INFINITEPAY_HANDLE!;

  const res = await fetch(LINKS_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      handle,
      order_nsu: input.orderNsu,
      redirect_url: input.redirectUrl,
      webhook_url: input.webhookUrl,
      items: input.items.map((i) => ({
        quantity: i.quantity,
        price: i.priceCents,
        description: i.description,
      })),
      customer: {
        name: input.customer.name,
        email: input.customer.email,
        phone_number: input.customer.phoneNumber,
      },
      address: input.address
        ? {
            cep: input.address.cep,
            street: input.address.street,
            neighborhood: input.address.neighborhood,
            number: input.address.number,
            complement: input.address.complement,
          }
        : undefined,
    }),
    cache: "no-store",
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`InfinitePay /links respondeu ${res.status}: ${body}`);
  }

  const data = await res.json();
  const checkoutUrl = data.url ?? data.checkout_url ?? data.link;
  const slug = data.slug ?? data.id ?? null;

  if (!checkoutUrl) {
    throw new Error("InfinitePay /links: resposta sem url");
  }

  return { checkoutUrl, slug };
}

export type PaymentCheckResult = {
  paid: boolean;
  amountCents: number;
  paidAmountCents: number;
  installments: number;
  captureMethod: "credit_card" | "pix" | null;
};

export async function checkPayment(params: {
  orderNsu: string;
  transactionNsu: string;
  slug: string;
}): Promise<PaymentCheckResult> {
  const handle = process.env.INFINITEPAY_HANDLE!;

  const res = await fetch(PAYMENT_CHECK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      handle,
      order_nsu: params.orderNsu,
      transaction_nsu: params.transactionNsu,
      slug: params.slug,
    }),
    cache: "no-store",
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`InfinitePay /payment_check respondeu ${res.status}: ${body}`);
  }

  const data = await res.json();
  return {
    paid: Boolean(data.paid),
    amountCents: data.amount ?? 0,
    paidAmountCents: data.paid_amount ?? 0,
    installments: data.installments ?? 1,
    captureMethod: data.capture_method ?? null,
  };
}
