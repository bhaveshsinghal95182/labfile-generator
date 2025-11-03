"use client";
import { useState } from "react";
import {
  useSystemInstructionStore,
  DEFAULT_SYSTEM_INSTRUCTION,
  DEFAULT_MODEL,
} from "@/context/system-instruction-store";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import SectionsList from "./sections-list";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
};

export default function SystemInstructionDialog({ open, onOpenChange }: Props) {
  const current = useSystemInstructionStore((s) => s.systemInstruction);
  const currentModel = useSystemInstructionStore((s) => s.model);
  const setSystemInstruction = useSystemInstructionStore(
    (s) => s.setSystemInstruction
  );
  const setModel = useSystemInstructionStore((s) => s.setModel);
  const [draft, setDraft] = useState(current);
  const [draftModel, setDraftModel] = useState(currentModel ?? DEFAULT_MODEL);

  const handleSave = () => {
    setSystemInstruction(draft);
    setModel(draftModel);
    onOpenChange(false);
  };

  const handleReset = () => {
    setDraft(DEFAULT_SYSTEM_INSTRUCTION);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v);
        if (!v) {
          setDraft(current);
          setDraftModel(currentModel ?? DEFAULT_MODEL);
        }
      }}
    >
      <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>System Instruction</DialogTitle>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  asChild
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label="About system instructions"
                >
                  <Link href="/docs/system-instruction">
                    <Info className="size-4" />
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                System instructions steer the model’s behavior. Set tone,
                constraints, and output structure.
              </TooltipContent>
            </Tooltip>
          </div>
          <DialogDescription>
            Use the default instruction or tweak it before creating files. This
            is stored locally and used for future runs.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium">Model</span>
          <Select value={draftModel} onValueChange={setDraftModel}>
            <SelectTrigger size="sm">
              <SelectValue placeholder="Select a model" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gemini-2.5-flash-lite">
                Gemini 2.5 Flash Lite
              </SelectItem>
              <SelectItem value="gemini-2.5-flash">Gemini 2.5 Flash</SelectItem>
              <SelectItem value="gemini-2.5-pro">
                Gemini 2.5 Pro
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <h3 className="text-base font-medium">Structure (optional)</h3>
          <SectionsList compact />
        </div>
        <div className="space-y-2">
          <h3 className="text-base font-medium">System Prompt</h3>
          <Textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            className="min-h-56"
            aria-label="System instruction"
          />
        </div>
        <DialogFooter className="gap-2">
          <Button asChild variant="ghost" type="button">
            <Link
              href="/docs/system-instruction"
              aria-label="Open system instruction docs"
            >
              Open Docs
            </Link>
          </Button>
          <Button variant="secondary" onClick={handleReset} type="button">
            Use Default
          </Button>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            type="button"
          >
            Cancel
          </Button>
          <Button onClick={handleSave} type="button">
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
