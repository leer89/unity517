import Link from "next/link";
import { getSiteCopy } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const about = await getSiteCopy("about");
  const contact = await getSiteCopy("contact");

  return (
    <main className="mx-auto max-w-3xl px-4 py-16">
      <Link href="/" className="text-sm text-brand-muted hover:text-brand-paper">← Back</Link>
      <h1 className="display text-5xl sm:text-6xl text-brand-paper mt-6 neon-cyan">About</h1>
      <p className="mt-6 text-brand-paper/85 whitespace-pre-wrap leading-relaxed">
        {about ?? "Underground music + events out of Lansing, MI."}
      </p>

      <h2 className="display text-3xl text-brand-paper mt-12">Contact</h2>
      <p className="mt-3 text-brand-paper/85 whitespace-pre-wrap">
        {contact ?? "Reach out on Instagram @unitynmusic517"}
      </p>
    </main>
  );
}
