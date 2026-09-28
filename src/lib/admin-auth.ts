import "server-only";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    redirect("/admin/login");
  }

  const admin = createAdminClient();
  const { data } = await admin
    .from("juju_admins")
    .select("email")
    .eq("email", user.email)
    .maybeSingle();

  if (!data) {
    redirect("/admin/login?erro=sem-acesso");
  }

  return user;
}
