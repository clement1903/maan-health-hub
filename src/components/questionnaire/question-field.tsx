import { useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { Check, Plus, X, Upload, Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";
import type { AnswerValue, Option, Question } from "@/lib/questionnaire/types";
import { bmi } from "@/lib/questionnaire/engine";
import { supabase } from "@/integrations/supabase/client";

type Props = {
  question: Question;
  value: AnswerValue | undefined;
  onChange: (value: AnswerValue) => void;
  /** Sélection immédiate → passage automatique à la suite. */
  onAdvance?: (() => void) | undefined;
  userId?: string | null | undefined;
};

const cardBase =
  "group w-full rounded-[18px] border border-border bg-card px-5 py-4 text-left transition-all duration-300 hover:border-clay/50 hover:shadow-[0_18px_50px_-32px_var(--foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60";

const cardActive = "border-clay bg-clay/8 shadow-[0_18px_50px_-32px_var(--foreground)]";

function OptionCard({
  option,
  selected,
  onSelect,
  role = "radio",
  tabIndex,
  cardRef,
}: {
  option: Option;
  selected: boolean;
  onSelect: () => void;
  role?: "radio" | "checkbox";
  tabIndex?: number | undefined;
  cardRef?: ((el: HTMLButtonElement | null) => void) | undefined;
}) {
  const [pop, setPop] = useState(false);
  const prevSelected = useRef(selected);
  if (prevSelected.current !== selected) {
    prevSelected.current = selected;
    if (selected) setPop(true);
  }
  return (
    <button
      type="button"
      role={role}
      aria-checked={selected}
      tabIndex={tabIndex}
      ref={cardRef}
      onClick={onSelect}
      onAnimationEnd={() => setPop(false)}
      className={cn(
        cardBase,
        "active:scale-[0.985]",
        pop && "animate-[select-pop_0.32s_var(--ease)]",
        selected && cardActive,
      )}
    >
      <span className="flex items-center justify-between gap-4">
        <span>
          <span className="block text-lg font-medium leading-snug">{option.label}</span>
          {option.description ? (
            <span className="mt-1 block text-sm text-muted">{option.description}</span>
          ) : null}
        </span>
        <span
          className={cn(
            "flex size-6 shrink-0 items-center justify-center rounded-full border border-border transition-all duration-200",
            selected && "scale-110 border-clay bg-clay text-primary-foreground",
          )}
        >
          <Check
            className={cn(
              "size-3.5 opacity-0 transition-all duration-200",
              selected && "scale-110 opacity-100",
            )}
          />
        </span>
      </span>
    </button>
  );
}

/**
 * Liste d'options accessible : radiogroup / group avec tabindex itinérant
 * et navigation flèches / Home / End. Sélection = highlight instantané.
 */
function OptionList({
  options,
  isSelected,
  onSelect,
  multi = false,
  labelledBy,
  gridClass = "grid gap-3",
}: {
  options: Option[];
  isSelected: (value: string) => boolean;
  onSelect: (option: Option) => void;
  multi?: boolean;
  labelledBy?: string | undefined;
  gridClass?: string;
}) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const selectedIdx = options.findIndex((o) => isSelected(o.value));

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const current = refs.current.findIndex((el) => el === document.activeElement);
    if (current === -1) return;
    let next: number | null = null;
    if (e.key === "ArrowDown" || e.key === "ArrowRight") next = (current + 1) % options.length;
    if (e.key === "ArrowUp" || e.key === "ArrowLeft")
      next = (current - 1 + options.length) % options.length;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = options.length - 1;
    if (next !== null) {
      e.preventDefault();
      refs.current[next]?.focus();
    }
  };

  return (
    <div
      role={multi ? "group" : "radiogroup"}
      aria-labelledby={labelledBy}
      className={gridClass}
      onKeyDown={onKeyDown}
    >
      {options.map((o, i) => {
        const selected = isSelected(o.value);
        const focusable = multi ? true : selectedIdx === -1 ? i === 0 : i === selectedIdx;
        return (
          <OptionCard
            key={o.value}
            option={o}
            selected={selected}
            role={multi ? "checkbox" : "radio"}
            tabIndex={focusable ? 0 : -1}
            cardRef={(el) => {
              refs.current[i] = el;
            }}
            onSelect={() => onSelect(o)}
          />
        );
      })}
    </div>
  );
}

function TextList({
  value,
  onChange,
  placeholder,
}: {
  value: string[];
  onChange: (v: string[]) => void;
  placeholder: string;
}) {
  const [draft, setDraft] = useState("");
  const add = () => {
    const v = draft.trim().slice(0, 200);
    if (!v) return;
    onChange([...value, v]);
    setDraft("");
  };
  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
          placeholder={placeholder}
          className="h-14 flex-1 rounded-[16px] border border-border bg-card px-5 text-lg outline-none transition focus:border-clay"
        />
        <button
          type="button"
          onClick={add}
          aria-label="Ajouter"
          className="flex size-14 items-center justify-center rounded-[16px] bg-clay text-primary-foreground transition hover:bg-clay-deep"
        >
          <Plus className="size-5" />
        </button>
      </div>
      <ul className="flex flex-wrap gap-2">
        {value.map((item, i) => (
          <li
            key={`${item}-${i}`}
            className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm"
          >
            {item}
            <button
              type="button"
              aria-label={`Retirer ${item}`}
              onClick={() => onChange(value.filter((_, idx) => idx !== i))}
              className="text-muted transition hover:text-clay"
            >
              <X className="size-3.5" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

const lifestyleBlocks: { key: string; label: string; options: Option[] }[] = [
  {
    key: "tabac",
    label: "Tabac",
    options: [
      { value: "non", label: "Non-fumeur" },
      { value: "occasionnel", label: "Occasionnel" },
      { value: "quotidien", label: "Quotidien" },
    ],
  },
  {
    key: "alcool",
    label: "Alcool",
    options: [
      { value: "jamais", label: "Jamais" },
      { value: "occasionnel", label: "Occasionnel" },
      { value: "regulier", label: "Régulier" },
    ],
  },
  {
    key: "activite",
    label: "Activité physique",
    options: [
      { value: "faible", label: "Faible" },
      { value: "moderee", label: "Modérée" },
      { value: "soutenue", label: "Soutenue" },
    ],
  },
  {
    key: "sommeil",
    label: "Sommeil",
    options: [
      { value: "bon", label: "Réparateur" },
      { value: "moyen", label: "Irrégulier" },
      { value: "difficile", label: "Difficile" },
    ],
  },
];

export function QuestionField({ question, value, onChange, onAdvance, userId }: Props) {
  const [uploading, setUploading] = useState(false);
  const advance = () => {
    if (onAdvance) window.setTimeout(onAdvance, 260);
  };

  switch (question.type) {
    case "boolean": {
      const v = value as string | undefined;
      return (
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { value: "oui", label: "Oui" },
            { value: "non", label: "Non" },
          ].map((o) => (
            <OptionCard
              key={o.value}
              option={o}
              selected={v === o.value}
              onSelect={() => {
                onChange(o.value);
                advance();
              }}
            />
          ))}
        </div>
      );
    }

    case "single": {
      const v = value as string | undefined;
      return (
        <div className="grid gap-3">
          {(question.options ?? []).map((o) => (
            <OptionCard
              key={o.value}
              option={o}
              selected={v === o.value}
              onSelect={() => {
                onChange(o.value);
                advance();
              }}
            />
          ))}
        </div>
      );
    }

    case "multi":
    case "symptoms":
    case "conditions": {
      const v = (value as string[] | undefined) ?? [];
      const toggle = (o: Option) => {
        if (o.exclusive) {
          onChange(v.includes(o.value) ? [] : [o.value]);
          return;
        }
        const cleaned = v.filter(
          (x) => !(question.options ?? []).find((opt) => opt.value === x)?.exclusive,
        );
        onChange(
          cleaned.includes(o.value) ? cleaned.filter((x) => x !== o.value) : [...cleaned, o.value],
        );
      };
      return (
        <div className="grid gap-3">
          {(question.options ?? []).map((o) => (
            <OptionCard key={o.value} option={o} selected={v.includes(o.value)} onSelect={() => toggle(o)} />
          ))}
        </div>
      );
    }

    case "number": {
      const v = value as number | undefined;
      return (
        <div className="space-y-4">
          <div className="flex items-baseline gap-3">
            <input
              type="number"
              inputMode="numeric"
              min={question.min}
              max={question.max}
              value={v ?? ""}
              onChange={(e) => onChange(e.target.value === "" ? null : Number(e.target.value))}
              className="h-20 w-40 rounded-[18px] border border-border bg-card px-5 font-display text-4xl outline-none transition focus:border-clay"
            />
            {question.unit ? <span className="text-xl text-muted">{question.unit}</span> : null}
          </div>
          {question.min !== undefined && question.max !== undefined ? (
            <input
              type="range"
              min={question.min}
              max={question.max}
              value={typeof v === "number" ? v : question.min}
              onChange={(e) => onChange(Number(e.target.value))}
              className="w-full accent-[var(--clay)]"
              aria-label={question.title}
            />
          ) : null}
        </div>
      );
    }

    case "body": {
      const v = (value as Record<string, number> | undefined) ?? {};
      const imc = bmi(v['height'], v['weight']);
      return (
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { key: "height", label: "Taille", unit: "cm" },
              { key: "weight", label: "Poids", unit: "kg" },
            ].map((f) => (
              <label key={f.key} className="rounded-[18px] border border-border bg-card px-5 py-4">
                <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
                  {f.label}
                </span>
                <span className="mt-2 flex items-baseline gap-2">
                  <input
                    type="number"
                    inputMode="numeric"
                    value={v[f.key] ?? ""}
                    onChange={(e) =>
                      onChange({ ...v, [f.key]: e.target.value === "" ? null : Number(e.target.value) })
                    }
                    className="w-full bg-transparent font-display text-3xl outline-none"
                  />
                  <span className="text-muted">{f.unit}</span>
                </span>
              </label>
            ))}
          </div>
          {imc ? (
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
              Indice de masse corporelle indicatif : {imc}
            </p>
          ) : null}
        </div>
      );
    }

    case "date":
      return (
        <input
          type="date"
          value={(value as string | undefined) ?? ""}
          onChange={(e) => onChange(e.target.value)}
          className="h-16 w-full max-w-sm rounded-[18px] border border-border bg-card px-5 text-xl outline-none transition focus:border-clay"
        />
      );

    case "medications":
      return (
        <TextList
          value={(value as string[] | undefined) ?? []}
          onChange={onChange}
          placeholder="Ex. Ramipril 5 mg, 1/jour"
        />
      );

    case "allergies":
      return (
        <TextList
          value={(value as string[] | undefined) ?? []}
          onChange={onChange}
          placeholder="Ex. Pénicilline"
        />
      );

    case "previous_treatments":
      return (
        <TextList
          value={(value as string[] | undefined) ?? []}
          onChange={onChange}
          placeholder="Ex. Minoxidil 6 mois, peu d'effet"
        />
      );

    case "lifestyle": {
      const v = (value as Record<string, string> | undefined) ?? {};
      return (
        <div className="space-y-6">
          {lifestyleBlocks.map((block) => (
            <div key={block.key}>
              <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
                {block.label}
              </p>
              <div className="grid gap-2 sm:grid-cols-3">
                {block.options.map((o) => (
                  <OptionCard
                    key={o.value}
                    option={o}
                    selected={v[block.key] === o.value}
                    onSelect={() => onChange({ ...v, [block.key]: o.value })}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      );
    }

    case "file": {
      const files = (value as { name: string; path: string }[] | undefined) ?? [];
      const onFiles = async (list: FileList | null) => {
        if (!list || !userId) return;
        setUploading(true);
        const next = [...files];
        for (const file of Array.from(list).slice(0, 5)) {
          const path = `${userId}/${Date.now()}-${file.name.replace(/[^\w.\-]/g, "_")}`;
          const { error } = await supabase.storage.from("questionnaire-uploads").upload(path, file);
          if (!error) next.push({ name: file.name, path });
        }
        onChange(next);
        setUploading(false);
      };
      return (
        <div className="space-y-3">
          <label className={cn(cardBase, "flex cursor-pointer items-center gap-3")}>
            {uploading ? <Loader2 className="size-5 animate-spin" /> : <Upload className="size-5" />}
            <span className="text-lg">
              {uploading ? "Envoi en cours…" : "Choisir un fichier ou une photo"}
            </span>
            <input
              type="file"
              className="sr-only"
              multiple={question.multiple}
              accept="image/*,application/pdf"
              onChange={(e) => void onFiles(e.target.files)}
            />
          </label>
          <ul className="space-y-2">
            {files.map((f, i) => (
              <li
                key={f.path}
                className="flex items-center justify-between rounded-[14px] border border-border bg-card px-4 py-3 text-sm"
              >
                {f.name}
                <button
                  type="button"
                  onClick={() => onChange(files.filter((_, idx) => idx !== i))}
                  className="text-muted transition hover:text-clay"
                  aria-label={`Retirer ${f.name}`}
                >
                  <X className="size-4" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      );
    }

    case "text":
    default:
      return (
        <textarea
          value={(value as string | undefined) ?? ""}
          maxLength={question.maxLength ?? 1000}
          onChange={(e) => onChange(e.target.value)}
          placeholder={question.placeholder}
          rows={4}
          className="w-full rounded-[18px] border border-border bg-card px-5 py-4 text-lg leading-relaxed outline-none transition focus:border-clay"
        />
      );
  }
}
