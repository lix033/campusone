import type { Metadata } from "next";
import { Chat } from "@/components/espace/chat";

export const metadata: Metadata = { title: "Messages" };

export default function MessagesPage() {
  return <Chat />;
}
