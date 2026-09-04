import { Reveal } from "@/components/reveal";
import { useI18n } from "@/lib/i18n";

export function Manifeste() {
  const { t } = useI18n();

  return (
    <section className="relative overflow-hidden bg-espresso py-20 text-espresso-foreground lg:py-28">
      {/* Halo terracotta */}
      <div className="pointer-events-none absolute -left-32 top-1/2 h-[28rem] w-[28rem] -translate-y-1/2 rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--clay)_22%,transparent),transparent_65%)] blur-2xl" />
      <div className="pointer-events-none absolute -right-40 bottom-0 h-[24rem] w-[24rem] rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--amber)_14%,transparent),transparent_65%)] blur-2xl" />

      <div className="relative mx-auto max-w-5xl px-6">
        <Reveal>
          <h2 className="max-w-[18ch] text-balance font-display text-5xl font-medium leading-[0.95] tracking-tight text-cream sm:text-6xl lg:text-7xl">
            {t("RIEN À SIGNALER.", "NOTHING TO REPORT.")}
          </h2>
        </Reveal>
      </div>
    </section>
  );
}
