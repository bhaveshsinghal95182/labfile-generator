import Section from "./section";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardAction,
} from "./ui/card";
import { Button } from "./ui/button";
import { PracticalSection } from "@/lib/types";
import { AnimatePresence, motion } from "motion/react";
import { useStructureStore } from "@/context/structure-store";
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription } from "./ui/empty";

export default function SectionsList({
  compact = false,
}: {
  compact?: boolean;
}) {
  const sections = useStructureStore((s) => s.sections);
  const setSections = useStructureStore((s) => s.setSections);
  const addSection = useStructureStore((s) => s.addSection);
  const updateSection = useStructureStore((s) => s.updateSection);
  const removeSection = useStructureStore((s) => s.removeSection);
  const clear = useStructureStore((s) => s.clear);

  const hasSections = sections.length > 0;

  const updateAt = (index: number, value: PracticalSection) => {
    if (!hasSections && index === 0) {
      setSections([value]);
      return;
    }
    updateSection(index, value);
  };

  const removeAt = (index: number) => {
    if (!hasSections) {
      setSections([]);
      return;
    }
    removeSection(index);
  };

  const addOne = () => {
    addSection();
  };

  const clearAll = () => {
    clear();
  };

  const list: PracticalSection[] = sections;

  if (compact) {
    return (
      <div className="space-y-3">
        {!hasSections && (
          <Empty>
            <EmptyHeader>
              <EmptyTitle>No subheadings yet</EmptyTitle>
              <EmptyDescription>
                Add concise subheadings. Heading becomes the section title;
                Description guides the AI (tone, points). Click &quot;Add subheading&quot;
                to add more.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}
        <AnimatePresence initial={false}>
          {list.map((s, i) => (
            <motion.div
              key={i}
              layout
              initial={{ opacity: 0, y: 8, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -8, height: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <Section
                value={s}
                onChange={(v) => updateAt(i, v)}
                onDelete={() => removeAt(i)}
              />
            </motion.div>
          ))}
        </AnimatePresence>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            className="cursor-pointer"
            onClick={addOne}
          >
            Add subheading
          </Button>
          {hasSections && (
            <Button
              type="button"
              variant="destructive"
              className="cursor-pointer"
              onClick={clearAll}
            >
              Clear all
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Structure</CardTitle>
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
          {!hasSections && (
            <Empty>
              <EmptyHeader>
                <EmptyTitle>No subheadings yet</EmptyTitle>
                <EmptyDescription>
                  Click &quot;Add subheading&quot; to create your first section.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          )}
          <AnimatePresence initial={false}>
            {list.map((s, i) => (
              <motion.div
                key={i}
                layout
                initial={{ opacity: 0, y: 8, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, y: -8, height: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                <Section
                  value={s}
                  onChange={(v) => updateAt(i, v)}
                  onDelete={() => removeAt(i)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
          <Button
            type="button"
            variant="outline"
            className="pt-2 cursor-pointer"
            onClick={addOne}
          >
            Add subheading
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
