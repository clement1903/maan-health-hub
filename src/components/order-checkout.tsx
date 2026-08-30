import { useEffect, useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import {
  deliveryOptions,
  estimateWindow,
  findDeliveryOption,
  formatPrice,
  paymentStatusLabels,
} from "@/lib/delivery";

export type CheckoutOrder = {
  id: string;
  reference: string;
  treatment: string;
  status: string;
  delivery_method: string | null;
  delivery_address: { line1?: string; postal?: string; city?: string; note?: string } | null;
  delivery_eta_min_days: number | null;
  delivery_eta_max_days: number | null;
  payment_status: string;
  amount_cents: number;
  paid_at: string | null;
};

const CONSULTATION_CENTS = 0;

export function OrderCheckout({
  order,
  userId,
}: {
  order: CheckoutOrder;
  userId: string;
}) {
  const qc = useQueryClient();
  const [method, setMethod] = useState(order.delivery_method ?? "standard");
  const [line1, setLine1] = useState(order.delivery_address?.line1 ?? "");
  const [postal, setPostal] = useState(order.delivery_address?.postal ?? "");
  const [city, setCity] = useState(order.delivery_address?.city ?? "");
  const [note, setNote] = useState(order.delivery_address?.note ?? "");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMethod(order.delivery_method ?? "standard");
  }, [order.delivery_method]);

  const option = useMemo(() => findDeliveryOption(method), [method]);
  const window_ = useMemo(() => estimateWindow(option), [option]);
  const total = CONSULTATION_CENTS + option.priceCents;
  const paid = order.payment_status === "paye";

  const save = useMutation({
    mutationFn: async (payload: { pay: boolean }) => {
      if (!line1.trim() || !postal.trim() || !city.trim()) {
        throw new Error("Adresse incomplète : rue, code postal et ville sont nécessaires.");
      }
      if (line1.length > 200 || city.length > 120 || note.length > 300) {
        throw new Error("Adresse trop longue.");
      }
      const { error: err } = await supabase
        .from("orders")
        .update({
          delivery_method: option.key,
          delivery_address: {
            line1: line1.trim(),
            postal: postal.trim(),
            city: city.trim(),
            note: note.trim(),
          },
          delivery_eta_min_days: option.minDays,
          delivery_eta_max_days: option.maxDays,
          amount_cents: total,
          ...(payload.pay
            ? {
                payment_status: total === 0 ? "paye" : "autorise",
                paid_at: new Date().toISOString(),
              }
            : {}),
        })
        .eq("id", order.id)
        .eq("user_id", userId);
      if (err) throw err;

      if (payload.pay) {
        await supabase.from("order_events").insert({
          order_id: order.id,
          user_id: userId,
          label: "Commande finalisée",
          detail: `${option.label} — réception estimée entre le ${window_.min} et le ${window_.max}.`,
        });
      }
    },
    onSuccess: () => {
      setError(null);
      qc.invalidateQueries({ queryKey: ["orders", userId] });
      qc.invalidateQueries({ queryKey: ["order_events", userId] });
    },
    onError: (e: Error) => setError(e.message),
  });

  return (
    <section className="mt-6 rounded-[20px] border border-border bg-background p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h4 className="font-section text-lg font-medium tracking-tight">
          Livraison &amp; finalisation
        </h4>
        <span className="rounded-full border border-clay/30 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-clay">
          {paymentStatusLabels[order.payment_status] ?? order.payment_status}
        </span>
      </div>

      <fieldset className="mt-5" disabled={paid}>
        <legend className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
          Mode de livraison
        </legend>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          {deliveryOptions.map((o) => {
            const active = o.key === method;
            return (
              <button
                key={o.key}
                type="button"
                onClick={() => setMethod(o.key)}
                aria-pressed={active}
                className={cn(
                  "rounded-2xl border p-4 text-left transition-all duration-300 ease-[var(--ease)]",
                  active
                    ? "border-clay bg-clay/[0.06] shadow-[0_0_0_3px_color-mix(in_oklab,var(--color-clay)_12%,transparent)]"
                    : "border-border hover:border-clay/40",
                )}
              >
                <p className="text-sm font-medium">{o.label}</p>
                <p className="mt-1 text-xs text-muted">{o.desc}</p>
                <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.12em] text-clay">
                  {o.minDays}–{o.maxDays} jours ouvrés ·{" "}
                  {o.priceCents === 0 ? "Offerte" : formatPrice(o.priceCents)}
                </p>
              </button>
            );
          })}
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <label className="text-sm">
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
              Adresse
            </span>
            <input
              value={line1}
              maxLength={200}
              onChange={(e) => setLine1(e.target.value)}
              placeholder="12 rue des Lilas, apt. 3"
              className="mt-1.5 w-full rounded-xl border border-border bg-cream px-3 py-2.5 text-sm outline-none focus-visible:border-clay"
            />
          </label>
          <label className="text-sm">
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
              Code postal
            </span>
            <input
              value={postal}
              maxLength={12}
              onChange={(e) => setPostal(e.target.value)}
              placeholder="75011"
              className="mt-1.5 w-full rounded-xl border border-border bg-cream px-3 py-2.5 text-sm outline-none focus-visible:border-clay"
            />
          </label>
          <label className="text-sm">
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
              Ville
            </span>
            <input
              value={city}
              maxLength={120}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Paris"
              className="mt-1.5 w-full rounded-xl border border-border bg-cream px-3 py-2.5 text-sm outline-none focus-visible:border-clay"
            />
          </label>
          <label className="text-sm">
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
              Instructions de remise (facultatif)
            </span>
            <input
              value={note}
              maxLength={300}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Digicode, étage…"
              className="mt-1.5 w-full rounded-xl border border-border bg-cream px-3 py-2.5 text-sm outline-none focus-visible:border-clay"
            />
          </label>
        </div>
      </fieldset>

      <div className="mt-6 rounded-2xl border border-border bg-cream p-5">
        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
          Estimation avant finalisation
        </p>
        <p className="mt-2 text-sm">
          Si un médecin délivre une prescription, réception estimée entre le{" "}
          <strong className="font-medium">{window_.min}</strong> et le{" "}
          <strong className="font-medium">{window_.max}</strong>.
        </p>
        <dl className="mt-3 space-y-1 text-sm text-muted">
          <div className="flex justify-between">
            <dt>Consultation médicale</dt>
            <dd>Gratuite</dd>
          </div>
          <div className="flex justify-between">
            <dt>{option.label}</dt>
            <dd>{option.priceCents === 0 ? "Offerte" : formatPrice(option.priceCents)}</dd>
          </div>
          <div className="flex justify-between border-t border-border pt-2 text-foreground">
            <dt className="font-medium">À régler maintenant</dt>
            <dd className="font-medium">{formatPrice(total)}</dd>
          </div>
        </dl>
        <p className="mt-3 text-xs text-muted">
          Le traitement n'est facturé qu'après la décision du médecin ; aucun médicament n'est
          vendu ni expédié sans ordonnance. Paiement chiffré, aucune donnée de carte n'est
          conservée par MAAN.
        </p>
      </div>

      {error && <p className="mt-4 text-sm text-clay">{error}</p>}

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="button"
          disabled={paid || save.isPending}
          onClick={() => save.mutate({ pay: false })}
          className="rounded-full border border-border px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.14em] text-muted transition-colors hover:border-clay/40 hover:text-foreground disabled:opacity-50"
        >
          Enregistrer la livraison
        </button>
        <button
          type="button"
          disabled={paid || save.isPending}
          onClick={() => save.mutate({ pay: true })}
          className="rounded-full bg-clay px-6 py-2.5 font-mono text-[11px] uppercase tracking-[0.14em] text-cream transition-transform duration-300 ease-[var(--ease)] hover:-translate-y-0.5 disabled:opacity-50"
        >
          {paid ? "Commande finalisée" : "Payer et finaliser la commande"}
        </button>
      </div>

      {paid && order.paid_at && (
        <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
          Finalisée le {new Date(order.paid_at).toLocaleString("fr-FR")}
        </p>
      )}
    </section>
  );
}
