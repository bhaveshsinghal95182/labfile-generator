"use client";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import PencilOutline from "@/components/icons/pencil-outline";
import List from "@/components/icons/list";
import { motion } from "motion/react";

type Props = {
  isMarkdown: boolean;
  onChange: (isMarkdown: boolean) => void;
  className?: string;
  ariaLabel?: string;
};

export default function ViewModeToggle({
  isMarkdown,
  onChange,
  className = "",
  ariaLabel = "Toggle between Markdown and List views",
}: Props) {
  return (
    <div className={`relative flex items-center rounded-lg border border-input ${className}`}>
      <ButtonGroup className="border-input" aria-label={ariaLabel}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size={"icon"}
              className={`relative z-0 transition-colors ${
                isMarkdown ? "text-green-500" : "text-foreground/60"
              }`}
              onClick={() => onChange(true)}
              aria-pressed={isMarkdown}
            >
              <PencilOutline size="24" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Editor view</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size={"icon"}
              className={`relative z-0 transition-colors ${
                !isMarkdown ? "text-green-500" : "text-foreground/60"
              }`}
              onClick={() => onChange(false)}
              aria-pressed={!isMarkdown}
            >
              <List size="24" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>List view</p>
          </TooltipContent>
        </Tooltip>
      </ButtonGroup>
      <motion.div
        className={`absolute z-10 h-full w-1/2 ${
          isMarkdown ? "rounded-l-md" : "rounded-r-md"
        } bg-foreground/20 mix-blend-difference`}
        initial={{ x: isMarkdown ? 0 : "100%" }}
        animate={{ x: isMarkdown ? 0 : "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      />
    </div>
  );
}
