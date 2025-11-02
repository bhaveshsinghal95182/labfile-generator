"use client";
import { useState } from "react";
import { useSystemInstructionStore, DEFAULT_SYSTEM_INSTRUCTION } from "@/context/system-instruction-store";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "./ui/dialog";
import { Textarea } from "./ui/textarea";
import Link from "next/link";
import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
};

export default function SystemInstructionDialog({ open, onOpenChange }: Props) {
  const current = useSystemInstructionStore((s) => s.systemInstruction);
  const setSystemInstruction = useSystemInstructionStore((s) => s.setSystemInstruction);
  const reset = useSystemInstructionStore((s) => s.reset);
  const [draft, setDraft] = useState(current);

  const handleSave = () => {
    setSystemInstruction(draft);
    onOpenChange(false);
  };

  const handleReset = () => {
    setDraft(DEFAULT_SYSTEM_INSTRUCTION);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) setDraft(current); }}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>System Instruction</DialogTitle>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label="About system instructions"
                  onClick={() => {
                    // Navigate via anchor below if desired; we keep onClick noop so tooltip works and Link handles nav in footer
                  }}
                >
                  <Info className="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                System instructions steer the model’s behavior. Set tone, constraints, and output structure.
              </TooltipContent>
            </Tooltip>
          </div>
          <DialogDescription>
            Use the default instruction or tweak it before creating files. This is stored locally and used for future runs.
          </DialogDescription>
        </DialogHeader>
        <Textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          className="min-h-56"
          aria-label="System instruction"
        />
        <DialogFooter className="gap-2">
          <Button asChild variant="ghost" type="button">
            <Link href="/docs/system-instruction" aria-label="Open system instruction docs">
              Open Docs
            </Link>
          </Button>
          <Button variant="secondary" onClick={handleReset} type="button">Use Default</Button>
          <Button variant="outline" onClick={() => onOpenChange(false)} type="button">Cancel</Button>
          <Button onClick={handleSave} type="button">Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
