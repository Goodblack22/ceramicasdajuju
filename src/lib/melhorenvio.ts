import "server-only";
import type { FreightOption } from "./types";

type QuoteProduct = {
  id: string;
  width: number;
  height: number;
  length: number;
  weight: number;
  insurance_value: number;
  quantity: number;
};

type MelhorEnvioService = {
  id: number;
  name: string;
  price?: string;
  custom_price?: string;
  delivery_time?: number;
  custom_delivery_time?: number;
  company?: { name: string };
  error?: string;
};

export class InvalidCepError extends Error {}

export async function calculateShipping(
  destinationCep: string,
  products: QuoteProduct[]
): Promise<FreightOption[]> {
  const baseUrl = process.env.MELHOR_ENVIO_BASE_URL!;
  const token = process.env.MELHOR_ENVIO_TOKEN!;
  const originCep = process.env.STORE_ORIGIN_CEP!;

  const res = await fetch(`${baseUrl}/api/v2/me/shipment/calculate`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
      "User-Agent": process.env.MELHOR_ENVIO_USER_AGENT || "Ceramica da Juju",
    },
    body: JSON.stringify({
      from: { postal_code: onlyDigits(originCep) },
      to: { postal_code: onlyDigits(destinationCep) },
      products,
    }),
    cache: "no-store",
  });

  if (!res.ok) {
    const body = await res.text();
    // 422 = CEP de destino inexistente (ex.: CEP genérico de cidade)
    if (res.status === 422) throw new InvalidCepError(body);
    throw new Error(`Melhor Envio respondeu ${res.status}: ${body}`);
  }

  const raw = await res.json();
  const services: MelhorEnvioService[] = Array.isArray(raw) ? raw : [raw];

  return services
    .filter((s) => !s.error && (s.custom_price || s.price))
    .map((s) => ({
      id: s.id,
      name: s.name,
      company: s.company?.name ?? "",
      priceCents: Math.round(parseFloat(s.custom_price ?? s.price ?? "0") * 100),
      deliveryDays: s.custom_delivery_time ?? s.delivery_time ?? 0,
    }));
}

function onlyDigits(v: string): string {
  return v.replace(/\D/g, "");
}
