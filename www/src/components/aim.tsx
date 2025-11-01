import { Practical } from "@/lib/types";
import Bin from "./icons/dustbin";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import * as React from "react";
import { motion } from "motion/react";


type AimProps = {
  value: Practical;
  onChange: (next: Practical) => void;
  onDelete?: () => void;
};

export default function Aim({ value, onChange, onDelete }: AimProps) {
  const handleAimChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...value, aim: e.target.value });
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.15 }}
      className="flex gap-2"
    >
      <Input
        className="w-10"
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        value={value.number > 0 ? String(value.number) : ""}
        onChange={(e) => {
          const v = e.target.value;
          // Allow empty input to represent "no number yet"
          if (v === "") {
            onChange({ ...value, number: 0 });
            return;
          }
          const parsed = Number.parseInt(v, 10);
          if (Number.isNaN(parsed)) return; // ignore invalid
          onChange({ ...value, number: parsed });
        }}
        placeholder="#"
        aria-label="Aim number"
      />
      <Input
        value={value.aim}
        onChange={handleAimChange}
        placeholder="Write the aim..."
        aria-label="Aim text"
        className="flex-1"
      />
      <Button
        type="button"
        variant={"destructive"}
        onClick={onDelete}
        aria-label="Delete aim"
        className="cursor-pointer"
      >
        <Bin size="20" />
      </Button>
    </motion.div>
  );
}
