export type ProductCategory = "pratos" | "cozinha" | "decoracao";

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: ProductCategory;
  description: string;
  specs: string;
  tag: string | null;
  price_cents: number;
  images: string[];
  stock_qty: number;
  weight_kg: number;
  width_cm: number;
  height_cm: number;
  length_cm: number;
  insurance_value_cents: number;
  active: boolean;
};

export type FreightOption = {
  id: number;
  name: string;
  company: string;
  priceCents: number;
  deliveryDays: number;
};

export type OrderStatus = "pending" | "paid" | "canceled" | "expired";
export type FulfillmentStatus = "not_shipped" | "shipped" | "delivered";

export type OrderStatusResponse = {
  status: OrderStatus;
  totalCents: number;
  itemsSubtotalCents: number;
  shippingCostCents: number;
  shippingMethod: string | null;
  captureMethod: "credit_card" | "pix" | null;
  paidAt: string | null;
  items: { productName: string; quantity: number; unitPriceCents: number }[];
};
