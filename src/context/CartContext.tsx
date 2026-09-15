"use client";

import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
  type ReactNode,
} from "react";
import {
  type CartItem,
  loadCartFromStorage,
  saveCartToStorage,
} from "@/lib/cart";

type State = { items: CartItem[]; isHydrated: boolean };

type Action =
  | { type: "hydrate"; items: CartItem[] }
  | { type: "add"; item: CartItem }
  | { type: "setQuantity"; productId: string; quantity: number }
  | { type: "remove"; productId: string }
  | { type: "clear" };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "hydrate":
      return { items: action.items, isHydrated: true };
    case "add": {
      const existing = state.items.find((i) => i.productId === action.item.productId);
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.productId === action.item.productId
              ? { ...i, quantity: i.quantity + action.item.quantity }
              : i
          ),
        };
      }
      return { ...state, items: [...state.items, action.item] };
    }
    case "setQuantity":
      if (action.quantity <= 0) {
        return { ...state, items: state.items.filter((i) => i.productId !== action.productId) };
      }
      return {
        ...state,
        items: state.items.map((i) =>
          i.productId === action.productId ? { ...i, quantity: action.quantity } : i
        ),
      };
    case "remove":
      return { ...state, items: state.items.filter((i) => i.productId !== action.productId) };
    case "clear":
      return { ...state, items: [] };
    default:
      return state;
  }
}

type CartContextValue = {
  items: CartItem[];
  isHydrated: boolean;
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  addItem: (item: CartItem) => void;
  setQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { items: [], isHydrated: false });
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { isHydrated } = state;

  useEffect(() => {
    dispatch({ type: "hydrate", items: loadCartFromStorage() });
  }, []);

  useEffect(() => {
    if (isHydrated) saveCartToStorage(state.items);
  }, [state.items, isHydrated]);

  const value: CartContextValue = {
    items: state.items,
    isHydrated,
    isDrawerOpen,
    openDrawer: () => setIsDrawerOpen(true),
    closeDrawer: () => setIsDrawerOpen(false),
    addItem: (item) => {
      dispatch({ type: "add", item });
      setIsDrawerOpen(true);
    },
    setQuantity: (productId, quantity) => dispatch({ type: "setQuantity", productId, quantity }),
    removeItem: (productId) => dispatch({ type: "remove", productId }),
    clearCart: () => dispatch({ type: "clear" }),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
