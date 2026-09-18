import type { Metadata } from "next";
import { Catalogue } from "@/components/site/catalogue";

export const metadata: Metadata = { title: "Catalogue des formations" };

export default async function FormationsPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams;
  return <Catalogue initial={sp} />;
}
