import { getDomaine } from "@/data/soins";

type HeadResult = {
  meta: Array<Record<string, string>>;
  links: Array<{ rel: string; href: string }>;
  scripts: Array<{ type: string; children: string }>;
};

/** URL canonique d'une page domaine ou d'une page produit. */
export function domaineUrl(domaineSlug: string, produitId?: string | null) {
  return produitId ? `/soins/${domaineSlug}/${produitId}` : `/soins/${domaineSlug}`;
}

/**
 * Construit les balises SEO (titre, description, Open Graph, JSON-LD) d'une page
 * spécialité ou d'une page produit. Les URLs sont relatives : elles se résolvent
 * sur le domaine servant la page.
 */
export function buildDomaineHead(domaineSlug: string, produitId?: string | null): HeadResult {
  const d = getDomaine(domaineSlug);
  if (!d) {
    return {
      meta: [{ title: "Page introuvable — MAAN" }, { name: "robots", content: "noindex" }],
      links: [],
      scripts: [],
    };
  }
  const p = produitId ? (d.produits.find((x) => x.id === produitId) ?? null) : null;
  const url = domaineUrl(d.slug, p?.id);

  const title = p
    ? `${p.nom} ${p.molecule} en ligne sur ordonnance — ${d.titre} | MAAN`
    : `${d.titre} chez l'homme : traitement en ligne sur ordonnance | MAAN`;

  const description = p
    ? `${p.nom} (${p.molecule}), ${p.forme.toLowerCase()} : mode d'action, posologie, précautions et prix. Consultation médicale en ligne, traitement livré à domicile s'il vous est prescrit.`
    : `${d.chapo} Questionnaire médical en ligne, évaluation par un médecin et traitement livré discrètement à domicile lorsqu'il est prescrit.`;

  const keywords = p
    ? [p.nom, p.molecule, `${p.molecule} en ligne`, `${p.nom} ordonnance`, `acheter ${p.nom} en ligne`, d.titre]
    : [
        d.titre,
        `${d.titre} homme`,
        `traitement ${d.titre.toLowerCase()}`,
        `${d.titre.toLowerCase()} en ligne`,
        "consultation médicale en ligne",
        "ordonnance en ligne",
        ...d.produits.flatMap((x) => [x.nom, x.molecule]),
      ];

  const scripts: HeadResult["scripts"] = [
    {
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "MAAN", item: "/" },
          { "@type": "ListItem", position: 2, name: d.titre, item: domaineUrl(d.slug) },
          ...(p ? [{ "@type": "ListItem", position: 3, name: p.nom, item: url }] : []),
        ],
      }),
    },
  ];

  if (p) {
    scripts.push({
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Drug",
        name: p.nom,
        activeIngredient: p.molecule,
        dosageForm: p.forme,
        prescriptionStatus: "https://schema.org/PrescriptionOnly",
        description: p.modeAction,
        warning: p.precautions,
        url,
      }),
    });
  } else {
    scripts.push(
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "MedicalWebPage",
          name: title,
          description,
          url,
          about: { "@type": "MedicalCondition", name: d.titre },
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: `Traitements — ${d.titre}`,
          itemListElement: d.produits.map((x, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: `${x.nom} (${x.molecule})`,
            url: domaineUrl(d.slug, x.id),
          })),
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: d.faq.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.r },
          })),
        }),
      },
    );
  }

  return {
    meta: [
      { title },
      { name: "description", content: description },
      { name: "keywords", content: keywords.join(", ") },
      { property: "og:type", content: p ? "product" : "article" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: url },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
    ],
    links: [{ rel: "canonical", href: url }],
    scripts,
  };
}
