"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { cartTotalQuantity } from "@/lib/cart";

const NAV_LINKS = [
  { href: "/", label: "Início" },
  { href: "/loja?cat=pratos", label: "Pratos" },
  { href: "/loja?cat=cozinha", label: "Cozinha" },
  { href: "/loja?cat=decoracao", label: "Decoração" },
  { href: "/#sobre", label: "Sobre" },
  { href: "/#contato", label: "Contato" },
];

export default function Header() {
  const pathname = usePathname();
  const { items, openDrawer } = useCart();
  const count = cartTotalQuantity(items);

  return (
    <header>
      <div className="header-row1">
        <div className="hamburger">
          <div className="bars">
            <span></span>
            <span></span>
            <span></span>
          </div>
          MENU
        </div>
        <Link href="/" className="logo-mark" style={{ cursor: "pointer" }}>
          <span className="word">Cerâmica da Juju</span>
        </Link>
        <div className="search-bar">
          <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8">
            <circle cx="11" cy="11" r="7" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input type="text" placeholder="Olá, o que você procura?" />
        </div>
        <div className="header-icons">
          <div className="icn">
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.6">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <button
            className="icn"
            onClick={openDrawer}
            style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
            aria-label="Abrir carrinho"
          >
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.6">
              <path d="M6 2l1 4h10l1-4" />
              <path d="M4 6h16l-1.5 12.5A2 2 0 0 1 16.5 20h-9a2 2 0 0 1-2-1.5L4 6z" />
            </svg>
            <span className="cart-count">{count}</span>
          </button>
        </div>
      </div>
      <div className="header-row2">
        <nav className="mainnav">
          {NAV_LINKS.map((link) => {
            const base = link.href.split("?")[0].split("#")[0];
            const isActive = base === "/" ? pathname === "/" : pathname.startsWith(base);
            return (
              <Link
                key={link.label}
                href={link.href}
                className={`nav-link${isActive ? " active" : ""}`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
