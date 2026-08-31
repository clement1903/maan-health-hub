import { Link } from "@tanstack/react-router";
import { useScrollY } from "@/hooks/use-reveal";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";
import { LanguageSwitcher } from "@/components/language-switcher";

export function SiteHeader() {
  const scrollY = useScrollY();
  const { t } = useI18n();
  const condensed = scrollY > 40;

  const nav = [
    { to: "/parcours", label: t("Parcours", "How it works") },
    { to: "/conformite", label: t("Conformité", "Compliance") },
    { to: "/espace-patient", label: t("Espace patient", "Patient area") },
  ];

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
        <Link to="/" className="flex items-baseline gap-3">
          <span className="relative inline-block">
            <span className="relative z-10 font-display text-2xl font-semibold leading-none tracking-tight">
              MAAN
            </span>
            <span className="absolute inset-x-0 bottom-1 z-0 h-2 origin-left rounded-sm bg-amber/35" />
          </span>

          <span
            className={cn(
              "hidden overflow-hidden whitespace-nowrap font-signature text-xl leading-none text-clay transition-all duration-500 ease-[var(--ease)] sm:block",
              condensed ? "max-w-0 opacity-0" : "max-w-[24rem] opacity-100",
            )}
          >
            {t("Des soins pensés pour les hommes", "Care designed for men")}
          </span>
        </Link>
        <nav className="hidden items-center gap-8 font-mono text-[11px] uppercase tracking-[0.15em] text-muted lg:flex">
          <Link
            to="/soins"
            activeProps={{ className: "text-foreground" }}
            className="relative py-1 transition-colors hover:text-foreground after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-clay after:transition-transform after:duration-500 after:ease-[var(--ease)] hover:after:scale-x-100"
          >
            {t("Soins", "Treatments")}
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
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <Link
            to="/espace-patient"
            className="group relative overflow-hidden rounded-full bg-clay px-5 py-2.5 text-sm font-medium text-cream transition-colors hover:bg-clay-deep"
          >
            <span className="relative z-10">{t("Démarrer", "Get started")}</span>
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-cream/25 to-transparent transition-transform duration-700 ease-[var(--ease)] group-hover:translate-x-full" />
          </Link>
        </div>
      </div>
    </header>
  );
}
