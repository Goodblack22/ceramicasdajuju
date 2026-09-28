import { CartProvider } from "@/context/CartContext";
import Topbar from "@/components/Topbar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <Topbar />
      <Header />
      {children}
      <Footer />
      <CartDrawer />
    </CartProvider>
  );
}
