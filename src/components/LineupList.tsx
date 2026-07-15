import LineupPills, { parseLineup } from "@/components/LineupPills";

type Props = {
  lineup: string;
};

// Flat, alphabetical, equal type-weight - the Time Warp convention (nobody's
// name is bigger than anyone else's). Rendered as a wrapping cloud of pill
// buttons, closer to how festival directories like Music Festival Wizard
// present a full lineup: dense, scannable, and actually pressable.
// This wraps LineupPills with the section header; the homepage banner uses
// LineupPills directly for a header-less preview.
export default function LineupList({ lineup }: Props) {
  const count = parseLineup(lineup).length;
  if (count === 0) return null;

  return (
    <section className="mt-10 pt-8 border-t border-brand-line">
      <div className="flex items-baseline justify-between gap-4 mb-5">
        <h2 className="display text-2xl sm:text-3xl text-brand-paper">Lineup</h2>
        <span className="text-[11px] uppercase tracking-[0.2em] text-brand-cyan whitespace-nowrap">
          A–Z · {count} artists · tap to hear
        </span>
      </div>
      <LineupPills lineup={lineup} />
    </section>
  );
}
