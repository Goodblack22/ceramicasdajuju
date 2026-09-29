"use client";

import { useState } from "react";
import { fmtBRL } from "@/lib/pricing";
import type { FreightOption } from "@/lib/types";

export default function FreightCalculator({
  items,
  onSelect,
  selectedId,
}: {
  items: { productId: string; quantity: number }[];
  onSelect?: (option: FreightOption) => void;
  selectedId?: number | null;
}) {
  const [cep, setCep] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [options, setOptions] = useState<FreightOption[] | null>(null);

  async function handleCalculate() {
    setError(null);
    setOptions(null);
    if (cep.replace(/\D/g, "").length !== 8) {
      setError("Digite um CEP válido (8 dígitos).");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/freight", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ destinationCep: cep, items }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 400 && data.error) {
          setError(data.error);
          return;
        }
        throw new Error();
      }
      setOptions(data.options);
      if (data.options?.length && onSelect) onSelect(data.options[0]);
    } catch {
      setError("Não foi possível calcular o frete agora. Tente novamente em instantes.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="pd-cep">
        <input
          type="text"
          placeholder="Insira seu CEP para calcular o frete"
          value={cep}
          onChange={(e) => setCep(e.target.value)}
          maxLength={9}
        />
        <button onClick={handleCalculate} disabled={loading}>
          {loading ? "Calculando..." : "Calcular"}
        </button>
      </div>
      {error && <div className="freight-error">{error}</div>}
      {options && (
        <ul className="freight-options">
          {options.map((opt) => (
            <li
              key={opt.id}
              className={selectedId === opt.id ? "active" : ""}
              onClick={() => onSelect?.(opt)}
            >
              <span>
                {opt.company} — {opt.name} ({opt.deliveryDays} dias úteis)
              </span>
              <b>{fmtBRL(opt.priceCents)}</b>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
