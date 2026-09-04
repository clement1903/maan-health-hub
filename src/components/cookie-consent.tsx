import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";

import {
  CONSENT_EVENT,
  readConsent,
  writeConsent,
  type ConsentRecord,
} from "@/lib/cookie-consent";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";

function buildCategories(t: (fr: string, en: string) => string) {
  return [
    {
      key: "necessaires" as const,
      titre: t("Strictement nécessaires", "Strictly necessary"),
      desc: t(
        "Session de connexion, sécurité, mémorisation de votre choix de cookies. Sans eux le site ne fonctionne pas.",
        "Login session, security, and remembering your cookie choice. Without them the site does not function.",
      ),
      lock: true,
    },
    {
      key: "mesure" as const,
      titre: t("Mesure d'audience", "Audience measurement"),
      desc: t(
        "Statistiques agrégées de fréquentation pour améliorer les parcours. Aucune donnée de santé n'y est associée.",
        "Aggregated traffic statistics to improve user journeys. No health data is ever associated with them.",
      ),
      lock: false,
    },
    {
      key: "marketing" as const,
      titre: t("Marketing", "Marketing"),
      desc: t(
        "Mesure de l'efficacité de nos campagnes. Désactivé par défaut, jamais lié à votre dossier médical.",
        "Measures the effectiveness of our campaigns. Disabled by default, never linked to your medical record.",
      ),
      lock: false,
    },
  ];
}

export function CookieConsent() {
  const { t } = useI18n();
  const categories = buildCategories(t);
  const [visible, setVisible] = useState(false);
  const [panel, setPanel] = useState(false);
  const [mesure, setMesure] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    const existing: ConsentRecord | null = readConsent();
    if (!existing) setVisible(true);
    else {
      setMesure(existing.mesure);
      setMarketing(existing.marketing);
    }
    const open = () => {
      const current = readConsent();
      setMesure(current?.mesure ?? false);
      setMarketing(current?.marketing ?? false);
      setPanel(true);
      setVisible(true);
    };
    window.addEventListener(`${CONSENT_EVENT}:open`, open);
    return () => window.removeEventListener(`${CONSENT_EVENT}:open`, open);
  }, []);

  if (!visible) return null;

  const save = (choice: { mesure: boolean; marketing: boolean }) => {
    writeConsent(choice);
    setVisible(false);
    setPanel(false);
  };

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-label={t("Gestion des cookies", "Cookie management")}
      className="fixed inset-x-0 bottom-0 z-[60] px-4 pb-4 sm:px-6 sm:pb-5"
    >
      <div className="mx-auto max-w-2xl overflow-hidden rounded-2xl border border-border bg-cream/95 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.25)] backdrop-blur-md">
        <div className="p-4 sm:p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-clay">{t("Cookies", "Cookies")}</p>
              <p className="mt-1 text-pretty text-sm text-muted">
                {t(
                  "Cookies strictement nécessaires activés. Aucune donnée de santé n'est utilisée à des fins publicitaires.",
                  "Strictly necessary cookies enabled. No health data is ever used for advertising.",
                )}{" "}
                <Link to="/cookies" className="underline decoration-clay/50 underline-offset-4 hover:text-foreground">
                  {t("En savoir plus", "Learn more")}
                </Link>
              </p>
            </div>

            <div className="flex shrink-0 flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => save({ mesure: false, marketing: false })}
                className="rounded-full border border-border px-4 py-2 text-xs font-medium transition-colors hover:border-clay/40 hover:text-foreground"
              >
                {t("Refuser", "Reject")}
              </button>
              <button
                type="button"
                onClick={() => save({ mesure: true, marketing: true })}
                className="rounded-full bg-clay px-4 py-2 text-xs font-medium text-cream transition-colors hover:bg-clay-deep"
              >
                {t("Accepter", "Accept")}
              </button>
              <button
                type="button"
                onClick={() => setPanel(true)}
                className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted underline decoration-clay/40 underline-offset-4 transition-colors hover:text-foreground"
              >
                {t("Personnaliser", "Customize")}
              </button>
            </div>
          </div>

          <div
            className={cn(
              "grid transition-all duration-500 ease-[var(--ease)]",
              panel ? "mt-4 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
            )}
          >
            <div className="overflow-hidden">
              <ul className="divide-y divide-border border-y border-border">
                {categories.map((c) => {
                  const checked =
                    c.key === "necessaires" ? true : c.key === "mesure" ? mesure : marketing;
                  const toggle = () => {
                    if (c.key === "mesure") setMesure((v) => !v);
                    if (c.key === "marketing") setMarketing((v) => !v);
                  };
                  return (
                    <li key={c.key} className="flex items-start justify-between gap-5 py-3">
                      <div>
                        <p className="text-sm font-medium">{c.titre}</p>
                        <p className="mt-1 text-pretty text-xs text-muted">{c.desc}</p>
                      </div>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={checked}
                        aria-label={c.titre}
                        disabled={c.lock}
                        onClick={toggle}
                        className={cn(
                          "mt-0.5 h-5 w-9 shrink-0 rounded-full border transition-colors duration-300",
                          checked ? "border-clay bg-clay" : "border-border bg-background",
                          c.lock && "opacity-60",
                        )}
                      >
                        <span
                          className={cn(
                            "block h-3 w-3 rounded-full bg-cream transition-transform duration-300 ease-[var(--ease)]",
                            checked ? "translate-x-[19px]" : "translate-x-[3px]",
                          )}
                        />
                      </button>
                    </li>
                  );
                })}
              </ul>
              <div className="mt-3 flex justify-end">
                <button
                  type="button"
                  onClick={() => save({ mesure, marketing })}
                  className="rounded-full bg-clay px-5 py-2 text-xs font-medium text-cream transition-colors hover:bg-clay-deep"
                >
                  {t("Enregistrer mes choix", "Save my choices")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
