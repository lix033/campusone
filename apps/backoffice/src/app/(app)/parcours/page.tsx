import type { Metadata } from "next";
import { WorkflowEditor } from "@/components/workflow-editor";

export const metadata: Metadata = { title: "Parcours d'étapes" };

export default function WorkflowsPage() {
  return <WorkflowEditor />;
}
