import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getOptionalAdmin } from "@/lib/auth";
import { Field } from "@/components/ui/FormField";
import { Button } from "@/components/ui/Button";

export const dynamic = "force-dynamic";
export const metadata = { robots: { index: false, follow: false }, title: "Sign in" };

async function signIn(formData: FormData) {
  "use server";
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const supabase = createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    redirect(`/admin/login?error=${encodeURIComponent(error.message)}`);
  }
  redirect("/admin");
}

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  const existing = await getOptionalAdmin();
  if (existing) redirect("/admin");

  const errorMsg = searchParams?.error
    ? searchParams.error === "unauthorized"
      ? "That account isn't an admin."
      : searchParams.error
    : null;

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <form
        action={signIn}
        className="w-full max-w-sm rounded-2xl border border-brand-line bg-brand-card p-6"
      >
        <h1 className="display text-3xl text-brand-paper">Admin sign in</h1>
        <p className="text-brand-muted text-sm mt-1">Authorized admins only.</p>

        {errorMsg && (
          <div className="mt-4 text-sm text-brand-neon bg-brand-neon/10 border border-brand-neon/40 rounded p-2">
            {errorMsg}
          </div>
        )}

        <div className="mt-6 space-y-4">
          <Field label="Email" name="email" type="email" required autoComplete="email" />
          <Field label="Password" name="password" type="password" required autoComplete="current-password" />
        </div>

        <div className="mt-6">
          <Button type="submit" className="w-full">Enter</Button>
        </div>
      </form>
    </div>
  );
}
