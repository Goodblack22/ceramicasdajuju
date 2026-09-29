import Link from "next/link";

export default function Footer() {
  return (
    <footer>
      <div className="container">
        <div className="foot-grid">
          <div className="foot-about">
            <span className="word" style={{ fontSize: 28 }}>
              Cerâmica da Juju
            </span>
            <p>Peças artesanais de cerâmica feitas com amor, uma a uma, em nosso ateliê.</p>
            <div className="pay-icons">
              <span>PIX</span>
              <span>VISA</span>
              <span>MASTER</span>
              <span>ELO</span>
              <span>BOLETO</span>
            </div>
            <div className="socials">
              <a href="#">
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="1" />
                </svg>
              </a>
              <a href="#">
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="2">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
              <a href="#">
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="2">
                  <path d="M22 12a10 10 0 1 0-11.5 9.9v-7H8v-3h2.5V9.5A3.5 3.5 0 0 1 14 6h2v3h-2a1 1 0 0 0-1 1v2h3l-.5 3H13v7A10 10 0 0 0 22 12z" />
                </svg>
              </a>
            </div>
          </div>
          <div>
            <h4>Loja</h4>
            <ul>
              <li><Link href="/loja">Todos os produtos</Link></li>
              <li><Link href="/loja?cat=pratos">Pratos</Link></li>
              <li><Link href="/loja?cat=cozinha">Cozinha</Link></li>
              <li><Link href="/loja?cat=decoracao">Decoração</Link></li>
            </ul>
          </div>
          <div>
            <h4>Informações</h4>
            <ul>
              <li><Link href="/#sobre">Sobre a marca</Link></li>
              <li><a href="#">Trocas e devoluções</a></li>
              <li><a href="#">Prazo de entrega</a></li>
              <li><a href="#">Perguntas frequentes</a></li>
              <li><a href="#">Política de privacidade</a></li>
            </ul>
          </div>
          <div>
            <h4>Contato</h4>
            <ul>
              <li><a href="https://wa.me/5511989302197" target="_blank" rel="noopener noreferrer">WhatsApp: (11) 98930-2197</a></li>
              <li>contato@ceramicadajuju.com.br</li>
              <li>@ceramicadajuju</li>
              <li>Seg a Sex, 9h–18h</li>
            </ul>
          </div>
        </div>
        <div className="foot-bottom">
          <span>Cerâmica da Juju · Arte em Cerâmica &amp; Decoração</span>
          <span>&copy; {new Date().getFullYear()} — todos os direitos reservados</span>
        </div>
      </div>
    </footer>
  );
}
