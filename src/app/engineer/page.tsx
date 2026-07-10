import type { Metadata } from "next";
import TerminalMode from "@/components/TerminalMode";

export const metadata: Metadata = {
  title: "Engineer Mode",
  description:
    "Explore Devansh Dubey's AI gateway work, verified engineering logs, interactive terminal, demos, and tooling.",
};

export default function EngineerPage() {
  return <TerminalMode />;
}
