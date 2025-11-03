import { PracticalSection } from "@/lib/types";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import * as React from "react";
import { motion } from "motion/react";
import Bin from "./icons/dustbin";

 type SectionProps = {
  value: PracticalSection;
  onChange: (next: PracticalSection) => void;
  onDelete?: () => void;
};

export default function Section({ value, onChange, onDelete }: SectionProps) {
  const handleHeadingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...value, heading: e.target.value });
  };

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    onChange({ ...value, description: e.target.value });
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.15 }}
      className="flex flex-col gap-2"
    >
      <div className="flex gap-2 items-start">
        <Input
          className="flex-1"
          type="text"
          value={value.heading}
          onChange={handleHeadingChange}
          placeholder="Heading"
          aria-label="Section heading"
        />
        <Button
          type="button"
          variant={"destructive"}
          onClick={onDelete}
          aria-label="Delete section"
          className="cursor-pointer"
        >
          <Bin size="20" />
        </Button>
      </div>
      <Textarea
        value={value.description}
        onChange={handleDescriptionChange}
        placeholder="Describe what AI should write in this section..."
        aria-label="Section description"
        className="min-h-24"
      />
    </motion.div>
  );
}
