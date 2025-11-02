"use client";
import { useState } from "react";
import { Button } from "./ui/button";
import { MultiStepLoader } from "./ui/multi-step-loader";
import { usePracticalsStore } from "@/context/practicals-store";
import SystemInstructionDialog from "./system-instruction-dialog";
import { useSystemInstructionStore } from "@/context/system-instruction-store";

export default function CreateFilesButton() {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [siOpen, setSiOpen] = useState(false);
  const practicals = usePracticalsStore((s) => s.practicals);
  const systemInstruction = useSystemInstructionStore((s) => s.systemInstruction);

  // Build dynamic loading states from aims in the store; fall back to 3 generic steps
  const dynamicStates = (practicals
    ?.map((p) => (p.aim ?? "").trim())
    .filter(Boolean)
    .map((aim, i) => ({ text: `(${i + 1}) ${aim}` })) ?? []) as { text: string }[];

  const loadingStates =
    dynamicStates.length > 0
      ? dynamicStates
      : ([
          { text: "Preparing structure" },
          { text: "Generating files" },
          { text: "Finalizing" },
        ] as { text: string }[]);

  const handleCreateFiles = async () => {
    if (loadingStates.length === 0) return;
    setLoading(true);
    setStep(0);

    try {
      for (let i = 0; i < loadingStates.length; i++) {
        setStep(i);
        const aimText = loadingStates[i].text.replace(/^\(\d+\)\s*/, "");
        const res = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ aim: aimText, systemInstruction }),
        });
        // Non-fatal error handling; continue to next aim
        if (!res.ok) {
          // Optionally: log or toast error
        }
        // await res.json(); // not strictly needed
      }
    } finally {
      setLoading(false);
      setStep(0);
    }
  };

  return (
    <div className="flex justify-end gap-2">
      <Button
        variant="secondary"
        className="mt-4 cursor-pointer"
        onClick={() => setSiOpen(true)}
        disabled={loading}
      >
        System Instruction
      </Button>
      <Button
        variant="outline"
        className="mt-4 cursor-pointer"
        onClick={handleCreateFiles}
        disabled={loading || loadingStates.length === 0}
      >
        {loading ? "Working..." : "Create Files"}
      </Button>
      <MultiStepLoader
        loading={loading}
        loadingStates={loadingStates}
        duration={900}
        loop={false}
        value={step}
      />
      <SystemInstructionDialog open={siOpen} onOpenChange={setSiOpen} />
    </div>
  );
}
