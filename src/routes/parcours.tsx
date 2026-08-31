import { createFileRoute, Link } from "@tanstack/react-router";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Reveal } from "@/components/reveal";
import { Marquee } from "@/components/marquee";
import { ParcoursQuestionnairePreview } from "@/components/parcours-questionnaire-preview";
import { useI18n } from "@/lib/i18n";
import { useScrollY } from "@/hooks/use-reveal";

import consultationImg from "@/assets/etape-consultation.jpg";
import pharmacieImg from "@/assets/parcours-pharmacie.jpg";
import livraisonImg from "@/assets/etape-livraison.jpg";
import suiviImg from "@/assets/parcours-suivi.jpg";
import patientImg from "@/assets/parcours-patient.jpg";

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

function Eyebrow({ children, light }: { children: React.ReactNode; light?: boolean }) {
  return (
    <span
      className={`block font-mono text-[10px] uppercase tracking-[0.28em] ${
        light ? "text-cream/60" : "text-muted"
      }`}
    >
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

/** Grand numéro d'étape fantôme, en filigrane derrière le contenu. */
function GhostNumber({ children, light }: { children: string; light?: boolean }) {
  return (
    <span
      aria-hidden
      className={`pointer-events-none absolute -top-16 left-0 select-none font-display text-[10rem] font-light italic leading-none md:-top-24 md:text-[16rem] ${
        light ? "text-cream/[0.07]" : "text-clay/[0.08]"
      }`}
    >
      {children}
    </span>
  );
}

function ParcoursPage() {
  const { t } = useI18n();
  const scrollY = useScrollY();

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans text-foreground antialiased">
      <SiteHeader />

      <main className="flex-1">
        {/* Hero — plein écran, photo en parallaxe */}
        <header className="relative flex min-h-[92vh] items-center overflow-hidden">
          <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-14 px-6 py-24 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
            <Reveal className="relative z-10">
              <span className="inline-block rounded-full border border-border px-3 py-1">
                <Eyebrow>{t("Le parcours MAAN", "The MAAN journey")}</Eyebrow>
              </span>
              <h1 className="mt-10 text-balance font-display text-7xl font-light italic leading-[0.92] tracking-tight md:text-9xl">
                {t("La santé,", "Health,")}
                <br />
                <span className="text-clay">{t("redéfinie.", "redefined.")}</span>
              </h1>
              <p className="mt-12 max-w-[42ch] text-pretty border-l-2 border-clay/40 pl-6 font-display text-2xl font-light italic leading-snug text-foreground/80 md:text-[1.7rem]">
                {t(
                  "« Je repoussais ce rendez-vous depuis deux ans. Ici, tout s'est fait sans avoir à le dire à voix haute. »",
                  "\"I had been putting off this appointment for two years. Here, everything happened without having to say it out loud.\"",
                )}
              </p>
              <p className="mt-6 pl-6 font-mono text-[10px] uppercase tracking-[0.24em] text-muted">
                Thomas · {t("38 ans · patient MAAN depuis 2025", "38 · MAAN patient since 2025")}
              </p>
            </Reveal>
            <Reveal delay={140} className="relative">
              <figure>
                <div className="group relative aspect-[4/5] overflow-hidden rounded-[2.5rem]">
                  <img
                    src={patientImg}
                    alt={t(
                      "Thomas, patient MAAN, chez lui au matin",
                      "Thomas, MAAN patient, at home in the morning",
                    )}
                    width={1024}
                    height={1280}
                    fetchPriority="high"
                    style={{ transform: `translateY(${scrollY * 0.08}px) scale(1.12)` }}
                    className="h-full w-full object-cover will-change-transform"
                  />
                  <div className="pointer-events-none absolute inset-0 rounded-[2.5rem] ring-1 ring-inset ring-foreground/5" />
                </div>
                <figcaption className="mt-4 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.24em] text-muted">
                  <span>{t("Amsterdam, 7 h 42", "Amsterdam, 7:42 am")}</span>
                  <span>{t("Histoire vraie", "A true story")}</span>
                </figcaption>
              </figure>
            </Reveal>
          </div>
          {/* Indicateur de scroll */}
          <div className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 md:flex">
            <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-muted">
              {t("Défiler", "Scroll")}
            </span>
            <span className="relative h-14 w-px overflow-hidden bg-border">
              <span
                className="absolute left-0 top-0 h-6 w-px bg-clay"
                style={{ animation: "rise 1.8s var(--ease) infinite alternate" }}
              />
            </span>
          </div>
        </header>

        {/* Marquee */}
        <Marquee
          items={[
            t("Questionnaire en ligne", "Online questionnaire"),
            t("Médecins certifiés BIG", "BIG-certified doctors"),
            t("Pharmacie agréée", "Licensed pharmacy"),
            t("Livraison 24–48 h", "24–48 h delivery"),
            t("Suivi médical continu", "Ongoing medical follow-up"),
          ]}
        />

        {/* 01 — Bilan */}
        <section className="relative overflow-hidden py-32 lg:py-44">
          <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-16 px-6 md:grid-cols-2 md:gap-24">
            <Reveal className="relative order-2 md:order-1">
              <GhostNumber>01</GhostNumber>
              <div className="relative">
                <Eyebrow>{t("01 — Bilan", "01 — Assessment")}</Eyebrow>
                <h2 className="mt-6 text-balance font-section text-4xl font-semibold leading-tight tracking-tight md:text-6xl">
                  {t("Tout commence par une écoute.", "It starts with listening.")}
                </h2>
                <p className="mt-6 max-w-[42ch] text-pretty text-lg leading-relaxed text-muted">
                  {t(
                    "Quelques minutes pour permettre au médecin de comprendre votre situation.",
                    "A few minutes so the doctor can understand your situation.",
                  )}
                </p>
                <ul className="mt-10 space-y-5">
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
              </div>
            </Reveal>
            <Reveal delay={120} className="order-1 md:order-2">
              <div className="transition-transform duration-700 ease-[var(--ease)] hover:-translate-y-2 hover:rotate-[0.5deg]">
                <ParcoursQuestionnairePreview />
              </div>
            </Reveal>
          </div>
        </section>

        {/* 02 — Expertise : section sombre immersive */}
        <section className="relative overflow-hidden bg-foreground py-32 text-cream lg:py-44">
          <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-16 px-6 md:grid-cols-2 md:gap-24">
            <Reveal>
              <div className="group relative aspect-[4/5] overflow-hidden rounded-[2.5rem]">
                <img
                  src={consultationImg}
                  alt={t(
                    "Médecin agréé examinant un dossier patient en ligne",
                    "Licensed doctor reviewing a patient file online",
                  )}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-[1600ms] ease-[var(--ease)] group-hover:scale-[1.06]"
                />
                <div className="absolute inset-x-6 bottom-6 flex items-center justify-between rounded-2xl bg-foreground/60 px-5 py-4 backdrop-blur-md">
                  <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-cream/80">
                    {t("Consultation en ligne", "Online consultation")}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-clay">
                    {t("Gratuite · Sans engagement", "Free · No commitment")}
                  </span>
                </div>
              </div>
            </Reveal>
            <Reveal delay={120} className="relative">
              <GhostNumber light>02</GhostNumber>
              <div className="relative">
                <Eyebrow light>{t("02 — Expertise", "02 — Expertise")}</Eyebrow>
                <h2 className="mt-6 text-balance font-section text-4xl font-semibold leading-tight tracking-tight md:text-6xl">
                  {t("La décision d'un médecin.", "A doctor's decision.")}
                </h2>
                <p className="mt-6 max-w-[42ch] text-pretty text-lg leading-relaxed text-cream/70">
                  {t(
                    "Consultation médicale en ligne, gratuite et sans engagement.",
                    "Online medical consultation, free and with no commitment.",
                  )}
                </p>
                <ul className="mt-10 space-y-4">
                  <li className="flex items-center gap-3 text-sm font-medium">
                    <span className="h-1.5 w-1.5 rounded-full bg-clay" />
                    {t("Médecins certifiés BIG", "BIG-certified doctors")}
                  </li>
                  <li className="flex items-center gap-3 text-sm font-medium">
                    <span className="h-1.5 w-1.5 rounded-full bg-clay" />
                    {t("Réponse sous 24 h", "Response within 24 h")}
                  </li>
                </ul>
              </div>
            </Reveal>
          </div>
        </section>

        {/* 03 + 04 — cartes qui s'ouvrent au survol */}
        <section className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-8 px-6 py-32 lg:py-44 md:grid-cols-2">
          <Reveal>
            <div className="group flex h-full flex-col justify-between overflow-hidden rounded-[2.5rem] bg-sand p-10 transition-all duration-700 ease-[var(--ease)] hover:shadow-[0_50px_100px_-50px_var(--foreground)] lg:p-12">
              <div>
                <Eyebrow>{t("03 — Préparation", "03 — Preparation")}</Eyebrow>
                <h3 className="mt-6 font-section text-3xl font-semibold tracking-tight md:text-4xl">
                  {t("Pharmacie agréée.", "Licensed pharmacy.")}
                </h3>
                <p className="mt-4 text-pretty text-base text-muted">
                  {t(
                    "Contrôle pharmaceutique, notice incluse.",
                    "Pharmaceutical check, instructions included.",
                  )}
                </p>
              </div>
              <div className="mt-10 h-48 overflow-hidden rounded-2xl transition-all duration-700 ease-[var(--ease)] group-hover:h-64">
                <img
                  src={pharmacieImg}
                  alt={t(
                    "Préparation d'un traitement en pharmacie partenaire",
                    "Treatment prepared at a partner pharmacy",
                  )}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-[1400ms] ease-[var(--ease)] group-hover:scale-[1.05]"
                />
              </div>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="group flex h-full flex-col justify-between overflow-hidden rounded-[2.5rem] bg-cream p-10 transition-all duration-700 ease-[var(--ease)] hover:shadow-[0_50px_100px_-50px_var(--foreground)] lg:p-12">
              <div>
                <Eyebrow>{t("04 — Expédition", "04 — Shipping")}</Eyebrow>
                <h3 className="mt-6 font-section text-3xl font-semibold tracking-tight md:text-4xl">
                  {t("Colis neutre.", "Unmarked parcel.")}
                </h3>
                <p className="mt-4 text-pretty text-base text-muted">
                  {t(
                    "Livré sous 24 à 48 h, sans aucune mention extérieure.",
                    "Delivered within 24 to 48 h, with nothing written outside.",
                  )}
                </p>
              </div>
              <div className="mt-10 h-48 overflow-hidden rounded-2xl transition-all duration-700 ease-[var(--ease)] group-hover:h-64">
                <img
                  src={livraisonImg}
                  alt={t(
                    "Colis neutre livré à domicile",
                    "Unmarked parcel delivered at home",
                  )}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-[1400ms] ease-[var(--ease)] group-hover:scale-[1.05]"
                />
              </div>
            </div>
          </Reveal>
        </section>

        {/* 05 — Suivi : image plein cadre avec texte en surimpression */}
        <section className="relative overflow-hidden">
          <div className="relative h-[80vh] min-h-[560px] w-full">
            <img
              src={suiviImg}
              alt={t(
                "Homme suivant son traitement au quotidien",
                "Man following his treatment day to day",
              )}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/85 via-foreground/30 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 pb-20">
              <div className="mx-auto flex w-full max-w-6xl flex-col items-center px-6 text-center text-cream">
                <Reveal>
                  <Eyebrow light>{t("05 — Accompagnement", "05 — Follow-up")}</Eyebrow>
                  <h2 className="mx-auto mt-6 max-w-3xl text-balance font-display text-5xl font-light italic tracking-tight md:text-7xl">
                    {t("Un suivi qui dure.", "Care that keeps going.")}
                  </h2>
                </Reveal>
                <Reveal delay={120}>
                  <p className="mx-auto mt-8 max-w-[46ch] text-pretty text-xl text-cream/80">
                    {t(
                      "Ajustement, renouvellement ou arrêt : votre médecin reste joignable depuis votre espace patient.",
                      "Adjust, renew or stop: your doctor stays reachable from your patient portal.",
                    )}
                  </p>
                </Reveal>
              </div>
            </div>
          </div>
        </section>

        {/* CTA final */}
        <section className="flex flex-col items-center px-6 py-32 lg:py-44">
          <Reveal>
            <h2 className="text-balance text-center font-display text-6xl font-light italic tracking-tight md:text-8xl">
              {t("Votre parcours", "Your journey")}
              <br />
              <span className="text-clay">{t("commence ici.", "starts here.")}</span>
            </h2>
          </Reveal>
          <Reveal delay={120} className="mt-14 flex flex-col items-center gap-8">
            <Link
              to="/espace-patient"
              className="group inline-flex items-center gap-2 rounded-full bg-clay px-12 py-6 text-lg font-medium text-cream transition-all duration-500 ease-[var(--ease)] hover:scale-[1.03] hover:gap-4 hover:bg-clay-deep hover:shadow-[0_30px_60px_-20px_var(--clay)]"
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
      </main>

      <SiteFooter />
    </div>
  );
}
