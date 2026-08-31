import { useState } from "react";

import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { usePatient } from "@/lib/patient/store";
import { tr, type Message } from "@/lib/patient/types";
import { ClayButton, EmptyState } from "./ui";

function AuthorTag({ message }: { message: Message }) {
  const { t } = useI18n();
  if (message.author === "doctor")
    return (
      <span className="rounded-full bg-clay px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.14em] text-cream">
        {t("Médecin", "Doctor")}
      </span>
    );
  if (message.author === "maan")
    return (
      <span className="rounded-full bg-sand px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.14em] text-foreground/75">
        MAAN
      </span>
    );
  if (message.author === "system")
    return (
      <span className="rounded-full border border-border px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.14em] text-muted">
        {t("Message automatique", "Automatic message")}
      </span>
    );
  return (
    <span className="rounded-full border border-clay/40 px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.14em] text-clay">
      {t("Vous", "You")}
    </span>
  );
}

function InfoRequestBlock({ message }: { message: Message }) {
  const { lang, t } = useI18n();
  const { answerInfoRequest } = usePatient();
  const [choice, setChoice] = useState<string | null>(null);
  const req = message.request;
  if (!req) return null;

  if (req.answer) {
    return (
      <p className="mt-4 flex items-center gap-2 rounded-[14px] bg-sand px-4 py-3 text-sm text-foreground/80">
        <span className="grid h-4 w-4 place-items-center rounded-full bg-clay text-[9px] text-cream">✓</span>
        {t("Information envoyée au médecin", "Information sent to the doctor")} · {req.answer}
      </p>
    );
  }

  return (
    <div className="mt-4 rounded-[16px] border border-clay/30 bg-background p-4">
      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-clay">
        {t("Information requise", "Information required")}
      </p>
      <p className="mt-2 text-[15px]">{tr(req.question, lang)}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {req.options.map((o) => {
          const label = tr(o, lang);
          return (
            <button
              key={label}
              type="button"
              onClick={() => setChoice(label)}
              className={cn(
                "min-h-11 rounded-full border px-5 text-sm transition-all duration-300 active:scale-[0.98]",
                choice === label
                  ? "border-clay bg-clay text-cream"
                  : "border-border bg-cream text-foreground hover:border-clay",
              )}
            >
              {label}
            </button>
          );
        })}
      </div>
      <div className="mt-4">
        <ClayButton disabled={!choice} onClick={() => choice && answerInfoRequest(message.id, choice)}>
          {t("Envoyer", "Send")}
        </ClayButton>
      </div>
    </div>
  );
}

export function SecureMessages({ journeyId }: { journeyId?: string }) {
  const { lang, t } = useI18n();
  const { data, sendPatientMessage } = usePatient();
  const [draft, setDraft] = useState("");

  const messages = data.messages
    .filter((m) => !journeyId || m.journeyId === journeyId)
    .slice()
    .reverse();

  const defaultJourney = journeyId ?? data.journeys[0]?.id ?? "";

  return (
    <div className="space-y-6">
      {messages.length === 0 ? (
        <EmptyState
          title={t("Aucun message", "No messages")}
          desc={t(
            "Vos échanges avec votre médecin et MAAN apparaîtront ici, de façon sécurisée.",
            "Your exchanges with your doctor and MAAN will appear here, securely.",
          )}
        />
      ) : (
        <ul className="space-y-4">
          {messages.map((m) => (
            <li
              key={m.id}
              className={cn(
                "rounded-[20px] border p-5 transition-all duration-500 ease-[var(--ease)]",
                m.author === "patient"
                  ? "ml-auto max-w-[92%] border-clay/25 bg-background"
                  : m.author === "system"
                    ? "border-border bg-background/70"
                    : "border-border bg-cream",
              )}
            >
              <div className="flex flex-wrap items-center gap-3">
                <AuthorTag message={m} />
                {m.authorName ? (
                  <span className="font-section text-sm tracking-tight">{m.authorName}</span>
                ) : null}
                <span className="ml-auto font-mono text-[10px] text-muted">{m.at}</span>
              </div>
              <p className="mt-3 text-pretty text-[15px] leading-relaxed">{tr(m.body, lang)}</p>
              <InfoRequestBlock message={m} />
            </li>
          ))}
        </ul>
      )}

      <form
        className="rounded-[20px] border border-border bg-cream p-4"
        onSubmit={(e) => {
          e.preventDefault();
          if (!draft.trim() || !defaultJourney) return;
          sendPatientMessage(defaultJourney, draft.trim());
          setDraft("");
        }}
      >
        <label htmlFor="msg" className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
          {t("Écrire à votre médecin", "Write to your doctor")}
        </label>
        <textarea
          id="msg"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          rows={3}
          placeholder={t("Votre message…", "Your message…")}
          className="mt-2 w-full resize-none rounded-[14px] border border-border bg-background px-4 py-3 text-[15px] outline-none transition-colors focus:border-clay"
        />
        <div className="mt-3 flex items-center justify-between gap-3">
          <p className="text-[11px] text-muted">
            {t(
              "Messagerie sécurisée. Ne remplace pas une urgence médicale.",
              "Secure messaging. Not a substitute for emergency care.",
            )}
          </p>
          <ClayButton type="submit" disabled={!draft.trim()}>
            {t("Envoyer", "Send")}
          </ClayButton>
        </div>
      </form>
    </div>
  );
}
