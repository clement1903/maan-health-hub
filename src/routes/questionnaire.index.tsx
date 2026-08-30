import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Clock, ShieldCheck } from "lucide-react";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { questionnaireDefinitions } from "@/lib/questionnaire/definitions";

export const Route = createFileRoute("/questionnaire/")({
  head: () => ({
    meta: [
      { title: "Démarrer votre questionnaire — MAAN" },
      {
        name: "description",
        content:
          "Commencez immédiatement, sans créer de compte : indiquez ce que vous souhaitez traiter et répondez à quelques questions pour votre évaluation médicale.",
      },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "Démarrer votre questionnaire — MAAN" },
      {
        property: "og:description",
        content:
          "Une question à la fois, sans compte à créer. Un médecin indépendant évalue ensuite votre dossier.",
      },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "Démarrer votre questionnaire — MAAN" },
      {
        name: "twitter:description",
        content: "Indiquez ce que vous souhaitez traiter et commencez en 3 minutes.",
      },
    ],
  }),
  component: QuestionnaireStart,
});

function QuestionnaireStart() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans text-foreground antialiased">
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto w-full max-w-3xl px-6 py-16 lg:py-24">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-clay">
            Question 1 sur votre parcours
          </p>
          <h1 className="mt-5 text-balance font-display text-4xl font-medium leading-[1.08] lg:text-5xl">
            Que souhaitez-vous traiter&nbsp;?
          </h1>
          <p className="mt-5 max-w-[52ch] text-pretty text-lg text-muted">
            Choisissez votre spécialité : les questions suivantes s'adaptent à votre situation. Aucun
            compte, aucune adresse e-mail à ce stade.
          </p>

          <div className="mt-8 flex flex-wrap gap-3 font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2">
              <Clock className="size-3.5" /> environ 3 minutes
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2">
              <ShieldCheck className="size-3.5" /> gratuit et sans engagement
            </span>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {questionnaireDefinitions.map((d) => (
              <button
                key={d.id}
                type="button"
                onClick={() => void navigate({ to: "/questionnaire/$slug", params: { slug: d.slug } })}
                className="group flex h-full flex-col items-start rounded-[20px] border border-border bg-card p-6 text-left transition-all duration-500 ease-[var(--ease)] hover:-translate-y-1 hover:border-clay hover:shadow-[0_28px_70px_-50px_var(--foreground)]"
              >
                <span className="font-section text-xl font-medium tracking-tight">{d.title}</span>
                <span className="mt-2 flex-1 text-pretty text-sm text-muted">{d.intro}</span>
                <span className="mt-5 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-clay transition-all group-hover:gap-3">
                  Commencer <ArrowRight className="size-3.5" />
                </span>
              </button>
            ))}
          </div>

          <p className="mt-8 text-sm text-muted">
            Vos réponses sont enregistrées automatiquement. Vous ne créerez un compte qu'au moment
            d'envoyer votre dossier au médecin.
          </p>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
