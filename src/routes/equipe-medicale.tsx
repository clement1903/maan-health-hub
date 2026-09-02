import { createFileRoute } from "@tanstack/react-router";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { MedecinsSection } from "@/components/medecins-section";
import { Reveal } from "@/components/reveal";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/equipe-medicale")({
  head: () => ({
    meta: [
      { title: "L'équipe médicale MAAN | Médecins agréés" },
      {
        name: "description",
        content:
          "Découvrez les médecins agréés qui consultent sur MAAN. Généralistes et spécialistes formés à la téléconsultation, inscrits à l'Ordre.",
      },
      { property: "og:type", content: "article" },
      { property: "og:title", content: "L'équipe médicale MAAN | Médecins agréés" },
      {
        property: "og:description",
        content:
          "Médecins généralistes et spécialistes, inscrits à l'Ordre, formés à la téléconsultation pour les soins masculins.",
      },
      { property: "og:url", content: "/equipe-medicale" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "L'équipe médicale MAAN | Médecins agréés" },
      {
        name: "twitter:description",
        content:
          "Les professionnels de santé qui vous accompagnent sur MAAN.",
      },
    ],
    links: [{ rel: "canonical", href: "/equipe-medicale" }],
  }),
  component: EquipeMedicalePage,
});

function EquipeMedicalePage() {
  const { t } = useI18n();

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-background pb-24 pt-32">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal>
            <h1 className="font-display text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
              {t("L'équipe médicale", "The medical team")}
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-muted">
              {t(
                "Des médecins agréés, spécialisés dans les soins masculins et formés à la téléconsultation. Votre dossier est toujours pris en charge par un professionnel de santé identifiable.",
                "Licensed doctors specialising in men's health and trained in teleconsultation. Your file is always handled by an identifiable health professional.",
              )}
            </p>
          </Reveal>
        </div>
        <div className="mt-16">
          <MedecinsSection />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
