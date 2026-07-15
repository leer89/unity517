"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import type { SupabaseClient } from "@supabase/supabase-js";

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function str(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim();
}

function optStr(formData: FormData, key: string): string | null {
  const v = str(formData, key);
  return v.length ? v : null;
}

// Turns "unity-fest_aug30.jpg" into "Unity Fest Aug30" - used as a fallback
// title when the admin uploads just a flyer without typing one in.
function titleFromFilename(filename: string): string {
  const base = filename.replace(/\.[^./]+$/, "");
  return base
    .replace(/[-_]+/g, " ")
    .trim()
    .split(/\s+/)
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ");
}

// Uploads an image file to the `media` storage bucket (if one was chosen) and
// returns its public URL. Falls back to a plain pasted URL, then to whatever
// URL already existed (so re-saving a form without touching the image is a
// no-op), then null.
async function resolveImageUrl(
  supabase: SupabaseClient,
  formData: FormData,
  fileField: string,
  urlField: string,
  existingUrl: string | null,
  folder: string,
): Promise<string | null> {
  const file = formData.get(fileField);
  if (file instanceof File && file.size > 0) {
    const ext = file.name.includes(".") ? file.name.split(".").pop() : "jpg";
    const path = `${folder}/${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage.from("media").upload(path, file, {
      contentType: file.type || undefined,
      upsert: false,
    });
    if (error) throw new Error(`Image upload failed: ${error.message}`);
    const { data } = supabase.storage.from("media").getPublicUrl(path);
    return data.publicUrl;
  }

  const pastedUrl = optStr(formData, urlField);
  if (pastedUrl) return pastedUrl;

  return existingUrl;
}

// Only one event can be featured at a time (see DESIGN.md - singleton "Featured" slot).
async function clearOtherFeatured(supabase: SupabaseClient, keepId?: string) {
  let query = supabase.from("events").update({ is_featured: false }).eq("is_featured", true);
  if (keepId) query = query.neq("id", keepId);
  await query;
}

function revalidatePublicPages() {
  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/admin/events");
}

// ─────────────────────────────────────────────────────────────────────────────
// Events
// ─────────────────────────────────────────────────────────────────────────────

export async function createEvent(formData: FormData) {
  const { supabase } = await requireAdmin();

  // A flyer-only quick-add is allowed: if the admin didn't type a title,
  // fall back to one derived from the uploaded file's name so the event can
  // still be created (editable later). Date is never guessed - see below.
  const flyerFile = formData.get("flyer_file");
  const hasFlyerFile = flyerFile instanceof File && flyerFile.size > 0;

  let title = str(formData, "title");
  if (!title && hasFlyerFile) title = titleFromFilename((flyerFile as File).name);
  if (!title) throw new Error("Title is required (or upload a flyer to derive one from its filename)");

  const slug = slugify(str(formData, "slug") || title);
  const starts_at = str(formData, "starts_at");
  if (!starts_at) throw new Error("Start date/time is required");
  const ends_at = optStr(formData, "ends_at");
  const is_featured = formData.get("is_featured") === "on";

  const flyer_url = await resolveImageUrl(supabase, formData, "flyer_file", "flyer_url", null, "flyers");

  const { data, error } = await supabase
    .from("events")
    .insert({
      title,
      slug,
      starts_at: new Date(starts_at).toISOString(),
      ends_at: ends_at ? new Date(ends_at).toISOString() : null,
      location: optStr(formData, "location"),
      description: optStr(formData, "description"),
      flyer_url,
      ticket_url: optStr(formData, "ticket_url"),
      is_featured,
      is_archived: false,
    })
    .select("id")
    .single();

  if (error) throw new Error(`Could not create event: ${error.message}`);
  if (is_featured) await clearOtherFeatured(supabase, data.id);

  revalidatePublicPages();
  redirect("/admin/events");
}

export async function updateEvent(id: string, formData: FormData) {
  const { supabase } = await requireAdmin();

  const { data: existing } = await supabase.from("events").select("flyer_url").eq("id", id).maybeSingle();

  const title = str(formData, "title");
  if (!title) throw new Error("Title is required");

  const slug = slugify(str(formData, "slug") || title);
  const starts_at = str(formData, "starts_at");
  if (!starts_at) throw new Error("Start date/time is required");
  const ends_at = optStr(formData, "ends_at");
  const is_featured = formData.get("is_featured") === "on";
  const is_archived = formData.get("is_archived") === "on";

  const flyer_url = await resolveImageUrl(
    supabase,
    formData,
    "flyer_file",
    "flyer_url",
    (existing?.flyer_url as string | null) ?? null,
    "flyers",
  );

  const { error } = await supabase
    .from("events")
    .update({
      title,
      slug,
      starts_at: new Date(starts_at).toISOString(),
      ends_at: ends_at ? new Date(ends_at).toISOString() : null,
      location: optStr(formData, "location"),
      description: optStr(formData, "description"),
      flyer_url,
      ticket_url: optStr(formData, "ticket_url"),
      is_featured,
      is_archived,
    })
    .eq("id", id);

  if (error) throw new Error(`Could not update event: ${error.message}`);
  if (is_featured) await clearOtherFeatured(supabase, id);

  revalidatePath(`/events/${slug}`);
  revalidatePublicPages();
  redirect("/admin/events");
}

export async function deleteEvent(id: string) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("events").delete().eq("id", id);
  if (error) throw new Error(`Could not delete event: ${error.message}`);
  revalidatePublicPages();
}

// ─────────────────────────────────────────────────────────────────────────────
// Banner (singleton row, id = 1)
// ─────────────────────────────────────────────────────────────────────────────

export async function updateBanner(formData: FormData) {
  const { supabase } = await requireAdmin();

  const { data: existing } = await supabase.from("banner").select("image_url").eq("id", 1).maybeSingle();

  const image_url = await resolveImageUrl(
    supabase,
    formData,
    "image_file",
    "image_url",
    (existing?.image_url as string | null) ?? null,
    "banner",
  );

  const { error } = await supabase
    .from("banner")
    .upsert({
      id: 1,
      image_url,
      headline: optStr(formData, "headline"),
      subheadline: optStr(formData, "subheadline"),
      cta_label: optStr(formData, "cta_label"),
      cta_url: optStr(formData, "cta_url"),
    })
    .eq("id", 1);

  if (error) throw new Error(`Could not update banner: ${error.message}`);

  revalidatePublicPages();
  redirect("/admin/banner");
}

// ─────────────────────────────────────────────────────────────────────────────
// Site copy (key/value blocks)
// ─────────────────────────────────────────────────────────────────────────────

export async function upsertCopy(formData: FormData) {
  const { supabase } = await requireAdmin();

  const key = slugify(str(formData, "key")).replace(/-/g, "_");
  if (!key) throw new Error("Key is required");
  const value = str(formData, "value");

  const { error } = await supabase.from("site_copy").upsert({ key, value });
  if (error) throw new Error(`Could not save copy: ${error.message}`);

  revalidatePublicPages();
  redirect("/admin/copy");
}
