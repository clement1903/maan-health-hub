import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

import { supabase } from "@/integrations/supabase/client";

import { PatientProvider } from "@/lib/patient/store";
import { PatientBottomNav, PatientTopNav } from "@/components/patient/patient-nav";

export const Route = createFileRoute("/mon-espace")({
  ssr: false,
  beforeLoad: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) throw redirect({ to: "/auth" });
  },
  head: () => ({
    meta: [
      { title: "Mon espace — MAAN" },
      {
        name: "description",
        content:
          "Votre clinique MAAN dans la poche : parcours de soin, messages avec votre médecin, suivi et livraison.",
      },
      { property: "og:title", content: "Mon espace — MAAN" },
      {
        property: "og:description",
        content: "Parcours de soin, messages, suivi médical et livraison dans votre espace MAAN.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: PatientLayout,
});

function PatientLayout() {
  return (
    <PatientProvider>
      <div className="min-h-screen bg-background pb-24 md:pb-16">
        <PatientTopNav />
        <main className="pt-8">
          <div className="mx-auto max-w-5xl px-5">
            <Outlet />
          </div>
        </main>
        <PatientBottomNav />
      </div>
    </PatientProvider>
  );
}
