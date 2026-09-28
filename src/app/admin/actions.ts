"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/admin-auth";
import type { OrderStatus, FulfillmentStatus, ProductCategory } from "@/lib/types";

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  await requireAdmin();
  const admin = createAdminClient();
  await admin.from("juju_orders").update({ status }).eq("id", orderId);
  revalidatePath(`/admin/pedidos/${orderId}`);
  revalidatePath("/admin/pedidos");
}

export async function updateFulfillmentStatus(orderId: string, fulfillment_status: FulfillmentStatus) {
  await requireAdmin();
  const admin = createAdminClient();
  await admin.from("juju_orders").update({ fulfillment_status }).eq("id", orderId);
  revalidatePath(`/admin/pedidos/${orderId}`);
  revalidatePath("/admin/pedidos");
}

export type ProductFormInput = {
  id?: string;
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

export async function upsertProduct(input: ProductFormInput) {
  await requireAdmin();
  const admin = createAdminClient();

  const row = {
    slug: input.slug,
    name: input.name,
    category: input.category,
    description: input.description,
    specs: input.specs,
    tag: input.tag || null,
    price_cents: input.price_cents,
    images: input.images,
    stock_qty: input.stock_qty,
    weight_kg: input.weight_kg,
    width_cm: input.width_cm,
    height_cm: input.height_cm,
    length_cm: input.length_cm,
    insurance_value_cents: input.insurance_value_cents,
    active: input.active,
  };

  if (input.id) {
    const { error } = await admin.from("juju_products").update(row).eq("id", input.id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await admin.from("juju_products").insert(row);
    if (error) throw new Error(error.message);
  }

  revalidatePath("/admin/produtos");
  revalidatePath("/loja");
  revalidatePath("/");
}

export async function toggleProductActive(productId: string, active: boolean) {
  await requireAdmin();
  const admin = createAdminClient();
  await admin.from("juju_products").update({ active }).eq("id", productId);
  revalidatePath("/admin/produtos");
  revalidatePath("/loja");
  revalidatePath("/");
}

export async function uploadProductImage(formData: FormData) {
  await requireAdmin();
  const file = formData.get("file") as File | null;
  if (!file) throw new Error("Nenhum arquivo enviado");

  const admin = createAdminClient();
  const ext = file.name.split(".").pop() || "jpg";
  const path = `${crypto.randomUUID()}.${ext}`;

  const { error } = await admin.storage.from("juju-products").upload(path, file, {
    contentType: file.type,
    upsert: false,
  });
  if (error) throw new Error(error.message);

  const { data } = admin.storage.from("juju-products").getPublicUrl(path);
  return data.publicUrl;
}
