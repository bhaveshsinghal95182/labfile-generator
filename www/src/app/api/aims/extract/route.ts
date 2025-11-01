import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";
import { practicalsSchema } from "@/lib/types";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: NextRequest) {
  const { content }: { content: string } = await req.json();

  const { object } = await generateObject({
    model: google("gemini-2.5-flash-lite"),
    schema: z.object({
      practicals: practicalsSchema.array(),
    }),
    prompt: `You are given the following content: ${content}
    
    You have to extract AIMs (Aims, Intentions, and Milestones) from the content.
    An AIM is a specific goal or objective that a user wants to achieve.
    Return the AIMs as a JSON array of strings.
    
    For example:
    {
      "aims": [
        "Understand the basics of AI-powered text extraction.",
        "Learn how to integrate AI services into a Next.js application."
      ]
    }
    
    Make sure to only include the AIMs in the response and nothing else.
    If there are no AIMs in the content, return an empty array.
    `,
  });

  return NextResponse.json({ practicals: object.practicals });
}
