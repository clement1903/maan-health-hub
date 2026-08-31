import type { Bi } from "@/data/soins";

export type ChiffreMarche = {
  value: number;
  suffix?: string;
  prefix?: string;
  label: Bi;
};

export type DomaineDetails = {
  /** Description empathique du problème de santé, affichée en haut de la page dédiée. */
  probleme: Bi;
  /** Quelques chiffres de marché / de prévalence, affichés entre la description et les médicaments. */
  chiffres: ChiffreMarche[];
  /** Note de source commune. */
  source: Bi;
};

export const domaineDetails: Record<string, DomaineDetails> = {
  sexuel: {
    probleme: {
      fr: "Pannes d'érection, éjaculation précoce, baisse de désir : ces difficultés touchent la grande majorité des hommes à un moment de leur vie. Le plus souvent, elles ne sont ni définitives ni irréversibles — elles traduisent un stress, une fatigue ou un facteur médical identifiable. Pourtant, la gêne retarde la consultation de plusieurs années en moyenne. Une évaluation en ligne, discrète et sérieuse, permet d'agir tôt.",
      en: "Erectile difficulties, premature ejaculation, loss of desire: these issues affect the vast majority of men at some point in their lives. Most of the time they are neither permanent nor irreversible — they signal stress, fatigue or an identifiable medical factor. Yet embarrassment delays consultation by several years on average. A discreet, rigorous online evaluation allows you to act early.",
    },
    chiffres: [
      {
        value: 52,
        suffix: "%",
        label: {
          fr: "des hommes de 40 à 70 ans connaissent des troubles de l'érection",
          en: "of men aged 40–70 experience erectile difficulties",
        },
      },
      {
        value: 30,
        suffix: "%",
        label: {
          fr: "des hommes sont touchés par l'éjaculation précoce, tous âges confondus",
          en: "of men are affected by premature ejaculation, across all ages",
        },
      },
      {
        value: 1,
        suffix: " / 3",
        prefix: "",
        label: {
          fr: "homme seulement en parle à un professionnel de santé",
          en: "in 3 men only ever mentions it to a health professional",
        },
      },
    ],
    source: {
      fr: "Sources : études épidémiologiques internationales sur la santé sexuelle masculine.",
      en: "Sources: international epidemiological studies on men's sexual health.",
    },
  },
  poids: {
    probleme: {
      fr: "Le surpoids n'est pas une question de volonté : métabolisme, hormones, sommeil et environnement pèsent lourd dans la balance. Les régimes seuls échouent le plus souvent parce qu'ils ne traitent pas ces mécanismes. Un accompagnement médical, associant si nécessaire un traitement validé cliniquement, change durablement la donne.",
      en: "Being overweight is not a question of willpower: metabolism, hormones, sleep and environment weigh heavily. Diets alone most often fail because they don't address these mechanisms. Medical support, combined when needed with a clinically validated treatment, durably changes the outcome.",
    },
    chiffres: [
      {
        value: 47,
        suffix: "%",
        label: {
          fr: "des hommes adultes sont en surpoids ou en situation d'obésité",
          en: "of adult men are overweight or living with obesity",
        },
      },
      {
        value: 17,
        suffix: "%",
        label: {
          fr: "vivent avec une obésité, en hausse continue depuis 20 ans",
          en: "live with obesity, rising steadily over 20 years",
        },
      },
      {
        value: 80,
        suffix: "%",
        label: {
          fr: "reprennent du poids après un régime seul, sans suivi médical",
          en: "regain weight after dieting alone, without medical follow-up",
        },
      },
    ],
    source: {
      fr: "Sources : données de santé publique sur le surpoids et l'obésité masculins.",
      en: "Sources: public health data on male overweight and obesity.",
    },
  },
  cheveux: {
    probleme: {
      fr: "La chute de cheveux commence souvent bien plus tôt qu'on ne le pense — dès 20 ou 25 ans — et elle est avant tout hormonale et héréditaire. Plus elle est prise tôt, plus elle se freine efficacement : un cheveu perdu depuis longtemps ne repousse pas, mais un cheveu affaibli peut être sauvé. Les traitements de référence existent et sont bien documentés.",
      en: "Hair loss often starts much earlier than expected — as early as 20 or 25 — and is above all hormonal and hereditary. The earlier it is addressed, the more effectively it can be slowed: a long-lost hair will not regrow, but a weakened hair can be saved. Reference treatments exist and are well documented.",
    },
    chiffres: [
      {
        value: 70,
        suffix: "%",
        label: {
          fr: "des hommes connaîtront une chute de cheveux au cours de leur vie",
          en: "of men will experience hair loss during their lifetime",
        },
      },
      {
        value: 25,
        suffix: "%",
        label: {
          fr: "voient les premiers signes avant 30 ans",
          en: "notice the first signs before the age of 30",
        },
      },
      {
        value: 50,
        suffix: "%",
        label: {
          fr: "des hommes de plus de 50 ans sont visiblement dégarnis",
          en: "of men over 50 have visibly thinning hair",
        },
      },
    ],
    source: {
      fr: "Sources : études cliniques sur l'alopécie androgénétique masculine.",
      en: "Sources: clinical studies on male androgenetic alopecia.",
    },
  },
  peau: {
    probleme: {
      fr: "Acné persistante, irritations au rasage, rougeurs, vieillissement cutané : la peau des hommes est plus épaisse et plus grasse, et elle est rarement traitée avec les bons actifs. Les hommes consultent peu les dermatologues et attendent longtemps avant d'agir — alors que des traitements simples et efficaces existent sur prescription.",
      en: "Persistent acne, shaving irritation, redness, skin ageing: men's skin is thicker and oilier, and it is rarely treated with the right active ingredients. Men seldom see dermatologists and wait a long time before acting — even though simple, effective prescription treatments exist.",
    },
    chiffres: [
      {
        value: 40,
        suffix: "%",
        label: {
          fr: "des adultes déclarent des poussées d'acné après 25 ans",
          en: "of adults report acne flare-ups after the age of 25",
        },
      },
      {
        value: 1,
        suffix: " / 2",
        label: {
          fr: "homme souffre d'irritations chroniques liées au rasage",
          en: "in 2 men suffers from chronic shaving-related irritation",
        },
      },
      {
        value: 3,
        suffix: t3Suffix,
        label: {
          fr: "d'attente moyenne avant une première consultation dermatologique",
          en: "average wait before a first dermatology consultation",
        },
      },
    ],
    source: {
      fr: "Sources : données dermatologiques et délais d'accès aux soins.",
      en: "Sources: dermatology data and care access waiting times.",
    },
  },
};

// Suffixe localisé pour le chiffre « 3 mois » (déclaré ici pour rester simple).
const t3Suffix = "";

export function getDomaineDetails(slug: string): DomaineDetails | undefined {
  return domaineDetails[slug];
}
