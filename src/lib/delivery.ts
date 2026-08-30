export type DeliveryOption = {
  key: string;
  label: string;
  desc: string;
  minDays: number;
  maxDays: number;
  priceCents: number;
};

export const deliveryOptions: DeliveryOption[] = [
  {
    key: "standard",
    label: "Livraison à domicile — standard",
    desc: "Colis neutre, sans mention du traitement, remis en boîte aux lettres ou en main propre.",
    minDays: 2,
    maxDays: 4,
    priceCents: 0,
  },
  {
    key: "express",
    label: "Livraison à domicile — express",
    desc: "Expédition prioritaire dès la préparation en pharmacie partenaire.",
    minDays: 1,
    maxDays: 2,
    priceCents: 690,
  },
  {
    key: "point_relais",
    label: "Point relais",
    desc: "Retrait discret dans le point relais de votre choix, sous votre nom.",
    minDays: 2,
    maxDays: 5,
    priceCents: 0,
  },
];

export const paymentStatusLabels: Record<string, string> = {
  non_paye: "Paiement en attente",
  autorise: "Paiement autorisé",
  paye: "Payé",
  rembourse: "Remboursé",
};

export function findDeliveryOption(key: string | null | undefined) {
  return deliveryOptions.find((o) => o.key === key) ?? deliveryOptions[0]!;
}

export function formatPrice(cents: number) {
  return (cents / 100).toLocaleString("fr-FR", { style: "currency", currency: "EUR" });
}

/** Estimation de réception à partir de la date d'expédition prévue. */
export function estimateWindow(option: DeliveryOption, from: Date = new Date()) {
  const add = (days: number) => {
    const d = new Date(from);
    d.setDate(d.getDate() + days);
    return d.toLocaleDateString("fr-FR", { weekday: "long", day: "2-digit", month: "long" });
  };
  return { min: add(option.minDays), max: add(option.maxDays) };
}
