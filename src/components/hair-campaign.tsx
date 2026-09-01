import { useI18n } from "@/lib/i18n";

export function HairCampaign() {
  const { t } = useI18n();

  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-6xl px-6 py-20 text-center lg:py-24">
        <h2 className="mx-auto max-w-[20ch] text-balance font-section text-3xl font-medium leading-[1.1] tracking-tight lg:text-5xl">
          {t("Et il existe des options.", "And there are options.")}
        </h2>
        <p className="mx-auto mt-4 max-w-[48ch] text-pretty text-muted">
          {t(
            "Découvrez les traitements disponibles avec MAAN.",
            "Discover the treatments available with MAAN.",
          )}
        </p>
      </div>
    </section>
  );
}
