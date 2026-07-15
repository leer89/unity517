type Props = {
  lineup: string;
};

// Time Warp-style lineup block: flat, alphabetical, no headliner hierarchy -
// every artist gets equal type weight, which is the actual signal a lineup
// list like this is supposed to send ("everyone here matters equally").
// Laid out as a dense multi-column index rather than a poster-style stack,
// so it reads like a directory you scan, not a stack of names you scroll.
export default function LineupList({ lineup }: Props) {
  const names = lineup
    .split("\n")
    .map((n) => n.trim())
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }));

  if (names.length === 0) return null;

  return (
    <section className="mt-10 pt-8 border-t border-brand-line">
      <div className="flex items-baseline justify-between gap-4 mb-5">
        <h2 className="display text-2xl sm:text-3xl text-brand-paper">Lineup</h2>
        <span className="text-[11px] uppercase tracking-[0.2em] text-brand-cyan whitespace-nowrap">
          In alphabetical order · {names.length} artists
        </span>
      </div>
      <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-6 gap-y-3">
        {names.map((name) => (
          <li
            key={name}
            className="text-sm sm:text-base text-brand-paper/90 border-b border-brand-line/60 pb-2 truncate"
            title={name}
          >
            {name}
          </li>
        ))}
      </ul>
    </section>
  );
}
