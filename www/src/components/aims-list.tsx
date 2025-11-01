import Aim from "./aim";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardAction,
} from "./ui/card";
import { Button } from "./ui/button";
import { Practical } from "@/lib/types";
import { AnimatePresence, motion } from "motion/react";

type Props = {
  practicals?: Practical[];
  onChange?: (next: Practical[]) => void;
};

export default function AimsList({ practicals = [], onChange }: Props) {
  const hasAims = practicals.length > 0;

  const updateAt = (index: number, value: Practical) => {
    if (!onChange) return;
    if (!hasAims && index === 0) {
      onChange([value]);
      return;
    }
    const next: Practical[] = [...practicals];
    next[index] = value;
    onChange(next);
  };

  const removeAt = (index: number) => {
    if (!onChange) return;
    if (!hasAims) {
      onChange([]);
      return;
    }
    const next = practicals.filter((_, i) => i !== index);
    // Keep existing numbers/order chaotic; do not renumber
    onChange(next);
  };

  const addOne = () => {
    if (!onChange) return;
    const next = [...practicals, { number: 0, aim: "" }];
    onChange(next);
  };

  const clearAll = () => {
    if (!onChange) return;
    onChange([]);
  };

  const list: Practical[] = hasAims ? practicals : [{ number: 0, aim: "" }];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Aims</CardTitle>
        <CardAction>
          <Button
            variant={"destructive"}
            onClick={clearAll}
            className="cursor-pointer"
          >
            Clear all
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-3">
        <AnimatePresence initial={false}>
          {list.map((p, i) => (
            <motion.div
              key={i}
              layout
              initial={{ opacity: 0, y: 8, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -8, height: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <Aim
                value={p}
                onChange={(v) => updateAt(i, v)}
                onDelete={() => removeAt(i)}
              />
            </motion.div>
          ))}
        </AnimatePresence>
        <div className="pt-2">
          <Button type="button" variant="outline" onClick={addOne}>
            Add aim
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
