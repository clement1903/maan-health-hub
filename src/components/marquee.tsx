export function Marquee({ items }: { items: string[] }) {
  const row = [...items, ...items];
  return (
    <div className="group relative overflow-hidden border-y border-border bg-cream py-4">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-cream to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-cream to-transparent" />
      <div className="flex w-max animate-[marquee_60s_linear_infinite] gap-12 group-hover:[animation-play-state:paused]">
        {row.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="flex shrink-0 items-center gap-12 font-mono text-[11px] uppercase tracking-[0.18em] text-muted"
          >
            {item}
            <span className="h-1 w-1 rounded-full bg-clay/60" />
          </span>
        ))}
      </div>
    </div>
  );
}
