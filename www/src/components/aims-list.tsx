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
import { usePracticalsStore } from "@/context/practicals-store";

export default function AimsList() {
  const practicals = usePracticalsStore((s) => s.practicals);
  const setPracticals = usePracticalsStore((s) => s.setPracticals);
  const addPractical = usePracticalsStore((s) => s.addPractical);
  const updatePractical = usePracticalsStore((s) => s.updatePractical);
  const removePractical = usePracticalsStore((s) => s.removePractical);
  const clear = usePracticalsStore((s) => s.clear);

  const hasAims = practicals.length > 0;

  const updateAt = (index: number, value: Practical) => {
    if (!hasAims && index === 0) {
      setPracticals([value]);
      return;
    }
    updatePractical(index, value);
  };

  const removeAt = (index: number) => {
    if (!hasAims) {
      setPracticals([]);
      return;
    }
    removePractical(index);
  };

  const addOne = () => {
    addPractical();
  };

  const clearAll = () => {
    clear();
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
