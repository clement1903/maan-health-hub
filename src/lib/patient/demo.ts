/**
 * Données de DÉMONSTRATION de l'espace patient.
 * Clairement fictives : aucun médecin, dosage ou décision réels.
 * Elles servent uniquement à tester tous les états de l'interface.
 */

import medecin1 from "@/assets/medecin-1.jpg";
import medecin2 from "@/assets/medecin-2.jpg";

import type { Doctor, Journey, PatientData } from "./types";

export const scenarioKeys = ["A", "B", "C", "D", "E", "F"] as const;
export type ScenarioKey = (typeof scenarioKeys)[number];

export const scenarioLabels: Record<ScenarioKey, { fr: string; en: string }> = {
  A: { fr: "A — Dossier en attente du médecin", en: "A — File awaiting the doctor" },
  B: { fr: "B — Le médecin demande une information", en: "B — Doctor requests information" },
  C: { fr: "C — Pharmacie en préparation", en: "C — Pharmacy preparing" },
  D: { fr: "D — Colis expédié", en: "D — Parcel shipped" },
  E: { fr: "E — Traitement actif, suivi requis", en: "E — Active treatment, follow-up due" },
  F: { fr: "F — Deux parcours simultanés", en: "F — Two simultaneous journeys" },
};

const drLemoine: Doctor = {
  id: "doc-1",
  name: "Dr Antoine Lemoine",
  role: { fr: "Médecin généraliste", en: "General practitioner" },
  big: "19912345678",
  photo: medecin1,
};

const drBadel: Doctor = {
  id: "doc-2",
  name: "Dr Marion Badel",
  role: { fr: "Dermatologue", en: "Dermatologist" },
  big: "19923456789",
  photo: medecin2,
};

const hairBase: Journey = {
  id: "j-hair",
  domain: "hair",
  title: "Hair Management",
  condition: { fr: "Perte de cheveux", en: "Hair loss" },
  status: "DOCTOR_REVIEW",
  stageIndex: 1,
  stages: [
    {
      key: "evaluation",
      detail: { fr: "Questionnaire envoyé.", en: "Questionnaire sent." },
      at: "28 août 2026 • 14:32",
    },
    { key: "medecin" },
    { key: "decision" },
    { key: "pharmacie" },
    { key: "livraison" },
    { key: "suivi" },
  ],
  doctor: drBadel,
  treatment: null,
  delivery: null,
  followUp: { due: false },
  plan: null,
  photos: { enabled: true, entries: [] },
};

const sexualBase: Journey = {
  id: "j-sexual",
  domain: "sexual",
  title: "Sexual Management",
  condition: { fr: "Troubles de l'érection", en: "Erectile difficulties" },
  status: "DOCTOR_REVIEW",
  stageIndex: 1,
  stages: [
    {
      key: "evaluation",
      detail: { fr: "Questionnaire envoyé.", en: "Questionnaire sent." },
      at: "30 août 2026 • 09:05",
    },
    { key: "medecin" },
    { key: "decision" },
    { key: "pharmacie" },
    { key: "livraison" },
    { key: "suivi" },
  ],
  doctor: drLemoine,
  treatment: null,
  delivery: null,
  followUp: { due: false },
  plan: null,
};

function clone<T>(v: T): T {
  return JSON.parse(JSON.stringify(v)) as T;
}

function hair(overrides: Partial<Journey>): Journey {
  return { ...clone(hairBase), doctor: hairBase.doctor, ...overrides };
}

function sexual(overrides: Partial<Journey>): Journey {
  return { ...clone(sexualBase), doctor: sexualBase.doctor, ...overrides };
}

const weightActive: Journey = {
  id: "j-weight",
  domain: "weight",
  title: "Weight Management",
  condition: { fr: "Accompagnement du poids", en: "Weight support" },
  status: "FOLLOW_UP_DUE",
  stageIndex: 5,
  stages: [
    { key: "evaluation", detail: { fr: "Questionnaire envoyé.", en: "Questionnaire sent." }, at: "12 juin 2026 • 10:11" },
    { key: "medecin", detail: { fr: "Dossier examiné par le médecin.", en: "File reviewed by the doctor." }, at: "12 juin 2026 • 18:40" },
    { key: "decision", detail: { fr: "Décision médicale rendue.", en: "Medical decision issued." }, at: "13 juin 2026" },
    { key: "pharmacie", detail: { fr: "Préparé par la pharmacie partenaire.", en: "Prepared by the partner pharmacy." }, at: "14 juin 2026" },
    { key: "livraison", detail: { fr: "Colis neutre livré.", en: "Discreet parcel delivered." }, at: "16 juin 2026" },
    { key: "suivi", detail: { fr: "Suivi médical disponible.", en: "Medical follow-up available." } },
  ],
  doctor: drLemoine,
  treatment: {
    name: "Traitement prescrit par votre médecin",
    posologie: {
      fr: "Posologie indiquée sur votre ordonnance.",
      en: "Dosage as indicated on your prescription.",
    },
    note: {
      fr: "Seules les informations réellement présentes dans votre dossier sont affichées.",
      en: "Only the information actually present in your file is displayed.",
    },
  },
  delivery: { stage: "livraison", eta: "16 juin 2026", carrier: "Colissimo", tracking: "MAAN-DEMO-4471" },
  followUp: { last: "16 août 2026", next: "12 septembre 2026", due: true },
  plan: {
    state: "actif",
    nextCharge: "12 septembre 2026",
    nextDelivery: "14 septembre 2026",
    nextMedicalReview: "12 septembre 2026",
    medicalReviewRequired: true,
  },
  progress: {
    kind: "weight",
    unit: "kg",
    entries: [
      { date: "12 juin 2026", value: 94.2 },
      { date: "12 juillet 2026", value: 92.1 },
      { date: "16 août 2026", value: 90.6 },
      { date: "31 août 2026", value: 89.8 },
    ],
  },
};

const baseNotifications = [
  {
    id: "n-1",
    title: { fr: "Vous avez une nouvelle mise à jour MAAN.", en: "You have a new MAAN update." },
    at: "31 août 2026 • 08:12",
    read: false,
  },
  {
    id: "n-2",
    title: { fr: "Votre espace patient est à jour.", en: "Your patient area is up to date." },
    at: "28 août 2026 • 14:35",
    read: true,
  },
];

export function buildScenario(key: ScenarioKey): PatientData {
  const firstName = "Julien";

  if (key === "A") {
    return {
      firstName,
      headline: {
        fr: "Votre dossier est actuellement examiné par un médecin.",
        en: "Your file is currently being reviewed by a doctor.",
      },
      journeys: [hair({ status: "AWAITING_DOCTOR", stageIndex: 1, doctor: null })],
      actions: [
        {
          id: "a-none",
          journeyId: "j-hair",
          title: { fr: "Aucune action requise", en: "No action required" },
          desc: {
            fr: "Votre dossier est complet. Un médecin l'examine actuellement.",
            en: "Your file is complete. A doctor is reviewing it right now.",
          },
          priority: "info",
          cta: { fr: "Voir mon parcours", en: "View my journey" },
          target: "traitement",
        },
      ],
      messages: [
        {
          id: "m-a1",
          journeyId: "j-hair",
          author: "maan",
          authorName: "MAAN",
          body: {
            fr: "Votre dossier a bien été reçu. Un médecin l'examine sous 24 h.",
            en: "We received your file. A doctor will review it within 24 hours.",
          },
          at: "28 août 2026 • 14:35",
        },
      ],
      notifications: clone(baseNotifications),
    };
  }

  if (key === "B") {
    return {
      firstName,
      headline: {
        fr: "Votre médecin a besoin d'une information pour poursuivre.",
        en: "Your doctor needs one piece of information to continue.",
      },
      journeys: [hair({ status: "MORE_INFORMATION_REQUIRED", stageIndex: 1 })],
      actions: [
        {
          id: "a-info",
          journeyId: "j-hair",
          title: { fr: "Répondre à votre médecin", en: "Reply to your doctor" },
          desc: {
            fr: "Dr Marion Badel a besoin d'une information supplémentaire.",
            en: "Dr Marion Badel needs one additional piece of information.",
          },
          priority: "haute",
          due: { fr: "Aujourd'hui", en: "Today" },
          cta: { fr: "Répondre maintenant", en: "Reply now" },
          target: "messages",
        },
      ],
      messages: [
        {
          id: "m-b1",
          journeyId: "j-hair",
          author: "doctor",
          authorName: "Dr Marion Badel",
          body: {
            fr: "Bonjour Julien, j'ai examiné votre dossier. J'aurais besoin de vérifier une information avant de poursuivre.",
            en: "Hello Julien, I have reviewed your file. I need to check one piece of information before continuing.",
          },
          at: "31 août 2026 • 08:10",
          request: {
            question: {
              fr: "Avez-vous commencé un nouveau médicament depuis votre dernière évaluation ?",
              en: "Have you started any new medication since your last assessment?",
            },
            options: [
              { fr: "Oui", en: "Yes" },
              { fr: "Non", en: "No" },
            ],
          },
        },
      ],
      notifications: [
        {
          id: "n-b",
          title: { fr: "Vous avez une nouvelle mise à jour MAAN.", en: "You have a new MAAN update." },
          at: "31 août 2026 • 08:10",
          read: false,
        },
        ...clone(baseNotifications).slice(1),
      ],
    };
  }

  if (key === "C") {
    return {
      firstName,
      headline: { fr: "Votre traitement est en préparation.", en: "Your treatment is being prepared." },
      journeys: [
        hair({
          status: "PHARMACY_PREPARING",
          stageIndex: 3,
          treatment: {
            name: "Traitement prescrit par votre médecin",
            posologie: { fr: "Posologie indiquée sur votre ordonnance.", en: "Dosage as indicated on your prescription." },
          },
          delivery: { stage: "preparation", eta: "3 septembre 2026" },
          plan: {
            state: "actif",
            nextCharge: "28 septembre 2026",
            nextDelivery: "30 septembre 2026",
            nextMedicalReview: "26 septembre 2026",
            medicalReviewRequired: false,
          },
        }),
      ],
      actions: [
        {
          id: "a-doc",
          journeyId: "j-hair",
          title: { fr: "Consulter votre ordonnance", en: "View your prescription" },
          desc: {
            fr: "Votre document est disponible dans votre dossier.",
            en: "Your document is available in your medical record.",
          },
          priority: "normale",
          cta: { fr: "Ouvrir mon dossier", en: "Open my record" },
          target: "profil",
        },
      ],
      messages: [
        {
          id: "m-c1",
          journeyId: "j-hair",
          author: "system",
          body: {
            fr: "Prescription transmise à la pharmacie partenaire.",
            en: "Prescription sent to the partner pharmacy.",
          },
          at: "1 septembre 2026 • 09:20",
        },
      ],
      notifications: clone(baseNotifications),
    };
  }

  if (key === "D") {
    return {
      firstName,
      headline: { fr: "Votre colis est en route.", en: "Your parcel is on its way." },
      journeys: [
        hair({
          status: "SHIPPED",
          stageIndex: 4,
          treatment: {
            name: "Traitement prescrit par votre médecin",
            posologie: { fr: "Posologie indiquée sur votre ordonnance.", en: "Dosage as indicated on your prescription." },
          },
          delivery: {
            stage: "expedition",
            eta: "3 septembre 2026",
            carrier: "Colissimo",
            tracking: "MAAN-DEMO-8812",
          },
          plan: {
            state: "actif",
            nextCharge: "28 septembre 2026",
            nextDelivery: "30 septembre 2026",
            nextMedicalReview: "26 septembre 2026",
            medicalReviewRequired: false,
          },
        }),
      ],
      actions: [
        {
          id: "a-track",
          journeyId: "j-hair",
          title: { fr: "Suivre ma livraison", en: "Track my delivery" },
          desc: {
            fr: "Votre colis est envoyé dans un emballage discret.",
            en: "Your parcel is sent in discreet packaging.",
          },
          priority: "normale",
          cta: { fr: "Voir le suivi", en: "View tracking" },
          target: "traitement",
        },
      ],
      messages: [
        {
          id: "m-d1",
          journeyId: "j-hair",
          author: "system",
          body: { fr: "Votre colis a été expédié.", en: "Your parcel has been shipped." },
          at: "2 septembre 2026 • 07:45",
        },
      ],
      notifications: clone(baseNotifications),
    };
  }

  if (key === "E") {
    return {
      firstName,
      headline: { fr: "Votre prochain suivi est disponible.", en: "Your next follow-up is available." },
      journeys: [clone(weightActive)],
      actions: [
        {
          id: "a-followup",
          journeyId: "j-weight",
          title: { fr: "Faire mon suivi", en: "Complete my follow-up" },
          desc: {
            fr: "2 minutes. Vos réponses sont transmises à votre médecin.",
            en: "2 minutes. Your answers are shared with your doctor.",
          },
          priority: "haute",
          due: { fr: "Avant le 12 septembre", en: "Before 12 September" },
          cta: { fr: "Commencer mon suivi", en: "Start my follow-up" },
          target: "suivi",
        },
        {
          id: "a-measure",
          journeyId: "j-weight",
          title: { fr: "Ajouter une mesure", en: "Add a measurement" },
          desc: { fr: "Votre poids du jour.", en: "Today's weight." },
          priority: "normale",
          cta: { fr: "Ajouter", en: "Add" },
          target: "traitement",
        },
      ],
      messages: [
        {
          id: "m-e1",
          journeyId: "j-weight",
          author: "doctor",
          authorName: "Dr Antoine Lemoine",
          body: {
            fr: "Bonjour Julien, votre évolution est régulière. Faites-moi un point lors du prochain suivi.",
            en: "Hello Julien, your progress is steady. Let me know how things are at the next follow-up.",
          },
          at: "16 août 2026 • 17:02",
        },
      ],
      notifications: clone(baseNotifications),
    };
  }

  // F — deux parcours simultanés
  return {
    firstName,
    headline: {
      fr: "Vous suivez deux parcours MAAN en parallèle.",
      en: "You are following two MAAN journeys in parallel.",
    },
    journeys: [
      hair({
        status: "DELIVERED",
        stageIndex: 5,
        treatment: {
          name: "Traitement prescrit par votre médecin",
          posologie: { fr: "Posologie indiquée sur votre ordonnance.", en: "Dosage as indicated on your prescription." },
        },
        delivery: { stage: "livraison", eta: "20 août 2026", carrier: "Colissimo", tracking: "MAAN-DEMO-2210" },
        followUp: { last: "20 août 2026", next: "18 septembre 2026", due: false },
        plan: {
          state: "actif",
          nextCharge: "18 septembre 2026",
          nextDelivery: "20 septembre 2026",
          nextMedicalReview: "18 septembre 2026",
          medicalReviewRequired: false,
        },
        photos: {
          enabled: true,
          entries: [
            { id: "p1", label: { fr: "Début", en: "Start" }, date: "20 août 2026" },
            { id: "p2", label: { fr: "Mois 1", en: "Month 1" }, date: "20 septembre 2026" },
          ],
        },
      }),
      sexual({ status: "DOCTOR_REVIEW", stageIndex: 1 }),
    ],
    actions: [
      {
        id: "a-f1",
        journeyId: "j-hair",
        title: { fr: "Ajouter une photo de progression", en: "Add a progress photo" },
        desc: {
          fr: "Optionnel. Visible uniquement par vous et les professionnels de santé autorisés.",
          en: "Optional. Visible only to you and authorised health professionals.",
        },
        priority: "normale",
        cta: { fr: "Ajouter une photo", en: "Add a photo" },
        target: "traitement",
      },
      {
        id: "a-f2",
        journeyId: "j-sexual",
        title: { fr: "Aucune action requise", en: "No action required" },
        desc: {
          fr: "Dr Antoine Lemoine examine actuellement votre dossier.",
          en: "Dr Antoine Lemoine is currently reviewing your file.",
        },
        priority: "info",
        cta: { fr: "Voir mon parcours", en: "View my journey" },
        target: "traitement",
      },
    ],
    messages: [
      {
        id: "m-f1",
        journeyId: "j-hair",
        author: "maan",
        authorName: "MAAN",
        body: {
          fr: "Votre traitement a été livré. Votre premier suivi arrive dans quelques semaines.",
          en: "Your treatment has been delivered. Your first follow-up is coming in a few weeks.",
        },
        at: "20 août 2026 • 11:15",
      },
      {
        id: "m-f2",
        journeyId: "j-sexual",
        author: "system",
        body: { fr: "Dossier transmis au médecin.", en: "File sent to the doctor." },
        at: "30 août 2026 • 09:06",
      },
    ],
    notifications: clone(baseNotifications),
  };
}
