export function fmtBRL(cents: number): string {
  return "R$ " + (cents / 100).toFixed(2).replace(".", ",");
}

export function installments(priceCents: number): { n: number; valCents: number } {
  const priceReais = priceCents / 100;
  const n = priceReais >= 120 ? 3 : priceReais >= 80 ? 2 : 1;
  return { n, valCents: Math.round(priceCents / n) };
}

export function installmentsLabel(priceCents: number): string {
  const { n, valCents } = installments(priceCents);
  if (n === 1) return `${fmtBRL(priceCents)} à vista`;
  return `em até ${n}x de ${fmtBRL(valCents)} sem juros`;
}
