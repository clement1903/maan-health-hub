import { Link } from "@tanstack/react-router";

import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { usePatient } from "@/lib/patient/store";
import { scenarioKeys, scenarioLabels } from "@/lib/patient/demo";
import { tr } from "@/lib/patient/types";

type Item = { to: string; label: string; short: string; icon: string; badge?: number };

function useItems(): Item[] {
  const { t } = useI18n();
  const { unreadMessages, pendingActions } = usePatient();
  return [
    { to: "/mon-espace", label: t("Accueil", "Home"), short: t("Accueil", "Home"), icon: "◉", badge: pendingActions },
    { to: "/mon-espace/soins", label: t("Mes soins", "My care"), short: t("Soins", "Care"), icon: "✚" },
    {
      to: "/mon-espace/messages",
      label: t("Messages", "Messages"),
      short: t("Messages", "Messages"),
      icon: "✉",
      badge: unreadMessages,
    },
    { to: "/mon-espace/suivi", label: t("Suivi", "Follow-up"), short: t("Suivi", "Follow-up"), icon: "◔" },
    { to: "/mon-espace/profil", label: t("Profil", "Profile"), short: t("Profil", "Profile"), icon: "☺" },
  ];
}

function Badge({ n }: { n: number }) {
  if (!n) return null;
  return (
    <span className="ml-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-clay px-1 font-mono text-[9px] leading-none text-cream">
      {n}
    </span>
  );
}

export function PatientTopNav() {
  const items = useItems();
  const { t } = useI18n();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-6 px-5 py-3.5">
        <Link to="/" className="relative inline-block shrink-0">
          <span className="relative z-10 font-display text-xl font-semibold leading-none tracking-tight">
            MAAN
          </span>
          <span className="absolute inset-x-0 bottom-0.5 z-0 h-1.5 rounded-sm bg-amber/35" />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {items.map((i) => (
            <Link
              key={i.to}
              to={i.to}
              activeOptions={{ exact: i.to === "/mon-espace" }}
              activeProps={{ className: "bg-sand text-foreground" }}
              className="inline-flex items-center rounded-full px-4 py-2 text-sm text-muted transition-colors duration-300 hover:text-foreground"
            >
              {i.label}
              <Badge n={i.badge ?? 0} />
            </Link>
          ))}
        </nav>

        <Link
          to="/"
          className="hidden shrink-0 font-mono text-[10px] uppercase tracking-[0.16em] text-muted transition-colors hover:text-clay md:inline"
        >
          {t("Quitter", "Exit")}
        </Link>
      </div>
    </header>
  );
}

export function PatientBottomNav() {
  const items = useItems();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/92 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl md:hidden">
      <ul className="mx-auto flex max-w-lg items-stretch">
        {items.map((i) => (
          <li key={i.to} className="flex-1">
            <Link
              to={i.to}
              activeOptions={{ exact: i.to === "/mon-espace" }}
              activeProps={{ className: "text-clay" }}
              className="relative flex min-h-[58px] flex-col items-center justify-center gap-1 text-muted transition-colors duration-300 active:scale-[0.97]"
            >
              <span className="text-base leading-none">{i.icon}</span>
              <span className="text-[10px] leading-none">{i.short}</span>
              {i.badge ? (
                <span className="absolute right-[22%] top-2 grid h-4 min-w-4 place-items-center rounded-full bg-clay px-1 font-mono text-[9px] leading-none text-cream">
                  {i.badge}
                </span>
              ) : null}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/** Sélecteur de scénario — outil de développement uniquement. */
export function ScenarioSwitcher() {
  const { scenario, setScenario } = usePatient();
  const { lang, t } = useI18n();
  if (!import.meta.env.DEV) return null;

  return (
    <div className="mx-auto mb-6 max-w-5xl px-5">
      <div className="flex flex-wrap items-center gap-2 rounded-[18px] border border-dashed border-border bg-background/70 p-3">
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
          {t("Démo · scénario", "Demo · scenario")}
        </span>
        {scenarioKeys.map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => setScenario(k)}
            title={tr(scenarioLabels[k], lang)}
            className={cn(
              "rounded-full px-3 py-1.5 font-mono text-[11px] transition-colors",
              scenario === k ? "bg-clay text-cream" : "border border-border text-muted hover:text-foreground",
            )}
          >
            {k}
          </button>
        ))}
        <span className="ml-auto text-[11px] text-muted">{tr(scenarioLabels[scenario], lang)}</span>
      </div>
    </div>
  );
}
