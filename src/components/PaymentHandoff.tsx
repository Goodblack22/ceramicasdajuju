"use client";

import { useEffect, useState } from "react";
import { fmtBRL } from "@/lib/pricing";

const STEPS = [
  "Reservando suas peças",
  "Gerando seu pagamento seguro",
  "Levando você à InfinitePay",
];

/**
 * Full-screen transition shown between "Ir para pagamento" and the redirect
 * to InfinitePay's hosted checkout, so the jump off-site doesn't feel abrupt.
 * `ready` flips once the payment link exists; the parent redirects after that.
 */
export default function PaymentHandoff({ totalCents, ready }: { totalCents: number; ready: boolean }) {
  const [warmedUp, setWarmedUp] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setWarmedUp(true), 700);
    return () => clearTimeout(t);
  }, []);

  const step = ready ? 2 : warmedUp ? 1 : 0;

  return (
    <div className="pay-handoff" role="status" aria-live="polite">
      <div className="pay-handoff-card">
        <span className="word">Cerâmica da Juju</span>

        <div className="pay-handoff-ring" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="4.5" y="10.5" width="15" height="10" rx="2" />
            <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" />
          </svg>
        </div>

        <h2>Preparando seu pagamento</h2>
        <p className="pay-handoff-total">Total: <b>{fmtBRL(totalCents)}</b></p>

        <ol className="pay-handoff-steps">
          {STEPS.map((label, i) => (
            <li key={label} className={i < step ? "done" : i === step ? "current" : ""}>
              <span className="dot" aria-hidden="true" />
              {label}
            </li>
          ))}
        </ol>

        <p className="pay-handoff-note">
          Você vai concluir no ambiente seguro da <strong>InfinitePay</strong> (Pix ou cartão)
          e volta pra cá automaticamente depois de pagar.
        </p>
      </div>
    </div>
  );
}
