import type { Metadata } from "next";
import { PageTitle } from "@/components/espace/shell";
import { Payments } from "@/components/espace/payments";

export const metadata: Metadata = { title: "Mes paiements" };

export default function PaymentsPage() {
  return (
    <>
      <PageTitle title="Mes paiements" description="Réglez vos frais et retrouvez vos reçus." />
      <Payments />
    </>
  );
}
