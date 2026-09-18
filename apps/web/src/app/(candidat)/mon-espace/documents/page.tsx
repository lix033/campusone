import type { Metadata } from "next";
import { PageTitle } from "@/components/espace/shell";
import { DocumentsManager } from "@/components/espace/documents-manager";

export const metadata: Metadata = { title: "Mes documents" };

export default function DocumentsPage() {
  return (
    <>
      <PageTitle title="Mes documents" description="Dossier CO-2026-0142 · Master Management International. Format PDF uniquement." />
      <DocumentsManager />
    </>
  );
}
