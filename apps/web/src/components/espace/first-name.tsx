"use client";

import { useSession } from "@/lib/session";

export function FirstName() {
  return <>{useSession()?.firstName ?? ""}</>;
}
