import { requireAdmin } from "@/lib/auth";
import { getAllSiteCopy } from "@/lib/queries";
import { upsertCopy } from "../actions";
import { Field, Textarea } from "@/components/ui/FormField";
import { Button } from "@/components/ui/Button";

export const dynamic = "force-dynamic";
export const metadata = { robots: { index: false, follow: false } };

export default async function AdminCopyPage() {
  await requireAdmin();
  const copyEntries = await getAllSiteCopy();

  return (
    <div>
      <h1 className="display text-4xl text-brand-paper mb-2">Site copy</h1>
      <p className="text-brand-muted mb-6">Edit the text shown on the About page and around the site.</p>

      <div className="space-y-8 w-full max-w-2xl">
        {copyEntries.map((c) => (
          <form key={c.key} action={upsertCopy} className="rounded-xl border border-brand-line bg-brand-card p-4 w-full">
            <input type="hidden" name="key" value={c.key} />
            <Textarea label={c.key} name="value" defaultValue={c.value} rows={5} />
            <div className="mt-3 flex justify-end">
              <Button type="submit" variant="secondary" size="sm">Save</Button>
            </div>
          </form>
        ))}

        <form action={upsertCopy} className="rounded-xl border border-dashed border-brand-line p-4 w-full">
          <h3 className="display text-xl text-brand-paper">Add a new copy block</h3>
          <div className="mt-3 space-y-3">
            <Field label="Key" name="key" placeholder="e.g. footer_note" required />
            <Textarea label="Value" name="value" rows={3} />
          </div>
          <div className="mt-3 flex justify-end">
            <Button type="submit" size="sm">Add</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
