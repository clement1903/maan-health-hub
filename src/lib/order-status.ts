export const orderSteps = [
  {
    key: "en_attente_validation",
    label: "Questionnaire reçu",
    desc: "Votre dossier est transmis au médecin.",
  },
  {
    key: "prescription_validee",
    label: "Prescription validée",
    desc: "Le médecin a délivré votre ordonnance.",
  },
  {
    key: "en_preparation",
    label: "Préparation en pharmacie",
    desc: "La pharmacie partenaire prépare votre traitement.",
  },
  { key: "expedie", label: "Expédiée", desc: "Colis neutre remis au transporteur." },
  { key: "livre", label: "Livrée", desc: "Votre traitement est arrivé." },
] as const;

export const orderStatusLabels: Record<string, string> = {
  en_attente_validation: "En attente de validation médicale",
  prescription_validee: "Prescription validée",
  en_preparation: "En préparation en pharmacie",
  expedie: "Expédiée",
  livre: "Livrée",
  refuse: "Demande non retenue",
};

export const questionnaireStatusLabels: Record<string, string> = {
  soumis: "Questionnaire soumis",
  en_revue: "En revue médicale",
  prescrit: "Prescription délivrée",
  refuse: "Non éligible",
};

export function stepIndexFor(status: string) {
  return orderSteps.findIndex((s) => s.key === status);
}
