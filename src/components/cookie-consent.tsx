import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";

import {
  CONSENT_EVENT,
  readConsent,
  writeConsent,
  type ConsentRecord,
} from "@/lib/cookie-consent";
import { cn } from "@/lib/utils";

const categories = [
  {
    key: "necessaires" as const,
    titre: "Strictement nécessaires",
    desc: "Session de connexion, sécurité, mémorisation de votre choix de cookies. Sans eux le site ne fonctionne pas.",
    lock: true,
  },
  {
    key: "mesure" as const,
    titre: "Mesure d'audience",
    desc: "Statistiques agrégées de fréquentation pour améliorer les parcours. Aucune donnée de santé n'y est associée.",
    lock: false,
  },
  {
    key: "marketing" as const,
    titre: "Marketing",
    desc: "Mesure de l'efficacité de nos campagnes. Désactivé par défaut, jamais lié à votre dossier médical.",
    lock: false,
  },
];

export function CookieConsent() {
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
      aria-label="Gestion des cookies"
      className="fixed inset-x-0 bottom-0 z-[60] px-4 pb-4 sm:px-6 sm:pb-6"
    >
      <div className="mx-auto max-w-3xl overflow-hidden rounded-[20px] border border-border bg-cream shadow-[0_30px_80px_-40px_var(--foreground)]">
        <div className="p-6 sm:p-7">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-clay">Cookies</p>
          <h2 className="mt-2 font-display text-xl font-medium tracking-tight">
            Vous choisissez ce que nous mesurons.
          </h2>
          <p className="mt-2 text-pretty text-sm text-muted">
            Nous utilisons des cookies strictement nécessaires au fonctionnement du site. Les autres
            catégories restent désactivées tant que vous ne les acceptez pas. Aucune donnée de santé
            n'est utilisée à des fins publicitaires.{" "}
            <Link to="/cookies" className="underline decoration-clay/50 underline-offset-4">
              Politique des cookies
            </Link>
            .
          </p>

          <div
            className={cn(
              "grid transition-all duration-500 ease-[var(--ease)]",
              panel ? "mt-5 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
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
                    <li key={c.key} className="flex items-start justify-between gap-5 py-4">
                      <div>
                        <p className="text-sm font-medium">{c.titre}</p>
                        <p className="mt-1 text-pretty text-sm text-muted">{c.desc}</p>
                      </div>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={checked}
                        aria-label={c.titre}
                        disabled={c.lock}
                        onClick={toggle}
                        className={cn(
                          "mt-1 h-6 w-11 shrink-0 rounded-full border transition-colors duration-300",
                          checked ? "border-clay bg-clay" : "border-border bg-background",
                          c.lock && "opacity-60",
                        )}
                      >
                        <span
                          className={cn(
                            "block h-4 w-4 rounded-full bg-cream transition-transform duration-300 ease-[var(--ease)]",
                            checked ? "translate-x-[26px]" : "translate-x-[3px]",
                          )}
                        />
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => save({ mesure: true, marketing: true })}
              className="rounded-full bg-clay px-5 py-3 text-sm font-medium text-cream transition-colors hover:bg-clay-deep"
            >
              Tout accepter
            </button>
            <button
              type="button"
              onClick={() => save({ mesure: false, marketing: false })}
              className="rounded-full border border-border px-5 py-3 text-sm font-medium transition-colors hover:border-clay/40"
            >
              Tout refuser
            </button>
            {panel ? (
              <button
                type="button"
                onClick={() => save({ mesure, marketing })}
                className="rounded-full border border-clay/40 px-5 py-3 text-sm font-medium text-clay transition-colors hover:bg-sand"
              >
                Enregistrer mes choix
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setPanel(true)}
                className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted underline decoration-clay/40 underline-offset-4 transition-colors hover:text-foreground"
              >
                Personnaliser
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
