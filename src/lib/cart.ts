export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  image: string;
  unitPriceCents: number;
  quantity: number;
  weightKg: number;
  widthCm: number;
  heightCm: number;
  lengthCm: number;
  stockQty: number;
};

export const CART_STORAGE_KEY = "ceramica-da-juju:cart";

export function loadCartFromStorage(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveCartToStorage(items: CartItem[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch {
    // localStorage unavailable (private mode, quota) — cart just won't persist
  }
}

export function cartSubtotalCents(items: CartItem[]): number {
  return items.reduce((sum, i) => sum + i.unitPriceCents * i.quantity, 0);
}

export function cartTotalQuantity(items: CartItem[]): number {
  return items.reduce((sum, i) => sum + i.quantity, 0);
}
