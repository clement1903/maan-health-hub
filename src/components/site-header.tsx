import { Link } from "@tanstack/react-router";
import { useScrollY } from "@/hooks/use-reveal";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";
import { getSoins } from "@/data/soins";
import { LanguageSwitcher } from "@/components/language-switcher";

export function SiteHeader() {
  const scrollY = useScrollY();
  const { t, lang } = useI18n();
  const domaines = getSoins(lang);
  const condensed = scrollY > 40;

  const nav = [
    { to: "/parcours", label: t("Comment ça marche ?", "How does it work?") },
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
          "mx-auto flex max-w-6xl items-center justify-between gap-10 px-6 transition-all duration-500 ease-[var(--ease)]",
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
        </Link>
        <nav className="hidden items-center gap-8 whitespace-nowrap font-mono text-[11px] uppercase tracking-[0.15em] text-muted lg:flex">
          <Link
            to="/"
            activeProps={{ className: "text-foreground" }}
            className="relative py-1 transition-colors hover:text-foreground after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-clay after:transition-transform after:duration-500 after:ease-[var(--ease)] hover:after:scale-x-100"
          >
            {t("Accueil", "Home")}
          </Link>
          <div className="group relative">
            <button
              type="button"
              aria-haspopup="true"
              className="relative inline-flex cursor-default items-center gap-1.5 py-1 uppercase tracking-[0.15em] transition-colors group-hover:text-foreground after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-clay after:transition-transform after:duration-500 after:ease-[var(--ease)] group-hover:after:scale-x-100"
            >
              {t("Soins", "Treatments")}
              <span
                aria-hidden
                className="text-[8px] text-clay transition-transform duration-500 ease-[var(--ease)] group-hover:rotate-180"
              >
                ▼
              </span>
            </button>
            <div className="invisible absolute left-1/2 top-full z-50 w-72 -translate-x-1/2 translate-y-2 pt-0 opacity-0 transition-all duration-300 ease-[var(--ease)] group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
              <div className="overflow-hidden rounded-[18px] border border-border bg-background p-2 shadow-[0_30px_70px_-45px_var(--foreground)]">
                {domaines.map((d) => (
                  <Link
                    key={d.slug}
                    to="/soins/$domaine"
                    params={{ domaine: d.slug }}
                    search={{ produit: undefined }}
                    className="group/item flex items-center justify-between gap-3 rounded-[12px] px-4 py-3 transition-colors duration-300 hover:bg-cream"
                  >
                    <span className="min-w-0 text-[11px] uppercase tracking-[0.14em] text-foreground">
                      {d.titre}
                    </span>
                    <span
                      aria-hidden
                      className="shrink-0 text-clay opacity-0 transition-all duration-300 group-hover/item:translate-x-0.5 group-hover/item:opacity-100"
                    >
                      →
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
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
          <Link
            to="/espace-patient"
            className="whitespace-nowrap rounded-full border border-foreground/60 px-6 py-2.5 text-sm font-medium transition-colors hover:bg-foreground hover:text-background"
          >
            {t("Se connecter", "Login")}
          </Link>
          <Link
            to="/questionnaire"
            className="group relative overflow-hidden whitespace-nowrap rounded-full bg-espresso px-6 py-2.5 text-sm font-medium text-espresso-foreground transition-colors hover:bg-clay hover:text-cream"
          >
            <span className="relative z-10">{t("Commencer mon évaluation", "Start intake")}</span>
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-cream/20 to-transparent transition-transform duration-700 ease-[var(--ease)] group-hover:translate-x-full" />
          </Link>
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
}
