import { createFileRoute, Link } from "@tanstack/react-router";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Reveal } from "@/components/reveal";
import { CountUp } from "@/components/count-up";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/statistiques")({
  head: () => ({
    meta: [
      { title: "Les hommes concernés — chiffres par domaine | MAAN" },
      {
        name: "description",
        content:
          "Combien d'hommes sont concernés par les troubles sexuels, le surpoids, la chute de cheveux et les problèmes de peau ? Les chiffres, et pourquoi si peu consultent.",
      },
      { property: "og:type", content: "article" },
      { property: "og:title", content: "Les hommes concernés — chiffres par domaine | MAAN" },
      {
        property: "og:description",
        content:
          "Troubles sexuels, poids, cheveux, peau : les chiffres réels des hommes concernés, et pourquoi consulter tôt change tout.",
      },
      { property: "og:url", content: "/statistiques" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Les hommes concernés — chiffres par domaine | MAAN" },
      {
        name: "twitter:description",
        content:
          "Vous n'êtes pas un cas isolé : les statistiques par domaine de soin chez MAAN.",
      },
    ],
    links: [{ rel: "canonical", href: "/statistiques" }],
  }),
  component: StatistiquesPage,
});

type T = (fr: string, en: string) => string;

function buildDomaines(t: T) {
  return [
    {
      slug: "sexuel" as const,
      tag: t("Santé sexuelle", "Sexual health"),
      titre: t("Troubles de l'érection et éjaculation précoce", "Erectile dysfunction and premature ejaculation"),
      phrase: t(
        "Une panne, une baisse de désir ou une éjaculation trop rapide : c'est l'un des motifs les plus fréquents, et l'un des moins avoués.",
        "A failed erection, low desire or ejaculating too fast: one of the most common reasons men seek care, and one of the least talked about.",
      ),
      stats: [
        {
          value: 52,
          suffix: "%",
          label: t("des hommes de 40 à 70 ans concernés par des troubles de l'érection", "of men aged 40–70 experience erectile difficulties"),
        },
        {
          value: 30,
          suffix: "%",
          label: t("des hommes touchés par l'éjaculation précoce, tous âges confondus", "of men are affected by premature ejaculation, all ages"),
        },
        {
          value: 1,
          suffix: t(" sur 4", " in 4"),
          label: t("seulement en parle à un professionnel de santé", "only ever mentions it to a health professional"),
        },
      ],
    },
    {
      slug: "poids" as const,
      tag: t("Poids", "Weight"),
      titre: t("Surpoids et obésité", "Overweight and obesity"),
      phrase: t(
        "Le poids se prend lentement, souvent sans signal d'alerte, et il pèse sur le cœur, le sommeil et l'énergie.",
        "Weight builds slowly, often without warning signs, and it weighs on the heart, sleep and energy.",
      ),
      stats: [
        {
          value: 47,
          suffix: "%",
          label: t("des hommes adultes sont en surpoids ou en situation d'obésité", "of adult men are overweight or living with obesity"),
        },
        {
          value: 17,
          suffix: "%",
          label: t("vivent avec une obésité, en hausse continue depuis 20 ans", "live with obesity, rising steadily over 20 years"),
        },
        {
          value: 80,
          suffix: "%",
          label: t("reprennent du poids après un régime seul, sans suivi médical", "regain weight after dieting alone, without medical follow-up"),
        },
      ],
    },
    {
      slug: "cheveux" as const,
      tag: t("Cheveux", "Hair"),
      titre: t("Alopécie androgénétique", "Male pattern hair loss"),
      phrase: t(
        "La calvitie masculine commence bien plus tôt qu'on ne le croit, et plus on agit tôt, plus on garde de cheveux.",
        "Male pattern baldness starts far earlier than most think, and the earlier you act, the more hair you keep.",
      ),
      stats: [
        {
          value: 70,
          suffix: "%",
          label: t("des hommes connaîtront une chute de cheveux au cours de leur vie", "of men will experience hair loss during their lifetime"),
        },
        {
          value: 25,
          suffix: "%",
          label: t("voient les premiers signes avant 30 ans", "notice the first signs before the age of 30"),
        },
        {
          value: 50,
          suffix: "%",
          label: t("des hommes de plus de 50 ans sont visiblement dégarnis", "of men over 50 have visibly thinning hair"),
        },
      ],
    },
    {
      slug: "peau" as const,
      tag: t("Peau", "Skin"),
      titre: t("Acné et irritations chroniques", "Acne and chronic irritation"),
      phrase: t(
        "L'acné n'est pas réservée à l'adolescence : elle persiste à l'âge adulte, avec un impact réel sur la confiance.",
        "Acne is not just a teenage issue: it persists into adulthood, with a real impact on confidence.",
      ),
      stats: [
        {
          value: 40,
          suffix: "%",
          label: t("des adultes déclarent des poussées d'acné après 25 ans", "of adults report acne flare-ups after the age of 25"),
        },
        {
          value: 1,
          suffix: t(" sur 5", " in 5"),
          label: t("hommes souffre d'irritations liées au rasage de façon chronique", "men suffers from chronic shaving-related irritation"),
        },
        {
          value: 3,
          suffix: t(" ans", " years"),
          label: t("d'attente moyenne avant une première consultation dermatologique", "average wait before a first dermatology consultation"),
        },
      ],
    },
  ];
}

function StatistiquesPage() {
  const { t } = useI18n();
  const domaines = buildDomaines(t);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main>
        <section className="relative overflow-hidden border-b border-border">
          <div className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-amber/20 blur-3xl" />
          <div className="pointer-events-none absolute -right-16 bottom-0 h-72 w-72 rounded-full bg-clay/15 blur-3xl" />
          <div className="relative mx-auto max-w-6xl px-6 py-20 sm:py-28">
            <Reveal>
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
                {t("Les chiffres", "The numbers")}
              </p>
              <h1 className="mt-5 max-w-3xl font-display text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
                {t("Vous n'êtes pas un cas isolé.", "You are not an isolated case.")}
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">
                {t(
                  "La plupart des hommes traversent au moins un de ces sujets. Très peu en parlent. Voici ce que disent les chiffres, domaine par domaine.",
                  "Most men go through at least one of these issues. Very few talk about it. Here is what the numbers say, area by area.",
                )}
              </p>
            </Reveal>

            <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-3">
              {[
                {
                  value: 3,
                  suffix: t(" sur 4", " in 4"),
                  label: t("hommes repoussent une consultation par gêne", "men delay a consultation out of embarrassment"),
                },
                {
                  value: 24,
                  suffix: "h",
                  label: t("délai moyen de réponse d'un médecin sur MAAN", "average physician response time on MAAN"),
                },
                {
                  value: 0,
                  suffix: "€",
                  label: t("la consultation est gratuite", "the consultation is free"),
                },
              ].map((s, i) => (
                <Reveal key={s.label} delay={i * 80} className="bg-background p-8">
                  <CountUp
                    to={s.value}
                    suffix={s.suffix}
                    className="font-display text-4xl font-semibold tracking-tight sm:text-5xl"
                  />
                  <p className="mt-3 text-sm leading-relaxed text-muted">{s.label}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
          <div className="space-y-20">
            {domaines.map((d, index) => (
              <Reveal key={d.slug} as="article" className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-clay">
                    {String(index + 1).padStart(2, "0")} — {d.tag}
                  </p>
                  <h2 className="mt-4 font-display text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
                    {d.titre}
                  </h2>
                  <p className="mt-4 max-w-md leading-relaxed text-muted">{d.phrase}</p>
                  <Link
                    to="/soins/$domaine"
                    params={{ domaine: d.slug }}
                    search={{ produit: undefined }}
                    className="mt-6 inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-medium transition-colors hover:border-clay hover:text-clay"
                  >
                    {t("Voir les soins", "See the treatments")}
                    <span aria-hidden>→</span>
                  </Link>
                </div>

                <div className="grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-3">
                  {d.stats.map((s, i) => (
                    <Reveal key={s.label} delay={i * 90} className="bg-background p-7">
                      <CountUp
                        to={s.value}
                        suffix={s.suffix}
                        className="font-display text-4xl font-semibold tracking-tight text-clay"
                      />
                      <p className="mt-3 text-sm leading-relaxed text-muted">{s.label}</p>
                    </Reveal>
                  ))}
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="border-t border-border bg-sand/40">
          <div className="mx-auto max-w-4xl px-6 py-20 text-center sm:py-24">
            <Reveal>
              <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
                {t(
                  "Derrière chaque pourcentage, il y a un homme qui a attendu.",
                  "Behind every percentage, there is a man who waited.",
                )}
              </h2>
              <p className="mx-auto mt-5 max-w-2xl leading-relaxed text-muted">
                {t(
                  "Le questionnaire prend quelques minutes, il est confidentiel, et un médecin vous répond. Sans jugement, sans salle d'attente.",
                  "The questionnaire takes a few minutes, it is confidential, and a physician replies. No judgement, no waiting room.",
                )}
              </p>
              <Link
                to="/questionnaire"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-clay px-7 py-3.5 text-sm font-medium text-cream transition-colors hover:bg-clay-deep"
              >
                {t("Démarrer ma consultation gratuite", "Start my free consultation")}
                <span aria-hidden>→</span>
              </Link>
              <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.15em] text-muted">
                {t(
                  "Chiffres issus d'études de santé publique européennes et internationales.",
                  "Figures drawn from European and international public health studies.",
                )}
              </p>
            </Reveal>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
