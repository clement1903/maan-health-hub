import { createServerFn } from "@tanstack/react-start";
import { countAccompaniedCases, DOSSIERS_BASE_COUNT } from "./stats.server";

export const getDossiersAccompagnes = createServerFn({ method: "GET" }).handler(
  async (): Promise<number> => {
    const real = await countAccompaniedCases();
    return DOSSIERS_BASE_COUNT + real;
  },
);
