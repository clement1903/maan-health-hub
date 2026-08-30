import type { ClinicalRule, Question, QuestionnaireDefinition } from "./types";

/**
 * Définitions de questionnaires MAAN.
 *
 * IMPORTANT : aucune contre-indication ni règle d'éligibilité réelle n'est
 * codée ici. Toutes les règles ci-dessous sont des PLACEHOLDERS destinés à
 * être remplacés par des protocoles cliniques validés par MAAN.
 */

const identite: Question[] = [
  {
    id: "prenom",
    type: "text",
    section: "identite",
    title: "Comment pouvons-nous vous appeler ?",
    subtitle: "Votre prénom suffit pour commencer.",
    placeholder: "Prénom",
    maxLength: 80,
    required: true,
  },
  {
    id: "date_naissance",
    type: "date",
    section: "identite",
    title: "Quelle est votre date de naissance ?",
    why: "Le médecin a besoin de votre âge pour évaluer votre dossier.",
    required: true,
  },
  {
    id: "morphologie",
    type: "body",
    section: "identite",
    title: "Votre taille et votre poids",
    subtitle: "Une estimation suffit.",
    why: "Ces données servent au médecin à adapter un éventuel dosage.",
    required: true,
  },
];

const antecedentsCommuns: Question[] = [
  {
    id: "antecedents",
    type: "conditions",
    section: "antecedents",
    title: "Avez-vous déjà reçu l'un de ces diagnostics ?",
    subtitle: "Sélectionnez tout ce qui s'applique.",
    why: "Vos antécédents aident le médecin à évaluer la sécurité d'un traitement.",
    type_hint: undefined,
    required: true,
    options: [
      { value: "cardiovasculaire", label: "Maladie cardiaque ou vasculaire" },
      { value: "hypertension", label: "Hypertension artérielle" },
      { value: "diabete", label: "Diabète" },
      { value: "renal", label: "Maladie rénale" },
      { value: "hepatique", label: "Maladie du foie" },
      { value: "psy", label: "Trouble psychiatrique suivi" },
      { value: "cancer", label: "Cancer (actuel ou passé)" },
      { value: "autre", label: "Autre pathologie" },
      { value: "aucun", label: "Aucun de ces diagnostics", exclusive: true },
    ],
  } as Question,
  {
    id: "antecedents_precision",
    type: "text",
    section: "antecedents",
    title: "Pouvez-vous préciser ?",
    subtitle: "Diagnostic, année, suivi en cours.",
    placeholder: "Ex. hypertension diagnostiquée en 2021, suivie par mon médecin traitant",
    maxLength: 1000,
    required: true,
    condition: { any: [{ questionId: "antecedents", op: "includes", value: "autre" }] },
  },
  {
    id: "medicaments_actuels_oui",
    type: "boolean",
    section: "medicaments",
    title: "Prenez-vous actuellement des médicaments ?",
    subtitle: "Y compris compléments alimentaires et produits sans ordonnance.",
    required: true,
  },
  {
    id: "medicaments_actuels",
    type: "medications",
    section: "medicaments",
    title: "Quels médicaments prenez-vous ?",
    subtitle: "Ajoutez-les un par un, avec le dosage si vous le connaissez.",
    why: "Certaines associations demandent l'attention du médecin.",
    required: true,
    condition: { questionId: "medicaments_actuels_oui", op: "eq", value: "oui" },
  },
  {
    id: "allergies_oui",
    type: "boolean",
    section: "allergies",
    title: "Avez-vous des allergies connues ?",
    required: true,
  },
  {
    id: "allergies",
    type: "allergies",
    section: "allergies",
    title: "À quoi êtes-vous allergique ?",
    subtitle: "Médicament, excipient, aliment…",
    required: true,
    condition: { questionId: "allergies_oui", op: "eq", value: "oui" },
  },
  {
    id: "traitements_precedents_oui",
    type: "boolean",
    section: "traitements_precedents",
    title: "Avez-vous déjà essayé un traitement pour ce motif ?",
    required: true,
  },
  {
    id: "traitements_precedents",
    type: "previous_treatments",
    section: "traitements_precedents",
    title: "Qu'avez-vous déjà essayé ?",
    subtitle: "Nom du traitement, durée, effet ressenti.",
    required: true,
    condition: { questionId: "traitements_precedents_oui", op: "eq", value: "oui" },
  },
  {
    id: "mode_de_vie",
    type: "lifestyle",
    section: "mode_de_vie",
    title: "Quelques éléments sur votre mode de vie",
    subtitle: "Il n'y a pas de bonne ou de mauvaise réponse.",
    why: "Le mode de vie influence souvent l'efficacité d'un traitement.",
    required: true,
  },
  {
    id: "complement",
    type: "text",
    section: "autres",
    title: "Souhaitez-vous ajouter quelque chose pour le médecin ?",
    subtitle: "Facultatif.",
    placeholder: "Tout ce qui vous semble utile",
    maxLength: 1500,
  },
];

/** Règles PLACEHOLDER — à remplacer par les protocoles validés MAAN. */
const reglesCommunes: ClinicalRule[] = [
  {
    id: "placeholder_antecedent_signale",
    label: "Antécédent médical déclaré",
    when: {
      all: [
        { questionId: "antecedents", op: "answered" },
        { questionId: "antecedents", op: "excludes", value: "aucun" },
      ],
    },
    signal: "amber",
    note: "Le patient déclare au moins un antécédent médical. Règle placeholder : à remplacer par les critères cliniques validés.",
    placeholder: true,
  },
  {
    id: "placeholder_traitement_en_cours",
    label: "Traitement en cours déclaré",
    when: { questionId: "medicaments_actuels_oui", op: "eq", value: "oui" },
    signal: "amber",
    note: "Traitement en cours à vérifier par le médecin. Règle placeholder.",
    placeholder: true,
  },
  {
    id: "placeholder_allergie",
    label: "Allergie déclarée",
    when: { questionId: "allergies_oui", op: "eq", value: "oui" },
    signal: "amber",
    note: "Allergie déclarée par le patient. Règle placeholder.",
    placeholder: true,
  },
  {
    id: "placeholder_dossier_complet",
    label: "Aucun élément signalé par les règles configurées",
    when: {
      all: [
        { questionId: "antecedents", op: "includes", value: "aucun" },
        { questionId: "medicaments_actuels_oui", op: "eq", value: "non" },
        { questionId: "allergies_oui", op: "eq", value: "non" },
      ],
    },
    signal: "green",
    note: "Aucun élément identifié par les règles placeholder configurées. Ne constitue pas une décision médicale.",
    placeholder: true,
  },
];

function build(
  base: Omit<QuestionnaireDefinition, "questions" | "rules"> & {
    specific: Question[];
    specificRules?: ClinicalRule[];
  },
): QuestionnaireDefinition {
  const { specific, specificRules = [], ...rest } = base;
  return {
    ...rest,
    questions: [...identite, ...specific, ...antecedentsCommuns],
    rules: [...reglesCommunes, ...specificRules],
  };
}

export const questionnaireDefinitions: QuestionnaireDefinition[] = [
  build({
    id: "sexual-health",
    version: "1.0.0",
    slug: "sexuel",
    category: "sexual",
    title: "Santé sexuelle",
    intro:
      "Quelques questions pour permettre à un médecin d'évaluer votre situation. Vos réponses sont confidentielles et ne sont lues que par l'équipe médicale.",
    estimatedMinutes: 5,
    specific: [
      {
        id: "motif_sexuel",
        type: "single",
        section: "motif",
        title: "Qu'est-ce qui vous amène aujourd'hui ?",
        required: true,
        options: [
          { value: "erection", label: "Difficultés d'érection" },
          { value: "ejaculation", label: "Éjaculation précoce" },
          { value: "libido", label: "Baisse de désir" },
          { value: "autre", label: "Autre" },
        ],
      },
      {
        id: "motif_sexuel_autre",
        type: "text",
        section: "motif",
        title: "Décrivez votre situation avec vos mots",
        maxLength: 1000,
        required: true,
        condition: { questionId: "motif_sexuel", op: "eq", value: "autre" },
      },
      {
        id: "anciennete_sexuel",
        type: "single",
        section: "symptomes",
        title: "Depuis combien de temps ?",
        required: true,
        options: [
          { value: "moins_3m", label: "Moins de 3 mois" },
          { value: "3_12m", label: "Entre 3 et 12 mois" },
          { value: "plus_1an", label: "Plus d'un an" },
        ],
      },
      {
        id: "symptomes_sexuel",
        type: "symptoms",
        section: "symptomes",
        title: "Comment cela se manifeste-t-il ?",
        subtitle: "Sélectionnez tout ce qui s'applique.",
        required: true,
        options: [
          { value: "difficulte_obtenir", label: "Difficulté à obtenir une érection" },
          { value: "difficulte_maintenir", label: "Difficulté à la maintenir" },
          { value: "variable", label: "Cela varie selon les situations" },
          { value: "matinales_absentes", label: "Absence d'érections matinales" },
          { value: "stress", label: "Stress ou anxiété associés" },
        ],
      },
      {
        id: "frequence_sexuel",
        type: "number",
        section: "symptomes",
        title: "Sur 10, à quel point cela affecte-t-il votre quotidien ?",
        min: 0,
        max: 10,
        unit: "/10",
        required: true,
      },
    ],
  }),
  build({
    id: "weight-management",
    version: "1.0.0",
    slug: "poids",
    category: "weight",
    title: "Gestion du poids",
    intro:
      "Ces questions permettent au médecin de comprendre votre parcours et votre situation actuelle. Aucune réponse n'est jugée.",
    estimatedMinutes: 6,
    specific: [
      {
        id: "objectif_poids",
        type: "single",
        section: "motif",
        title: "Quel est votre objectif principal ?",
        required: true,
        options: [
          { value: "perte", label: "Perdre du poids" },
          { value: "stabiliser", label: "Stabiliser mon poids" },
          { value: "metabolique", label: "Améliorer ma santé métabolique" },
        ],
      },
      {
        id: "historique_poids",
        type: "single",
        section: "symptomes",
        title: "Comment votre poids a-t-il évolué sur les 12 derniers mois ?",
        required: true,
        options: [
          { value: "hausse", label: "En hausse" },
          { value: "stable", label: "Stable" },
          { value: "baisse", label: "En baisse" },
          { value: "yoyo", label: "En dents de scie" },
        ],
      },
      {
        id: "methodes_essayees",
        type: "multi",
        section: "traitements_precedents",
        title: "Qu'avez-vous déjà mis en place ?",
        required: true,
        options: [
          { value: "alimentation", label: "Changement d'alimentation" },
          { value: "sport", label: "Activité physique régulière" },
          { value: "suivi", label: "Suivi diététique ou médical" },
          { value: "traitement", label: "Un traitement médicamenteux" },
          { value: "rien", label: "Rien pour l'instant", exclusive: true },
        ],
      },
      {
        id: "photo_poids",
        type: "file",
        section: "autres",
        title: "Souhaitez-vous joindre un document médical récent ?",
        subtitle: "Bilan sanguin, ordonnance, compte rendu — facultatif.",
        why: "Un document récent aide le médecin à évaluer votre dossier plus finement.",
        multiple: true,
      },
    ],
  }),
  build({
    id: "hair-management",
    version: "1.0.0",
    slug: "cheveux",
    category: "hair",
    title: "Chute de cheveux",
    intro:
      "Quelques questions pour décrire votre chute de cheveux. Une photo est parfois utile au médecin, mais elle reste facultative.",
    estimatedMinutes: 4,
    specific: [
      {
        id: "zone_chute",
        type: "multi",
        section: "symptomes",
        title: "Où observez-vous la perte de cheveux ?",
        required: true,
        options: [
          { value: "golfes", label: "Golfes temporaux" },
          { value: "vertex", label: "Sommet du crâne" },
          { value: "diffuse", label: "Perte diffuse" },
          { value: "plaques", label: "Par plaques" },
        ],
      },
      {
        id: "anciennete_chute",
        type: "single",
        section: "symptomes",
        title: "Depuis combien de temps ?",
        required: true,
        options: [
          { value: "moins_6m", label: "Moins de 6 mois" },
          { value: "6m_2ans", label: "6 mois à 2 ans" },
          { value: "plus_2ans", label: "Plus de 2 ans" },
        ],
      },
      {
        id: "antecedents_familiaux",
        type: "boolean",
        section: "antecedents",
        title: "Y a-t-il des cas de calvitie dans votre famille ?",
        required: true,
      },
      {
        id: "photo_cheveux",
        type: "file",
        section: "autres",
        title: "Souhaitez-vous joindre une photo de votre cuir chevelu ?",
        subtitle: "Facultatif — de face et du dessus si possible.",
        why: "La photo permet au médecin d'objectiver l'évolution.",
        multiple: true,
      },
    ],
  }),
  build({
    id: "skin-management",
    version: "1.0.0",
    slug: "peau",
    category: "skin",
    title: "Santé de la peau",
    intro:
      "Décrivez ce que vous observez sur votre peau. Le médecin s'appuiera sur vos réponses et, si vous le souhaitez, sur vos photos.",
    estimatedMinutes: 4,
    specific: [
      {
        id: "probleme_peau",
        type: "single",
        section: "motif",
        title: "Que souhaitez-vous traiter ?",
        required: true,
        options: [
          { value: "acne", label: "Acné" },
          { value: "rosacee", label: "Rougeurs / rosacée" },
          { value: "vieillissement", label: "Signes de vieillissement" },
          { value: "autre", label: "Autre" },
        ],
      },
      {
        id: "peau_autre",
        type: "text",
        section: "motif",
        title: "Décrivez ce que vous observez",
        maxLength: 1000,
        required: true,
        condition: { questionId: "probleme_peau", op: "eq", value: "autre" },
      },
      {
        id: "zones_peau",
        type: "multi",
        section: "symptomes",
        title: "Quelles zones sont concernées ?",
        required: true,
        options: [
          { value: "visage", label: "Visage" },
          { value: "dos", label: "Dos" },
          { value: "torse", label: "Torse" },
          { value: "cou", label: "Cou" },
        ],
      },
      {
        id: "photo_peau",
        type: "file",
        section: "autres",
        title: "Souhaitez-vous joindre une photo ?",
        subtitle: "Facultatif — lumière naturelle, sans filtre.",
        why: "Une photo aide le médecin à évaluer l'aspect des lésions.",
        multiple: true,
      },
    ],
  }),
];

export function findDefinitionBySlug(slug: string): QuestionnaireDefinition | undefined {
  return questionnaireDefinitions.find((d) => d.slug === slug);
}

export function findDefinitionByCategory(category: string): QuestionnaireDefinition | undefined {
  return questionnaireDefinitions.find((d) => d.category === category);
}
