import { createFileRoute } from "@tanstack/react-router";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Temoignages } from "@/components/temoignages";
import { Reveal } from "@/components/reveal";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/temoignages")({
  head: () => ({
    meta: [
      { title: "Témoignages MAAN | Avis de patients" },
      {
        name: "description",
        content:
          "Découvrez les témoignages de patients MAAN. Parcours simple, consultations discrètes et suivi personnalisé pour les soins masculins.",
      },
      { property: "og:type", content: "article" },
      { property: "og:title", content: "Témoignages MAAN | Avis de patients" },
      {
        property: "og:description",
        content:
          "Les retours d'expérience de patients qui ont utilisé MAAN pour leurs soins masculins.",
      },
      { property: "og:url", content: "/temoignages" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Témoignages MAAN | Avis de patients" },
      {
        name: "twitter:description",
        content:
          "Ce que nos patients disent de leur parcours MAAN.",
      },
    ],
    links: [{ rel: "canonical", href: "/temoignages" }],
  }),
  component: TemoignagesPage,
});

function TemoignagesPage() {
  const { t } = useI18n();

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-background pb-24 pt-32">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal>
            <h1 className="font-display text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
              {t("Témoignages", "Testimonials")}
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-muted">
              {t(
                "Des hommes qui ont pris soin d'eux simplement, discrètement et sans jugement.",
                "Men who took care of themselves simply, discreetly, and without judgment.",
              )}
            </p>
          </Reveal>
        </div>
        <div className="mt-16">
          <Temoignages />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
