import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { dossiers } from "@/lib/mocks";
import { DossierView } from "@/components/admin/dossier-view";

export const metadata: Metadata = { title: "Dossier" };

export default async function DossierPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const d = dossiers.find((x) => x.id === id);
  if (!d) notFound();
  return <DossierView dossier={d} />;
}
