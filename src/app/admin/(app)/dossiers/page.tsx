import type { Metadata } from "next";
import { Suspense } from "react";
import { DossiersTable } from "@/components/admin/dossiers-table";

export const metadata: Metadata = { title: "Dossiers" };

export default function DossiersPage() {
  return (
    <Suspense>
      <DossiersTable />
    </Suspense>
  );
}
