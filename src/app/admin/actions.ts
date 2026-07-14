"use server";

// MVP stub: admin server actions are intentionally no-ops while we focus on
// the visual public site. Restore the full implementation from git history
// once auth is wired back up.

import { revalidatePath } from "next/cache";

function notImplemented(): never {
  throw new Error("Admin actions are disabled in the visual MVP.");
}

export async function createEvent(_formData: FormData) {
  notImplemented();
}
export async function updateEvent(_id: string, _formData: FormData) {
  notImplemented();
}
export async function deleteEvent(_id: string) {
  notImplemented();
}
export async function updateBanner(_formData: FormData) {
  notImplemented();
}
export async function upsertCopy(_formData: FormData) {
  notImplemented();
  void revalidatePath;
}
