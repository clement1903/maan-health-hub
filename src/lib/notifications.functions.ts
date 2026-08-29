import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

type Pending = {
  id: string;
  channel: string;
  recipient: string | null;
  subject: string;
  body: string;
};

/**
 * Envoie les notifications en attente (e-mail via Resend, SMS via Twilio).
 * Réservé aux administrateurs : appelé juste après un changement d'état de commande.
 */
export const dispatchNotifications = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;

    const { data: adminRow, error: roleError } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle();
    if (roleError) throw roleError;
    if (!adminRow) throw new Error("Forbidden");


    const { data: pending, error } = await supabase
      .from("notifications")
      .select("id, channel, recipient, subject, body")
      .eq("status", "en_attente")
      .order("created_at", { ascending: true })
      .limit(50);
    if (error) throw error;

    const rows = (pending ?? []) as Pending[];
    if (rows.length === 0) return { sent: 0, skipped: 0, failed: 0 };

    const resendKey = process.env["RESEND_API_KEY"];
    const fromEmail = process.env["NOTIFICATIONS_FROM_EMAIL"] ?? "MAAN <onboarding@resend.dev>";
    const twilioSid = process.env["TWILIO_ACCOUNT_SID"];
    const twilioToken = process.env["TWILIO_AUTH_TOKEN"];
    const twilioFrom = process.env["TWILIO_FROM_NUMBER"];

    let sent = 0;
    let skipped = 0;
    let failed = 0;

    for (const n of rows) {
      let status = "envoye";
      let errorText: string | null = null;

      try {
        if (!n.recipient) {
          status = "ignore";
          errorText = "Aucun destinataire enregistré.";
        } else if (n.channel === "email") {
          if (!resendKey) {
            status = "non_configure";
            errorText = "Clé e-mail absente.";
          } else {
            const res = await fetch("https://api.resend.com/emails", {
              method: "POST",
              headers: {
                Authorization: `Bearer ${resendKey}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                from: fromEmail,
                to: [n.recipient],
                subject: n.subject,
                html: `<div style="font-family:Inter,Helvetica,Arial,sans-serif;color:#2b2320">
                  <p style="font-size:12px;letter-spacing:.18em;text-transform:uppercase;color:#a0522d">MAAN</p>
                  <h1 style="font-size:20px;font-weight:500">${escapeHtml(n.subject)}</h1>
                  <p style="font-size:15px;line-height:1.6">${escapeHtml(n.body)}</p>
                  <p style="font-size:13px;color:#6b6157">Suivez votre commande depuis votre espace patient.</p>
                </div>`,
              }),
            });
            if (!res.ok) {
              status = "echec";
              errorText = `Email ${res.status}`;
            }
          }
        } else if (n.channel === "sms") {
          if (!twilioSid || !twilioToken || !twilioFrom) {
            status = "non_configure";
            errorText = "SMS non configuré.";
          } else {
            const res = await fetch(
              `https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`,
              {
                method: "POST",
                headers: {
                  Authorization: `Basic ${btoa(`${twilioSid}:${twilioToken}`)}`,
                  "Content-Type": "application/x-www-form-urlencoded",
                },
                body: new URLSearchParams({
                  To: n.recipient,
                  From: twilioFrom,
                  Body: n.body.slice(0, 300),
                }),
              },
            );
            if (!res.ok) {
              status = "echec";
              errorText = `SMS ${res.status}`;
            }
          }
        }
      } catch (e) {
        status = "echec";
        errorText = e instanceof Error ? e.message : "Erreur inconnue";
      }

      if (status === "envoye") sent += 1;
      else if (status === "echec") failed += 1;
      else skipped += 1;

      await supabase
        .from("notifications")
        .update({
          status,
          error: errorText,
          sent_at: status === "envoye" ? new Date().toISOString() : null,
        })
        .eq("id", n.id);
    }

    return { sent, skipped, failed };
  });

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
