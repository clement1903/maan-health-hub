import { Link } from "@tanstack/react-router";
import { useScrollY } from "@/hooks/use-reveal";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/parcours", label: "Parcours" },
  { to: "/conformite", label: "Conformité" },
  { to: "/espace-patient", label: "Espace patient" },
];

export function SiteHeader() {
  const scrollY = useScrollY();
  const condensed = scrollY > 40;

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b bg-background/80 backdrop-blur-xl transition-all duration-500 ease-[var(--ease)]",
        condensed
          ? "border-border shadow-[0_10px_40px_-32px_var(--foreground)]"
          : "border-transparent",
      )}
    >
      <div
        className={cn(
          "mx-auto flex max-w-6xl items-center justify-between px-6 transition-all duration-500 ease-[var(--ease)]",
          condensed ? "py-3" : "py-5",
        )}
      >
        <Link to="/" className="flex items-center gap-3">
          <span className="font-display text-2xl font-semibold leading-none tracking-tight">
            MAAN
          </span>
          <span
            className={cn(
              "hidden -rotate-2 overflow-hidden whitespace-nowrap font-signature text-xl leading-none text-clay transition-all duration-500 ease-[var(--ease)] sm:block",
              condensed ? "max-w-0 opacity-0" : "max-w-[24rem] opacity-100",
            )}
          >
            Des soins pensés pour les hommes
          </span>
        </Link>
        <nav className="hidden items-center gap-8 font-mono text-[11px] uppercase tracking-[0.15em] text-muted lg:flex">
          <Link
            to="/soins"
            activeProps={{ className: "text-foreground" }}
            className="relative py-1 transition-colors hover:text-foreground after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-clay after:transition-transform after:duration-500 after:ease-[var(--ease)] hover:after:scale-x-100"
          >
            Soins
          </Link>
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeProps={{ className: "text-foreground" }}
              className="relative py-1 transition-colors hover:text-foreground after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-clay after:transition-transform after:duration-500 after:ease-[var(--ease)] hover:after:scale-x-100"
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <Link
          to="/espace-patient"
          className="group relative overflow-hidden rounded-full bg-clay px-5 py-2.5 text-sm font-medium text-cream transition-colors hover:bg-clay-deep"
        >
          <span className="relative z-10">Démarrer</span>
          <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-cream/25 to-transparent transition-transform duration-700 ease-[var(--ease)] group-hover:translate-x-full" />
        </Link>
      </div>
    </header>
  );
}
