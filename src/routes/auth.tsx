import { useEffect, useState } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { z } from "zod";

import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useAuth } from "@/hooks/use-auth";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { cn } from "@/lib/utils";

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
      setError(parsed.error.issues[0]?.message ?? "Champs invalides");
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
        setNotice("Compte créé. Vérifiez votre boîte mail si une confirmation est demandée.");
      } else {
        const { error: err } = await supabase.auth.signInWithPassword({
          email: parsed.data.email,
          password: parsed.data.password,
        });
        if (err) throw err;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
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
      setError("La connexion Google a échoué. Réessayez.");
      return;
    }
    if (result.redirected) return;
    navigate({ to: "/espace-patient" });
  }

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans text-foreground antialiased">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-6 py-16">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-clay">Espace patient</p>
        <h1 className="mt-3 font-display text-3xl font-medium tracking-tight">
          {mode === "signin" ? "Se connecter" : "Créer un compte"}
        </h1>
        <p className="mt-2 text-pretty text-sm text-muted">
          Votre espace regroupe votre questionnaire, l'avis du médecin et le suivi de votre
          commande.
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
              {m === "signin" ? "Connexion" : "Inscription"}
            </button>
          ))}
        </div>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          {mode === "signup" && (
            <Field
              label="Nom complet"
              value={fullName}
              onChange={setFullName}
              type="text"
              autoComplete="name"
            />
          )}
          <Field
            label="E-mail"
            value={email}
            onChange={setEmail}
            type="email"
            autoComplete="email"
          />
          <Field
            label="Mot de passe"
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
            {busy ? "Un instant…" : mode === "signin" ? "Se connecter" : "Créer mon compte"}
          </button>
        </form>

        <div className="my-6 flex items-center gap-4 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
          <span className="h-px flex-1 bg-border" /> ou <span className="h-px flex-1 bg-border" />
        </div>

        <button
          type="button"
          onClick={onGoogle}
          className="w-full rounded-full border border-border bg-cream py-3.5 text-sm font-medium transition-all duration-300 hover:border-clay/40"
        >
          Continuer avec Google
        </button>

        <p className="mt-8 text-center text-xs text-muted">
          En continuant, vous acceptez le traitement confidentiel de vos données de santé décrit
          dans la{" "}
          <Link to="/conformite" className="underline decoration-clay/50 underline-offset-4">
            page conformité
          </Link>
          .
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
  return (
    <label className="block">
      <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">{label}</span>
      <input
        type={type}
        value={value}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        maxLength={255}
        className="mt-2 w-full rounded-xl border border-border bg-cream px-4 py-3 text-sm outline-none transition-colors focus:border-clay"
      />
    </label>
  );
}
