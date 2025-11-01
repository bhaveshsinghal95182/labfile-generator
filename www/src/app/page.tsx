"use client";
import { Textarea } from "@/components/ui/textarea";
import { ButtonGroup } from "@/components/ui/button-group";
import { useState } from "react";
import PencilOutline from "@/components/icons/pencil-outline";
import List from "@/components/icons/list";
import AimsList from "@/components/aims-list";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AnimatePresence, motion } from "motion/react";

export default function Home() {
  const [content, setContent] = useState(`
    You can write your aims here in markdown format. For example:

    1. Understand the basics of AI-powered text extraction.
    2. Learn how to integrate AI services into a Next.js application.
    3. Explore advanced techniques for optimizing AI model performance.

    or you can just copy the blob of text here and let ai decide the AIMs
    `);
  const [isMarkdown, setIsMarkdown] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(event.target.value);
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="">
        <h1 className="text-5xl font-bold mb-8">
          Let's start by getting to know the aims
        </h1>
        {/* So the requirement is to create an experience of 3 types
        1. Textarea where user can input/paste the aims as a text blob
        2. an area where they can just write the aims in a more structured way
        3. an area where they can write the aims in md format

        We can combine 1 and 3 by using a markdown editor that supports both raw text and md rendering
        For 2, we can have a structured form input
        */}
                <div className="grow w-full max-w-5xl mx-auto h-[75vh]">
          <div className="flex justify-end p-2">
            <div className="relative flex items-center rounded-lg border border-input">
              <ButtonGroup
                className="border-input"
                aria-label="Toggle between Markdown and List views"
              >
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size={"icon"}
                      className="relative z-0 text-foreground"
                      onClick={() => setIsMarkdown(true)}
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
                      className="relative z-0 text-foreground"
                      onClick={() => setIsMarkdown(false)}
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
                className="absolute z-10 h-full w-1/2 rounded-md bg-white mix-blend-difference"
                initial={{ x: isMarkdown ? 0 : "100%" }}
                animate={{ x: isMarkdown ? 0 : "100%" }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            </div>
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
                <Textarea
                  value={content}
                  onChange={handleChange}
                  className="h-[80%] p-6 sm:p-8 resize-none text-lg font-mono leading-relaxed placeholder:text-muted-foreground scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-700"
                  placeholder="Start writing your text or markdown here..."
                />
              ) : (
                <AimsList />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
