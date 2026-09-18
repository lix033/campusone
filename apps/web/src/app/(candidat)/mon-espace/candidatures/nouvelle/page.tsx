import type { Metadata } from "next";
import { Suspense } from "react";
import { ApplicationWizard } from "@/components/espace/wizard";

export const metadata: Metadata = { title: "Nouvelle candidature" };

export default function NewApplicationPage() {
  return (
    <Suspense>
      <ApplicationWizard />
    </Suspense>
  );
}
