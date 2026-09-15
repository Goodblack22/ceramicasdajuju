"use client";

import { useState } from "react";

export default function ProductTabs({ description }: { description: string }) {
  const [tab, setTab] = useState<"desc" | "carac">("desc");

  return (
    <div className="pd-tabs">
      <div className="pd-tabs-nav">
        <button
          className={`pd-tab-btn${tab === "desc" ? " active" : ""}`}
          onClick={() => setTab("desc")}
        >
          Descrição do produto
        </button>
        <button
          className={`pd-tab-btn${tab === "carac" ? " active" : ""}`}
          onClick={() => setTab("carac")}
        >
          Características
        </button>
      </div>
      <div className={`pd-tab-content${tab === "desc" ? " active" : ""}`}>
        <p>{description}</p>
        <p>
          Peça artesanal — pequenas variações de cor, formato e textura fazem parte do processo e
          tornam cada peça única.
        </p>
      </div>
      <div className={`pd-tab-content${tab === "carac" ? " active" : ""}`}>
        <p><b>Material:</b> Cerâmica esmaltada, pintura manual atóxica.</p>
        <p><b>Cuidados:</b> Lavar à mão. Evitar contato direto com fogo e uso em forno.</p>
        <p>
          Todas as peças são produzidas artesanalmente — pequenas variações de cor, formato e
          textura fazem parte do processo e tornam cada peça única.
        </p>
      </div>
    </div>
  );
}
