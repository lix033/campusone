import type { Metadata } from "next";
import { PageTitle } from "@/components/espace/shell";
import { Remarks } from "@/components/espace/remarks";

export const metadata: Metadata = { title: "Remarques" };

export default function RemarksPage() {
  return (
    <>
      <PageTitle title="Remarques" description="Les demandes de votre conseillère sur votre dossier. Chaque remarque indique l'action attendue." />
      <Remarks />
    </>
  );
}
