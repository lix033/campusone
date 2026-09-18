import type { Metadata } from "next";
import { CandidateShell } from "@/components/espace/shell";

export const metadata: Metadata = { title: { default: "Mon espace", template: "%s · Mon espace Campus One" }, robots: { index: false } };

export default function EspaceLayout({ children }: { children: React.ReactNode }) {
  return <CandidateShell>{children}</CandidateShell>;
}
