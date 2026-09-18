import type { Metadata } from "next";
import { PageTitle } from "@/components/espace/shell";
import { Appointments } from "@/components/espace/appointments";

export const metadata: Metadata = { title: "Mes rendez-vous" };

export default function AppointmentsPage() {
  return (
    <>
      <PageTitle title="Mes rendez-vous" description="Réservez un entretien avec votre conseillère sur ses créneaux disponibles." />
      <Appointments />
    </>
  );
}
