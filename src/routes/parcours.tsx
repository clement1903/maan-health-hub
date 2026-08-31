import { createFileRoute, Link } from "@tanstack/react-router";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Reveal } from "@/components/reveal";
import { ParcoursQuestionnairePreview } from "@/components/parcours-questionnaire-preview";
import { useI18n } from "@/lib/i18n";

import consultationImg from "@/assets/etape-consultation.jpg";
import pharmacieImg from "@/assets/parcours-pharmacie.jpg";
import livraisonImg from "@/assets/etape-livraison.jpg";
import suiviImg from "@/assets/parcours-suivi.jpg";
import heroPoster from "@/assets/hero-poster.jpg";
import explicationVideo from "@/assets/parcours-explication.mp4.asset.json";

export const Route = createFileRoute("/parcours")({
  head: () => ({
    meta: [
      { title: "Parcours d'accès aux traitements — MAAN" },
      {
        name: "description",
        content:
          "Questionnaire médical, validation de la prescription par un médecin agréé, préparation en pharmacie et livraison discrète à domicile : le parcours MAAN étape par étape.",
      },
      { property: "og:type", content: "article" },
      { property: "og:title", content: "Parcours d'accès aux traitements — MAAN" },
      {
        property: "og:description",
        content:
          "Trois étapes claires : questionnaire, validation de prescription, livraison à domicile.",
      },
      { property: "og:url", content: "/parcours" },
      { name: "twitter:title", content: "Parcours d'accès aux traitements — MAAN" },
      {
        name: "twitter:description",
        content:
          "Questionnaire, validation de prescription et livraison : le parcours MAAN étape par étape.",
      },
    ],
    links: [{ rel: "canonical", href: "/parcours" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "HowTo",
          name: "Accéder à un traitement avec MAAN",
          step: [
            { "@type": "HowToStep", name: "Questionnaire médical", text: "Vous répondez à un questionnaire médical détaillé sur votre situation, vos antécédents et vos traitements en cours." },
            { "@type": "HowToStep", name: "Validation de la prescription", text: "Un médecin agréé évalue votre dossier et délivre une ordonnance si un traitement est justifié." },
            { "@type": "HowToStep", name: "Préparation et livraison", text: "La pharmacie partenaire prépare votre traitement et l'expédie dans un colis neutre." },
          ],
        }),
      },
    ],
  }),
  component: ParcoursPage,
});

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="block font-mono text-[10px] uppercase tracking-[0.28em] text-muted">
      {children}
    </span>
  );
}

function Marker({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-center gap-3 text-sm font-medium text-foreground">
      <span className="h-1.5 w-1.5 rounded-full bg-clay" />
      {children}
    </li>
  );
}

function ParcoursPage() {
  const { t } = useI18n();

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans text-foreground antialiased">
      <SiteHeader />

      <main className="flex-1">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center px-6 py-20 lg:py-28">
          {/* Hero */}
          <header className="w-full max-w-5xl text-center">
            <Reveal>
              <span className="inline-block rounded-full border border-border px-3 py-1">
                <Eyebrow>{t("Le parcours MAAN", "The MAAN journey")}</Eyebrow>
              </span>
              <h1 className="mt-8 text-balance font-display text-6xl font-light italic leading-[0.95] tracking-tight md:text-8xl">
                {t("La santé", "Health,")}
                <br />
                <span className="text-clay">{t("redéfinie.", "redefined.")}</span>
              </h1>
            </Reveal>

            <Reveal delay={120} className="mt-12">
              <p className="mx-auto max-w-2xl text-pretty text-lg leading-relaxed text-muted">
                {t(
                  "Questionnaire médical en ligne, consultation avec un médecin certifié, préparation en pharmacie agréée et suivi personnalisé.",
                  "Online medical questionnaire, consultation with a certified doctor, preparation at a licensed pharmacy and personalized follow-up.",
                )}
              </p>
            </Reveal>
          </header>

          {/* Steps */}
          <div className="mt-32 w-full space-y-40 lg:space-y-48">
            {/* 01 */}
            <section className="grid grid-cols-1 items-center gap-14 md:grid-cols-2 md:gap-24">
              <Reveal className="order-2 md:order-1">
                <Eyebrow>{t("01 — Bilan", "01 — Assessment")}</Eyebrow>
                <h2 className="mt-6 text-balance font-section text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
                  {t("Tout commence par une écoute.", "It starts with listening.")}
                </h2>
                <p className="mt-6 max-w-[42ch] text-pretty text-lg leading-relaxed text-muted">
                  {t(
                    "Quelques minutes pour permettre au médecin de comprendre votre situation.",
                    "A few minutes so the doctor can understand your situation.",
                  )}
                </p>
                <ul className="mt-8 space-y-4">
                  <Marker>
                    <span className="flex flex-col">
                      <span>{t("3–5 minutes", "3–5 minutes")}</span>
                      <span className="text-sm font-normal text-muted">
                        {t("Questionnaire adapté à vos réponses", "A questionnaire that adapts to your answers")}
                      </span>
                    </span>
                  </Marker>
                  <Marker>
                    <span className="flex flex-col">
                      <span>{t("Confidentiel", "Confidential")}</span>
                      <span className="text-sm font-normal text-muted">
                        {t("Vos informations restent protégées", "Your information stays protected")}
                      </span>
                    </span>
                  </Marker>
                  <Marker>
                    <span className="flex flex-col">
                      <span>{t("Pensé pour le médecin", "Built for the doctor")}</span>
                      <span className="text-sm font-normal text-muted">
                        {t(
                          "Votre dossier est structuré avant son analyse",
                          "Your file is structured before their review",
                        )}
                      </span>
                    </span>
                  </Marker>
                </ul>
              </Reveal>
              <Reveal delay={100} className="order-1 md:order-2">
                <ParcoursQuestionnairePreview />
              </Reveal>

            </section>

            {/* 02 */}
            <section className="grid grid-cols-1 items-center gap-14 md:grid-cols-2 md:gap-24">
              <Reveal>
                <div className="group aspect-[4/5] overflow-hidden rounded-[2.5rem]">
                  <img
                    src={consultationImg}
                    alt={t(
                      "Médecin agréé examinant un dossier patient en ligne",
                      "Licensed doctor reviewing a patient file online",
                    )}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-[1200ms] ease-[var(--ease)] group-hover:scale-[1.04]"
                  />
                </div>
              </Reveal>
              <Reveal delay={100}>
                <Eyebrow>{t("02 — Expertise", "02 — Expertise")}</Eyebrow>
                <h2 className="mt-6 text-balance font-section text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
                  {t("La décision d'un médecin.", "A doctor's decision.")}
                </h2>
                <p className="mt-6 max-w-[42ch] text-pretty text-lg leading-relaxed text-muted">
                  {t(
                    "Consultation médicale en ligne, gratuite et sans engagement.",
                    "Online medical consultation, free and with no commitment.",
                  )}
                </p>
                <ul className="mt-8 space-y-3">
                  <Marker>{t("Médecins certifiés BIG", "BIG-certified doctors")}</Marker>
                  <Marker>{t("Réponse sous 24 h", "Response within 24 h")}</Marker>
                </ul>
              </Reveal>
            </section>

            {/* 03 + 04 */}
            <section className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <Reveal>
                <div className="flex h-full flex-col justify-between rounded-[2.5rem] bg-sand p-10 lg:p-12">
                  <div>
                    <Eyebrow>{t("03 — Préparation", "03 — Preparation")}</Eyebrow>
                    <h3 className="mt-6 font-section text-3xl font-semibold tracking-tight">
                      {t("Pharmacie agréée.", "Licensed pharmacy.")}
                    </h3>
                    <p className="mt-4 text-pretty text-base text-muted">
                      {t(
                        "Contrôle pharmaceutique, notice incluse.",
                        "Pharmaceutical check, instructions included.",
                      )}
                    </p>
                  </div>
                  <div className="mt-10 h-48 overflow-hidden rounded-2xl">
                    <img
                      src={pharmacieImg}
                      alt={t(
                        "Préparation d'un traitement en pharmacie partenaire",
                        "Treatment prepared at a partner pharmacy",
                      )}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
              </Reveal>
              <Reveal delay={100}>
                <div className="flex h-full flex-col justify-between rounded-[2.5rem] bg-cream p-10 lg:p-12">
                  <div>
                    <Eyebrow>{t("04 — Expédition", "04 — Shipping")}</Eyebrow>
                    <h3 className="mt-6 font-section text-3xl font-semibold tracking-tight">
                      {t("Colis neutre.", "Unmarked parcel.")}
                    </h3>
                    <p className="mt-4 text-pretty text-base text-muted">
                      {t(
                        "Livré sous 24 à 48 h, sans aucune mention extérieure.",
                        "Delivered within 24 to 48 h, with nothing written outside.",
                      )}
                    </p>
                  </div>
                  <div className="mt-10 h-48 overflow-hidden rounded-2xl">
                    <img
                      src={livraisonImg}
                      alt={t(
                        "Colis neutre livré à domicile",
                        "Unmarked parcel delivered at home",
                      )}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
              </Reveal>
            </section>

            {/* 05 */}
            <section className="flex flex-col items-center text-center">
              <Reveal>
                <Eyebrow>{t("05 — Accompagnement", "05 — Follow-up")}</Eyebrow>
                <h2 className="mx-auto mt-6 max-w-3xl text-balance font-section text-4xl font-semibold tracking-tight md:text-6xl">
                  {t("Un suivi qui dure.", "Care that keeps going.")}
                </h2>
              </Reveal>
              <Reveal delay={100} className="mt-12 w-full max-w-3xl">
                <div className="aspect-video w-full overflow-hidden rounded-[2.5rem]">
                  <img
                    src={suiviImg}
                    alt={t(
                      "Homme suivant son traitement au quotidien",
                      "Man following his treatment day to day",
                    )}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                </div>
                <p className="mx-auto mt-10 max-w-[46ch] text-pretty text-xl text-muted">
                  {t(
                    "Ajustement, renouvellement ou arrêt : votre médecin reste joignable depuis votre espace patient.",
                    "Adjust, renew or stop: your doctor stays reachable from your patient portal.",
                  )}
                </p>
              </Reveal>
            </section>

            {/* CTA */}
            <section className="flex flex-col items-center pb-8">
              <span className="mb-16 h-32 w-px bg-border" />
              <Reveal>
                <h2 className="text-balance text-center font-display text-5xl font-light italic tracking-tight md:text-7xl">
                  {t("Votre parcours", "Your journey")}
                  <br />
                  <span className="text-clay">{t("commence ici.", "starts here.")}</span>
                </h2>
              </Reveal>
              <Reveal delay={100} className="mt-12 flex flex-col items-center gap-8">
                <Link
                  to="/espace-patient"
                  className="group inline-flex items-center gap-2 rounded-full bg-clay px-12 py-6 text-lg font-medium text-cream transition-all duration-500 ease-[var(--ease)] hover:gap-4 hover:bg-clay-deep"
                >
                  {t("Ouvrir mon espace patient", "Open my patient portal")}
                  <span className="transition-transform duration-500 group-hover:translate-x-1">→</span>
                </Link>
                <span className="font-signature text-3xl text-muted">
                  {t("Bienvenue chez MAAN.", "Welcome to MAAN.")}
                </span>
                <Eyebrow>{t("Discrétion garantie", "Discretion guaranteed")}</Eyebrow>
              </Reveal>
            </section>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
