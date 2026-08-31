import { useEffect, useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";
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
  const { t, lang } = useI18n();
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
  const locale = lang === "en" ? "en-US" : "fr-FR";

  const save = useMutation({
    mutationFn: async (payload: { pay: boolean }) => {
      if (!line1.trim() || !postal.trim() || !city.trim()) {
        throw new Error(
          t("Adresse incomplète : rue, code postal et ville sont nécessaires.", "Incomplete address: street, postal code and city are required."),
        );
      }
      if (line1.length > 200 || city.length > 120 || note.length > 300) {
        throw new Error(t("Adresse trop longue.", "Address too long."));
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
          {t("Livraison & finalisation", "Delivery & checkout")}
        </h4>
        <span className="rounded-full border border-clay/30 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-clay">
          {paymentStatusLabels[order.payment_status] ?? order.payment_status}
        </span>
      </div>

      <fieldset className="mt-5" disabled={paid}>
        <legend className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
          {t("Mode de livraison", "Delivery method")}
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
                  {o.minDays}–{o.maxDays} {t("jours ouvrés", "business days")} ·{" "}
                  {o.priceCents === 0 ? t("Offerte", "Free") : formatPrice(o.priceCents)}
                </p>
              </button>
            );
          })}
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <label className="text-sm">
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
              {t("Adresse", "Address")}
            </span>
            <input
              value={line1}
              maxLength={200}
              onChange={(e) => setLine1(e.target.value)}
              placeholder={t("12 rue des Lilas, apt. 3", "12 Lilac Street, apt. 3")}
              className="mt-1.5 w-full rounded-xl border border-border bg-cream px-3 py-2.5 text-sm outline-none focus-visible:border-clay"
            />
          </label>
          <label className="text-sm">
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
              {t("Code postal", "Postal code")}
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
              {t("Ville", "City")}
            </span>
            <input
              value={city}
              maxLength={120}
              onChange={(e) => setCity(e.target.value)}
              placeholder={t("Paris", "Paris")}
              className="mt-1.5 w-full rounded-xl border border-border bg-cream px-3 py-2.5 text-sm outline-none focus-visible:border-clay"
            />
          </label>
          <label className="text-sm">
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
              {t("Instructions de remise (facultatif)", "Delivery instructions (optional)")}
            </span>
            <input
              value={note}
              maxLength={300}
              onChange={(e) => setNote(e.target.value)}
              placeholder={t("Digicode, étage…", "Door code, floor…")}
              className="mt-1.5 w-full rounded-xl border border-border bg-cream px-3 py-2.5 text-sm outline-none focus-visible:border-clay"
            />
          </label>
        </div>
      </fieldset>

      <div className="mt-6 rounded-2xl border border-border bg-cream p-5">
        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
          {t("Estimation avant finalisation", "Estimate before checkout")}
        </p>
        <p className="mt-2 text-sm">
          {t("Si un médecin délivre une prescription, réception estimée entre le", "If a doctor issues a prescription, estimated delivery between")}{" "}
          <strong className="font-medium">{window_.min}</strong> {t("et le", "and")}{" "}
          <strong className="font-medium">{window_.max}</strong>.
        </p>
        <dl className="mt-3 space-y-1 text-sm text-muted">
          <div className="flex justify-between">
            <dt>{t("Consultation médicale en ligne", "Online medical consultation")}</dt>
            <dd>{t("Gratuite", "Free")}</dd>
          </div>
          <div className="flex justify-between">
            <dt>{option.label}</dt>
            <dd>{option.priceCents === 0 ? t("Offerte", "Free") : formatPrice(option.priceCents)}</dd>
          </div>
          <div className="flex justify-between border-t border-border pt-2 text-foreground">
            <dt className="font-medium">{t("À régler maintenant", "Due now")}</dt>
            <dd className="font-medium">{formatPrice(total)}</dd>
          </div>
        </dl>
        <p className="mt-3 text-xs text-muted">
          {t(
            "Le traitement n'est facturé qu'après la décision du médecin ; aucun médicament n'est vendu ni expédié sans ordonnance. Paiement chiffré, aucune donnée de carte n'est conservée par MAAN.",
            "The treatment is only billed after the doctor's decision; no medication is sold or shipped without a prescription. Encrypted payment, no card data is stored by MAAN.",
          )}
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
          {t("Enregistrer la livraison", "Save delivery details")}
        </button>
        <button
          type="button"
          disabled={paid || save.isPending}
          onClick={() => save.mutate({ pay: true })}
          className="rounded-full bg-clay px-6 py-2.5 font-mono text-[11px] uppercase tracking-[0.14em] text-cream transition-transform duration-300 ease-[var(--ease)] hover:-translate-y-0.5 disabled:opacity-50"
        >
          {paid ? t("Commande finalisée", "Order completed") : t("Payer et finaliser la commande", "Pay and complete the order")}
        </button>
      </div>

      {paid && order.paid_at && (
        <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
          {t("Finalisée le", "Completed on")} {new Date(order.paid_at).toLocaleString(locale)}
        </p>
      )}
    </section>
  );
}
