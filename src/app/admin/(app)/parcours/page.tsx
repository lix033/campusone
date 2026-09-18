import type { Metadata } from "next";
import { WorkflowEditor } from "@/components/admin/workflow-editor";

export const metadata: Metadata = { title: "Parcours d'étapes" };

export default function WorkflowsPage() {
  return <WorkflowEditor />;
}
