import { createFileRoute, notFound } from "@tanstack/react-router";

import { getDomaine } from "@/data/soins";
import { buildDomaineHead } from "@/lib/seo";
import { DomaineView } from "./soins.$domaine";

export const Route = createFileRoute("/soins/$domaine_/$produit")({
  loader: ({ params }) => {
    const domaine = getDomaine(params.domaine);
    if (!domaine) throw notFound();
    const produit = domaine.produits.find((p) => p.id === params.produit);
    if (!produit) throw notFound();
    return { slug: domaine.slug, produitId: produit.id };
  },
  head: ({ params, loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Traitement introuvable — MAAN" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    return buildDomaineHead(params.domaine, params.produit);
  },
  component: ProduitPage,
});

function ProduitPage() {
  const { slug, produitId } = Route.useLoaderData();
  return <DomaineView slug={slug} produitId={produitId} />;
}
