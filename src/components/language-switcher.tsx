import { useI18n, type Lang } from "@/lib/i18n";
import { cn } from "@/lib/utils";

function FlagFR({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 3 2" className={className} aria-hidden="true">
      <rect width="1" height="2" x="0" fill="#0055A4" />
      <rect width="1" height="2" x="1" fill="#FFFFFF" />
      <rect width="1" height="2" x="2" fill="#EF4135" />
    </svg>
  );
}

function FlagEN({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 30" className={className} aria-hidden="true">
      <rect width="60" height="30" fill="#012169" />
      <path d="M0,0 60,30 M60,0 0,30" stroke="#FFFFFF" strokeWidth="6" />
      <path d="M0,0 60,30 M60,0 0,30" stroke="#C8102E" strokeWidth="4" />
      <path d="M30,0 V30 M0,15 H60" stroke="#FFFFFF" strokeWidth="10" />
      <path d="M30,0 V30 M0,15 H60" stroke="#C8102E" strokeWidth="6" />
    </svg>
  );
}

const langs: { code: Lang; label: string; Flag: typeof FlagFR }[] = [
  { code: "fr", label: "Français", Flag: FlagFR },
  { code: "en", label: "English", Flag: FlagEN },
];

export function LanguageSwitcher({ className }: { className?: string }) {
  const { lang, setLang } = useI18n();

  return (
    <div
      className={cn("flex items-center gap-1", className)}
      role="group"
      aria-label={lang === "en" ? "Choose language" : "Choisir la langue"}
    >
      {langs.map(({ code, label, Flag }) => (
        <button
          key={code}
          type="button"
          onClick={() => setLang(code)}
          aria-pressed={lang === code}
          title={label}
          className={cn(
            "cursor-pointer rounded-[3px] p-[3px] transition-all duration-300 hover:opacity-100",
            lang === code
              ? "opacity-100 ring-1 ring-clay/50"
              : "opacity-40 hover:scale-105",
          )}
        >
          <Flag className="h-3 w-[18px] rounded-[2px] object-cover" />
          <span className="sr-only">{label}</span>
        </button>
      ))}
    </div>
  );
}
