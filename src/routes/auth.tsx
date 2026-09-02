import { useEffect, useState } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { z } from "zod";

import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useAuth } from "@/hooks/use-auth";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Connexion — MAAN, des soins pensés pour les hommes" },
      {
        name: "description",
        content:
          "Connectez-vous à votre espace patient MAAN pour remplir votre questionnaire médical et suivre votre commande.",
      },
      { property: "og:title", content: "Connexion — MAAN, des soins pensés pour les hommes" },
      {
        property: "og:description",
        content: "Accédez à votre espace patient MAAN : questionnaire, prescription, livraison.",
      },
      { property: "og:url", content: "/auth" },
      { name: "twitter:title", content: "Connexion — MAAN" },
      {
        name: "twitter:description",
        content: "Accédez à votre espace patient MAAN : questionnaire, prescription, livraison.",
      },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: "/auth" }],
  }),
  component: AuthPage,
});

const credentials = z.object({
  email: z.string().trim().email({ message: "Adresse e-mail invalide" }).max(255),
  password: z.string().min(8, { message: "8 caractères minimum" }).max(72),
  fullName: z.string().trim().max(100).optional(),
});

function AuthPage() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && user) navigate({ to: "/espace-patient" });
  }, [loading, user, navigate]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setNotice(null);

    const parsed = credentials.safeParse({ email, password, fullName });
    if (!parsed.success) {
      const issue = parsed.error.issues[0]?.message;
      if (issue === "Adresse e-mail invalide") {
        setError(t("Adresse e-mail invalide", "Invalid email address"));
      } else if (issue === "8 caractères minimum") {
        setError(t("8 caractères minimum", "8 characters minimum"));
      } else {
        setError(t("Champs invalides", "Invalid fields"));
      }
      return;
    }

    setBusy(true);
    try {
      if (mode === "signup") {
        const { error: err } = await supabase.auth.signUp({
          email: parsed.data.email,
          password: parsed.data.password,
          options: {
            emailRedirectTo: `${window.location.origin}/espace-patient`,
            data: { full_name: parsed.data.fullName || null },
          },
        });
        if (err) throw err;
        setNotice(
          t(
            "Compte créé. Vérifiez votre boîte mail si une confirmation est demandée.",
            "Account created. Check your inbox if a confirmation is required.",
          ),
        );
      } else {
        const { error: err } = await supabase.auth.signInWithPassword({
          email: parsed.data.email,
          password: parsed.data.password,
        });
        if (err) throw err;
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : t("Une erreur est survenue", "An error occurred"),
      );
    } finally {
      setBusy(false);
    }
  }

  async function onGoogle() {
    setError(null);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      setError(t("La connexion Google a échoué. Réessayez.", "Google sign-in failed. Please try again."));
      return;
    }
    if (result.redirected) return;
    navigate({ to: "/espace-patient" });
  }

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans text-foreground antialiased">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-6 py-16">
        <h1 className="font-display text-3xl font-medium tracking-tight">
          {mode === "signin" ? t("Se connecter", "Sign in") : t("Créer un compte", "Create an account")}
        </h1>
        <p className="mt-2 text-pretty text-sm text-muted">
          {t(
            "Votre espace regroupe votre questionnaire, l'avis du médecin et le suivi de votre commande.",
            "Your space brings together your questionnaire, the doctor's assessment, and your order tracking.",
          )}
        </p>

        <div className="mt-8 flex rounded-full border border-border p-1 font-mono text-[11px] uppercase tracking-[0.14em]">
          {(["signin", "signup"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={cn(
                "flex-1 rounded-full py-2 transition-all duration-400 ease-[var(--ease)]",
                mode === m ? "bg-clay text-cream" : "text-muted hover:text-foreground",
              )}
            >
              {m === "signin" ? t("Connexion", "Sign in") : t("Inscription", "Sign up")}
            </button>
          ))}
        </div>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          {mode === "signup" && (
            <Field
              label={t("Nom complet", "Full name")}
              value={fullName}
              onChange={setFullName}
              type="text"
              autoComplete="name"
            />
          )}
          <Field
            label={t("E-mail", "Email")}
            value={email}
            onChange={setEmail}
            type="email"
            autoComplete="email"
          />
          <Field
            label={t("Mot de passe", "Password")}
            value={password}
            onChange={setPassword}
            type="password"
            autoComplete={mode === "signin" ? "current-password" : "new-password"}
          />

          {error && <p className="text-sm text-clay">{error}</p>}
          {notice && <p className="text-sm text-muted">{notice}</p>}

          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-full bg-clay py-3.5 text-sm font-medium text-cream transition-all duration-300 hover:bg-clay-deep disabled:opacity-60"
          >
            {busy
              ? t("Un instant…", "One moment…")
              : mode === "signin"
                ? t("Se connecter", "Sign in")
                : t("Créer mon compte", "Create my account")}
          </button>
        </form>

        <div className="my-6 flex items-center gap-4 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
          <span className="h-px flex-1 bg-border" /> {t("ou", "or")}{" "}
          <span className="h-px flex-1 bg-border" />
        </div>

        <button
          type="button"
          onClick={onGoogle}
          className="w-full rounded-full border border-border bg-cream py-3.5 text-sm font-medium transition-all duration-300 hover:border-clay/40"
        >
          {t("Continuer avec Google", "Continue with Google")}
        </button>

        <p className="mt-8 text-center text-xs text-muted">
          {t(
            "En continuant, vous acceptez le traitement confidentiel de vos données de santé par MAAN.",
            "By continuing, you accept the confidential handling of your health data by MAAN.",
          )}
        </p>
      </main>
      <SiteFooter />
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type,
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type: string;
  autoComplete?: string;
}) {
  const { t } = useI18n();
  const isPassword = type === "password";
  const [visible, setVisible] = useState(false);
  const inputType = isPassword && visible ? "text" : type;

  return (
    <label className="block">
      <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">{label}</span>
      <div className="relative mt-2">
        <input
          type={inputType}
          value={value}
          autoComplete={autoComplete}
          onChange={(e) => onChange(e.target.value)}
          maxLength={255}
          className={cn(
            "w-full rounded-xl border border-border bg-cream px-4 py-3 text-sm outline-none transition-colors focus:border-clay",
            isPassword && "pr-12",
          )}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            aria-label={
              visible
                ? t("Masquer le mot de passe", "Hide password")
                : t("Afficher le mot de passe", "Show password")
            }
            aria-pressed={visible}
            className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-muted transition-colors hover:text-clay"
          >
            {visible ? (
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M3 3l18 18" />
                <path d="M10.6 10.6a2 2 0 002.8 2.8" />
                <path d="M9.4 5.2A9.5 9.5 0 0112 5c5 0 9 4.5 9 7 0 .9-.6 2.1-1.6 3.3M6.3 6.9C3.9 8.4 3 10.4 3 12c0 2.5 4 7 9 7 1.6 0 3-.4 4.2-1" />
              </svg>
            ) : (
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M3 12s3.6-7 9-7 9 7 9 7-3.6 7-9 7-9-7-9-7z" />
                <circle cx="12" cy="12" r="2.6" />
              </svg>
            )}
          </button>
        )}
      </div>
    </label>
  );
}
