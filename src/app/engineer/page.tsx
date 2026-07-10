import type { Metadata } from "next";
import TerminalMode from "@/components/TerminalMode";

export const metadata: Metadata = {
  title: "Engineer Mode",
  description:
    "Explore Devansh Dubey's backend and AI infrastructure work through an interactive developer console, systems demos, and technical tooling.",
};

export default function EngineerPage() {
  return <TerminalMode />;
}
