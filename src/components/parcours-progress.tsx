import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";

export type EtapeDetaillee = {
  n: string;
  title: string;
  duree: string;
  desc: string;
  micro: string[];
};

export const etapesDetaillees = (t: (fr: string, en: string) => string): EtapeDetaillee[] => [
  {
    n: "1",
    title: t("Questionnaire", "Questionnaire"),
    duree: t("3 min", "3 min"),
    desc: t(
      "Vos symptômes, antécédents et traitements en cours.",
      "Your symptoms, medical history and current treatments.",
    ),
    micro: [
      t("Espace patient sécurisé", "Secure patient portal"),
      t("Questions ciblées", "Targeted questions"),
      t("Envoi au médecin", "Sent to the doctor"),
    ],
  },
  {
    n: "2",
    title: t("Consultation médicale en ligne", "Online medical consultation"),
    duree: t("sous 24 h", "within 24 h"),
    desc: t(
      "Un médecin évalue votre dossier en ligne et décide.",
      "A doctor reviews your file online and makes a decision.",
    ),
    micro: [
      t("Lecture par un médecin", "Reviewed by a doctor"),
      t("Précisions si besoin", "Follow-up questions if needed"),
      t("Décision notifiée", "Decision notified"),
    ],
  },
  {
    n: "3",
    title: t("Préparation", "Preparation"),
    duree: t("quelques heures", "a few hours"),
    desc: t(
      "La pharmacie partenaire prépare l'ordonnance.",
      "The partner pharmacy prepares the prescription.",
    ),
    micro: [
      t("Contrôle pharmaceutique", "Pharmaceutical check"),
      t("Colis neutre", "Discreet packaging"),
      t("Notice incluse", "Instructions included"),
    ],
  },
  {
    n: "4",
    title: t("Livraison discrète", "Discreet delivery"),
    duree: t("24 à 48 h", "24 to 48 h"),
    desc: t(
      "À domicile ou en point relais, discrètement.",
      "To your home or a pickup point, discreetly.",
    ),
    micro: [
      t("Suivi transporteur", "Carrier tracking"),
      t("Colis sans mention", "Unmarked package"),
      t("Sans signature de contenu", "No content-revealing signature"),
    ],
  },
  {
    n: "5",
    title: t("Suivi", "Follow-up"),
    duree: t("en continu", "ongoing"),
    desc: t(
      "Ajustement, renouvellement ou arrêt avec le médecin.",
      "Adjustment, renewal or discontinuation with the doctor.",
    ),
    micro: [
      t("Point à J+7", "Check-in on day 7"),
      t("Effets indésirables signalés", "Side effects reported"),
      t("Historique conservé", "History kept on record"),
    ],
  },
];


export function ParcoursProgress({
  etapes,
  activeIndex,
  scrollSignal,
}: {
  etapes: EtapeDetaillee[];
  activeIndex?: number;
  scrollSignal?: number;
}) {
  const { t } = useI18n();
  const refs = useRef<Array<HTMLLIElement | null>>([]);
  const [reached, setReached] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const idx = Number((entry.target as HTMLElement).dataset["idx"]);
          setReached((prev) => Math.max(prev, idx + 1));
        }
      },
      { threshold: 0.4 },
    );
    for (const el of refs.current) if (el) observer.observe(el);
    return () => observer.disconnect();
  }, [etapes.length]);

  useEffect(() => {
    if (activeIndex === undefined) return;
    setReached((prev) => Math.max(prev, activeIndex + 1));
  }, [activeIndex]);

  useEffect(() => {
    if (!scrollSignal || activeIndex === undefined) return;
    const el = refs.current[activeIndex];
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [scrollSignal, activeIndex]);

  const pct = Math.round((reached / etapes.length) * 100);


  return (
    <div className="mt-12">
      <div className="sticky top-20 z-10 -mx-6 mb-10 border-y border-border bg-background/85 px-6 py-3 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center gap-4">
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
            {t("Progression du parcours", "Journey progress")}
          </span>
          <div className="h-1 flex-1 overflow-hidden rounded-full bg-border">
            <div
              className="h-full rounded-full bg-clay transition-[width] duration-700 ease-[var(--ease)]"
              style={{ width: `${pct}%` }}
            />
          </div>
          <span className="font-mono text-[11px] tabular-nums text-clay">{pct}%</span>
        </div>
      </div>

      <ol className="relative space-y-4 border-l border-border pl-8">
        {etapes.map((e, i) => {
          const done = reached > i;
          const current = activeIndex === i;
          return (
            <li
              key={e.n}
              data-idx={i}
              aria-current={current ? "step" : undefined}
              ref={(el) => {
                refs.current[i] = el;
              }}
              className={cn(
                "relative rounded-[20px] border bg-background p-7 transition-all duration-700 ease-[var(--ease)]",
                current
                  ? "border-clay opacity-100 shadow-[0_34px_80px_-50px_var(--foreground)] ring-1 ring-clay/35 lg:scale-[1.015]"
                  : "border-border",
                done && !current
                  ? "opacity-100 shadow-[0_28px_70px_-55px_var(--foreground)]"
                  : current
                    ? ""
                    : "opacity-60",
              )}
            >
              <span
                className={cn(
                  "absolute -left-[2.6rem] top-7 grid h-8 w-8 place-items-center rounded-full border font-mono text-xs transition-all duration-700 ease-[var(--ease)]",
                  done || current
                    ? "border-clay bg-clay text-cream"
                    : "border-border bg-background text-muted",
                  current ? "scale-110 shadow-[0_0_0_6px_color-mix(in_oklab,var(--clay)_18%,transparent)]" : "",
                )}
              >
                {e.n}
              </span>
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <h3 className="font-section text-xl font-medium tracking-tight">{e.title}</h3>
                <span
                  className={cn(
                    "rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] transition-colors duration-500",
                    current ? "border-clay bg-clay text-cream" : "border-border text-clay",
                  )}
                >
                  {current ? t("Étape en cours", "Current step") : e.duree}
                </span>
              </div>
              <p className="mt-2 max-w-[60ch] text-pretty text-sm text-muted">{e.desc}</p>
              <ul className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {e.micro.map((m, j) => (
                  <li
                    key={m}
                    className="flex items-start gap-3 rounded-[12px] bg-cream px-4 py-3 text-sm text-foreground/85 transition-all duration-500"
                    style={{ transitionDelay: `${j * 60}ms` }}
                  >
                    <span
                      className={cn(
                        "mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full border text-[9px] transition-colors duration-500",
                        done ? "border-clay bg-clay text-cream" : "border-border text-transparent",
                      )}
                    >
                      ✓
                    </span>
                    <span className="text-pretty">{m}</span>
                  </li>
                ))}
              </ul>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
