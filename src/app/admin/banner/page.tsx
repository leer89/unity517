import { requireAdmin } from "@/lib/auth";
import { getBanner } from "@/lib/queries";
import { updateBanner } from "../actions";
import { Field, FileField, Label } from "@/components/ui/FormField";
import { Button } from "@/components/ui/Button";

export const dynamic = "force-dynamic";
export const metadata = { robots: { index: false, follow: false } };

export default async function AdminBannerPage() {
  await requireAdmin();
  const banner = await getBanner();

  return (
    <div>
      <h1 className="display text-4xl text-brand-paper mb-2">Banner</h1>
      <p className="text-brand-muted mb-6">The hero at the top of the public homepage.</p>

      <form action={updateBanner} encType="multipart/form-data" className="space-y-5 w-full max-w-2xl">
        <Field label="Headline" name="headline" defaultValue={banner?.headline ?? ""} placeholder="UNITY IN MUSIC FESTIVAL" />
        <Field label="Subheadline" name="subheadline" defaultValue={banner?.subheadline ?? ""} placeholder="Aug 30 · Old Town Lansing · All Ages · Free Entry" />
        <Field label="CTA label" name="cta_label" defaultValue={banner?.cta_label ?? ""} placeholder="See the lineup" />
        <Field label="CTA link" name="cta_url" defaultValue={banner?.cta_url ?? ""} placeholder="#events" />

        <div className="w-full">
          <Label>Banner image</Label>
          {banner?.image_url && (
            <p className="text-xs text-brand-muted mt-1 break-all">Current: {banner.image_url}</p>
          )}
          <FileField label="" name="image_file" />
          <Field
            label=""
            name="image_url"
            defaultValue={banner?.image_url ?? ""}
            placeholder="Or paste an image URL"
            className="mt-2 text-sm"
          />
        </div>

        <Button type="submit">Save banner</Button>
      </form>
    </div>
  );
}
