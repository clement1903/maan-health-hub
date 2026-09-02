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

const langs: { code: Lang; short: string; label: string; Flag: typeof FlagFR }[] = [
  { code: "fr", short: "FR", label: "Français", Flag: FlagFR },
  { code: "en", short: "EN", label: "English", Flag: FlagEN },
];

export function LanguageSwitcher({ className }: { className?: string }) {
  const { lang, setLang } = useI18n();

  return (
    <div
      className={cn("flex items-center gap-2", className)}
      role="group"
      aria-label={lang === "en" ? "Choose language" : "Choisir la langue"}
    >
      {langs.map(({ code, short, label, Flag }) => (
        <button
          key={code}
          type="button"
          onClick={() => setLang(code)}
          aria-pressed={lang === code}
          title={label}
          className={cn(
            "flex cursor-pointer items-center gap-2 rounded-xl px-2.5 py-1.5 transition-all duration-300",
            lang === code
              ? "border border-border bg-cream/60 shadow-sm"
              : "border border-transparent opacity-50 hover:opacity-100",
          )}
        >
          <Flag className="h-5 w-5 rounded-full object-cover ring-1 ring-foreground/10" />
          <span className="text-xs font-semibold tracking-wide">{short}</span>
          <span className="sr-only">{label}</span>
        </button>
      ))}
    </div>
  );
}
