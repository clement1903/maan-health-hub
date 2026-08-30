export const DOSSIERS_BASE_COUNT = 15000;

/**
 * Nombre réel de dossiers accompagnés (questionnaires soumis).
 * Utilise le client admin côté serveur uniquement pour un comptage agrégé,
 * sans jamais exposer de données personnelles.
 */
export async function countAccompaniedCases(): Promise<number> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { count, error } = await supabaseAdmin
    .from("questionnaires")
    .select("id", { count: "exact", head: true });
  if (error) {
    console.error("countAccompaniedCases", error.message);
    return 0;
  }
  return count ?? 0;
}
