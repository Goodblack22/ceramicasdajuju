import Link from "next/link";
import Image from "next/image";
import { getAllProducts } from "@/lib/products";
import FeaturedShowcase from "@/components/FeaturedShowcase";

const FEATURED_SLUGS = [
  "prato-broto-rosa",
  "petisqueira-mandala-azul",
  "porta-papel-toalha-flores",
  "bandeja-cacto-sol",
];

const INSTA_IMAGES = [
  "/images/laranja1.jpg",
  "/images/azul1.jpg",
  "/images/folha1.jpg",
  "/images/ovos1.jpg",
];

export default async function HomePage() {
  const products = await getAllProducts();
  const featuredIds = products.filter((p) => FEATURED_SLUGS.includes(p.slug)).map((p) => p.id);

  return (
    <main id="home" className="page-enter">
      <section className="hero-banner">
        <div className="hero-illus">
          <div className="hero-collage">
            <div className="h-photo h-photo-1">
              <Image src="/images/azul1.jpg" alt="" fill style={{ objectFit: "cover" }} sizes="30vw" />
            </div>
            <div className="h-photo h-photo-2">
              <Image src="/images/cacto1.jpg" alt="" fill style={{ objectFit: "cover" }} sizes="20vw" />
            </div>
            <div className="h-photo h-photo-3">
              <Image src="/images/laranja1.jpg" alt="" fill style={{ objectFit: "cover" }} sizes="15vw" />
            </div>
          </div>
        </div>
        <span className="hero-tag">Coleção Raiz</span>
        <div className="hero-content">
          <h1>
            Da argila às
            <br />
            suas mãos
          </h1>
          <p>
            Peças artesanais em cerâmica, modeladas e pintadas à mão, uma a uma, pela Juju. Pratos,
            potinhos e objetos de decoração exclusivos para sua casa.
          </p>
          <div className="hero-actions">
            <Link className="btn btn-primary" href="/loja">Ver coleção</Link>
            <Link className="btn btn-outline" href="/#sobre">Conhecer a marca</Link>
          </div>
        </div>
      </section>

      <section className="section" id="destaques">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Vitrine</span>
            <h2>Destaques</h2>
          </div>
          <FeaturedShowcase allProducts={products} featuredIds={featuredIds} />

          <div className="collection-banner">
            <div className="txt">
              <span className="eyebrow">Sob encomenda</span>
              <h3>Peças personalizadas</h3>
              <p>
                Cores, tamanhos e desenhos exclusivos feitos especialmente para você — fale com a
                Juju e monte sua peça.
              </p>
              <a
                className="btn btn-primary"
                style={{ background: "var(--white)", color: "var(--brown-dark)" }}
                href="https://wa.me/5511999990000"
                target="_blank"
                rel="noopener noreferrer"
              >
                Fale no WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-alt" id="sobre">
        <div className="container about">
          <div className="about-visual">
            <div className="about-photo-main">
              <Image src="/images/rosa2.jpg" alt="" fill style={{ objectFit: "cover" }} sizes="40vw" />
            </div>
            <div className="about-photo-accent">
              <Image src="/images/folha1.jpg" alt="" fill style={{ objectFit: "cover" }} sizes="20vw" />
            </div>
          </div>
          <div className="about-text">
            <span className="eyebrow">A marca</span>
            <h2>Sobre a Cerâmica da Juju</h2>
            <p>
              Tudo começou em uma pequena bancada de torno, entre argila, água e paciência. A Juju
              transforma barro em peças únicas — cada vaso, pote e objeto carrega marcas feitas à
              mão, sem pressa, sem molde igual ao outro.
            </p>
            <p>
              Hoje, o ateliê produz peças utilitárias e decorativas inspiradas na natureza e na
              simplicidade do dia a dia, sempre com acabamento artesanal e pintura exclusiva.
            </p>
            <Link className="btn btn-outline" style={{ marginTop: 6 }} href="/loja">
              Conheça mais
            </Link>
            <span className="signature">Juju</span>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">O processo</span>
            <h2>Do barro ao acabamento</h2>
          </div>
          <div className="process-grid">
            <div className="process-col">
              <div className="process-step">
                <div className="icn">
                  <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.6">
                    <path d="M12 2a5 5 0 0 1 5 5v4a5 5 0 0 1-10 0V7a5 5 0 0 1 5-5z" />
                    <path d="M8 21h8M12 17v4" />
                  </svg>
                </div>
                <h4>Modelagem à mão</h4>
                <p>Cada peça começa no torno, moldada manualmente pela Juju a partir da argila fresca.</p>
              </div>
              <div className="process-step">
                <div className="icn">
                  <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.6">
                    <circle cx="12" cy="12" r="5" />
                    <path d="M12 1v3M12 20v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M1 12h3M20 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" />
                  </svg>
                </div>
                <h4>Secagem natural</h4>
                <p>As peças descansam por dias, secando lentamente antes de irem ao forno.</p>
              </div>
            </div>
            <div className="process-visual">
              <svg viewBox="0 0 120 140" fill="none">
                <defs>
                  <linearGradient id="procVaseG" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#C89B79" />
                    <stop offset=".55" stopColor="#A9724C" />
                    <stop offset="1" stopColor="#7a4f30" />
                  </linearGradient>
                </defs>
                <ellipse cx="60" cy="124" rx="34" ry="6" fill="#4A2E1B" opacity=".15" />
                <path
                  d="M35 48c0-9 11-15 25-15s25 6 25 15v52c0 11-11 20-25 20s-25-9-25-20V48z"
                  fill="url(#procVaseG)"
                />
                <ellipse cx="60" cy="34" rx="24" ry="6" fill="#5c3d22" />
                <path
                  d="M45 55c4 9 5 18 2 30M60 51c2 12 2 26-1 38M75 55c-4 9-4 18 0 30"
                  stroke="#7C8B5E"
                  strokeWidth="1.8"
                  fill="none"
                  strokeLinecap="round"
                />
                <path
                  d="M44 62l4 4M76 62l-4 4M60 60l0 6"
                  stroke="#A9B78E"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
                <path
                  d="M42 56c2-4 4-4 6 0"
                  stroke="#fff"
                  strokeWidth="2"
                  opacity=".25"
                  fill="none"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div className="process-col">
              <div className="process-step">
                <div className="icn">
                  <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.6">
                    <path d="M12 19l7-7 3 3-7 7-3-3z" />
                    <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
                  </svg>
                </div>
                <h4>Pintura exclusiva</h4>
                <p>Detalhes e folhagens pintados à mão, um a um, com esmaltes atóxicos.</p>
              </div>
              <div className="process-step">
                <div className="icn">
                  <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.6">
                    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a6 6 0 0 1-12 0c0-1.34.5-2.5 1.5-3.5" />
                  </svg>
                </div>
                <h4>1ª e 2ª queima</h4>
                <p>Queima em alta temperatura garante resistência e o acabamento final.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Depoimentos</span>
            <h2>Quem já tem uma peça em casa</h2>
          </div>
          <div className="grid-products" style={{ gridTemplateColumns: "repeat(3,1fr)" }}>
            {[
              {
                text: "A peça chegou ainda mais bonita do que nas fotos. Dá pra sentir o cuidado artesanal em cada detalhe.",
                name: "Marina Alves",
                city: "São Paulo, SP",
              },
              {
                text: "Comprei a petisqueira azul pra minha sala e virou o assunto de todas as visitas. Simplesmente linda.",
                name: "Rafael Souza",
                city: "Belo Horizonte, MG",
              },
              {
                text: "Já é a terceira peça que compro. A embalagem, o cuidado no envio, tudo impecável.",
                name: "Camila Ferreira",
                city: "Curitiba, PR",
              },
            ].map((t) => (
              <div className="p-card" key={t.name} style={{ cursor: "default", textAlign: "left", padding: 26 }}>
                <div style={{ color: "var(--olive)", letterSpacing: 3, marginBottom: 12 }}>★★★★★</div>
                <p style={{ fontSize: 13.5, color: "#5c4a3a", marginBottom: 16, fontStyle: "italic" }}>
                  &quot;{t.text}&quot;
                </p>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{t.name}</div>
                <div style={{ fontSize: 11, color: "#948572" }}>{t.city}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="contato">
        <div className="container">
          <div className="atelier">
            <div className="atelier-visual">
              <svg className="illus" viewBox="0 0 300 320" preserveAspectRatio="xMidYMid slice">
                <defs>
                  <linearGradient id="atelierBg" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#C89B79" />
                    <stop offset="1" stopColor="#A9724C" />
                  </linearGradient>
                  <linearGradient id="rawG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#E4C9A8" />
                    <stop offset="1" stopColor="#C0966B" />
                  </linearGradient>
                </defs>
                <rect width="300" height="320" fill="url(#atelierBg)" />
                <rect x="0" y="248" width="300" height="10" fill="#4A2E1B" opacity=".4" />
                <ellipse className="shadow-el" cx="150" cy="250" rx="90" ry="10" opacity=".25" />
                <ellipse cx="150" cy="228" rx="78" ry="20" fill="url(#rawG)" />
                <ellipse cx="150" cy="222" rx="78" ry="20" fill="none" stroke="#8a6a45" strokeWidth="2" />
                <ellipse cx="150" cy="188" rx="62" ry="17" fill="url(#rawG)" />
                <ellipse cx="150" cy="182" rx="62" ry="17" fill="none" stroke="#8a6a45" strokeWidth="2" />
                <ellipse cx="150" cy="150" rx="46" ry="14" fill="url(#rawG)" />
                <ellipse cx="150" cy="145" rx="46" ry="14" fill="none" stroke="#8a6a45" strokeWidth="2" />
                <g stroke="#3a2415" strokeWidth="3" strokeLinecap="round" opacity=".8">
                  <line x1="235" y1="235" x2="270" y2="150" />
                  <line x1="235" y1="235" x2="205" y2="155" />
                  <path d="M205 155c8-4 22-4 30 0" fill="none" />
                </g>
                <circle cx="235" cy="235" r="6" fill="#3a2415" opacity=".8" />
              </svg>
            </div>
            <div className="atelier-text">
              <span className="eyebrow">Ateliê &amp; encomendas</span>
              <h3>Fale direto com a Juju</h3>
              <p>Peças a pronta-entrega e encomendas personalizadas, feitas no ateliê com todo cuidado artesanal.</p>
              <p className="addr">Atendimento por WhatsApp e Instagram · Seg a Sex, 9h–18h</p>
              <a
                className="btn btn-primary"
                style={{ alignSelf: "flex-start" }}
                href="https://wa.me/5511999990000"
                target="_blank"
                rel="noopener noreferrer"
              >
                Fale no WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      <div className="photo-strip">
        {INSTA_IMAGES.map((src) => (
          <div key={src}>
            <Image src={src} alt="" width={300} height={300} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        ))}
      </div>
    </main>
  );
}
