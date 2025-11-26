import type { Metadata } from "next";
import TerminalMode from "@/components/TerminalMode";

export const metadata: Metadata = {
  title: "Engineer Mode",
  description:
    "Dive into Devansh Dubey's engineering playground featuring terminal interactions, build logs, demos, and tooling.",
};

export default function EngineerPage() {
  return <TerminalMode />;
}
