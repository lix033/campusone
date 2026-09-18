import type { Metadata } from "next";
import { Orientation } from "@/components/site/orientation";

export const metadata: Metadata = { title: "Orientation personnalisée" };

export default function OrientationPage() {
  return <Orientation />;
}
