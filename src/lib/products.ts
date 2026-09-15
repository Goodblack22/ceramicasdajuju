import { createClient } from "@/lib/supabase/server";
import type { Product, ProductCategory } from "@/lib/types";

const TABLE = "juju_products";

export async function getAllProducts(): Promise<Product[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("active", true)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data as Product[];
}

export async function getProductsByCategory(category: ProductCategory | "todos"): Promise<Product[]> {
  const products = await getAllProducts();
  if (category === "todos") return products;
  return products.filter((p) => p.category === category);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("slug", slug)
    .eq("active", true)
    .maybeSingle();
  if (error) throw error;
  return data as Product | null;
}

export async function getRelatedProducts(excludeId: string, limit = 3): Promise<Product[]> {
  const products = await getAllProducts();
  return products.filter((p) => p.id !== excludeId).slice(0, limit);
}
