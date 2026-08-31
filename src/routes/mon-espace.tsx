import { createFileRoute, Outlet } from "@tanstack/react-router";

import { PatientProvider } from "@/lib/patient/store";
import { PatientBottomNav, PatientTopNav, ScenarioSwitcher } from "@/components/patient/patient-nav";

export const Route = createFileRoute("/mon-espace")({
  ssr: false,
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
          <ScenarioSwitcher />
          <div className="mx-auto max-w-5xl px-5">
            <Outlet />
          </div>
        </main>
        <PatientBottomNav />
      </div>
    </PatientProvider>
  );
}
