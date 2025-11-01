"use client";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import AimsList from "@/components/aims-list";
import { StatefulButton } from "@/components/ui/stateful-button";
import { AnimatePresence, motion } from "motion/react";
import ViewModeToggle from "@/components/view-mode-toggle";
import { Practical } from "@/lib/types";

export default function Home() {
  const [content, setContent] = useState(`
    You can write your aims here in markdown format. For example:

    1. Understand the basics of AI-powered text extraction.
    2. Learn how to integrate AI services into a Next.js application.
    3. Explore advanced techniques for optimizing AI model performance.

    or you can just copy the blob of text here and let ai decide the AIMs
    `);
  const [isMarkdown, setIsMarkdown] = useState(true);
  const [practicals, setPracticals] = useState<Practical[]>([]);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(event.target.value);
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch("/api/aims/extract", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        throw new Error("Failed to extract aims");
      }

      const data = await response.json();
      setPracticals(data.practicals);
      setIsMarkdown(false);
    } catch (error) {
      console.error("Error extracting aims:", error);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="">
        <h1 className="text-5xl font-bold mb-8">
          Let&apos;s start by getting to know the aims
        </h1>
        {/* So the requirement is to create an experience of 3 types
        1. Textarea where user can input/paste the aims as a text blob
        2. an area where they can just write the aims in a more structured way
        3. an area where they can write the aims in md format

        We can combine 1 and 3 by using a markdown editor that supports both raw text and md rendering
        For 2, we can have a structured form input
        */}
        <div className="grow w-full max-w-5xl mx-auto h-[75vh]">
          <div className="flex justify-end pb-4">
            <ViewModeToggle isMarkdown={isMarkdown} onChange={setIsMarkdown} />
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={isMarkdown ? "markdown" : "list"}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {isMarkdown ? (
                <>
                  <Textarea
                    value={content}
                    onChange={handleChange}
                    className="h-[80%] p-6 sm:p-8 resize-none text-lg font-mono leading-relaxed placeholder:text-muted-foreground scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-700"
                    placeholder="Start writing your text or markdown here..."
                  />
                  <div className="flex justify-end">
                    <StatefulButton onClick={handleSubmit} className="mt-4">
                      AI Extract
                    </StatefulButton>
                  </div>
                </>
              ) : (
                <AimsList practicals={practicals} onChange={setPracticals} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
