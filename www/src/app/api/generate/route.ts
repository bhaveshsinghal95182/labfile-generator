import { z } from "zod";
import { practicalSectionSchema } from "@/lib/types";
import { generateObject } from "ai";
import { google } from "@ai-sdk/google";

const PayloadSchema = z.object({
  aim: z.string().min(1),
  systemInstruction: z.string().optional(),
  model: z.string().optional(),
  sections: z.array(practicalSectionSchema).optional(),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
  const parsed = PayloadSchema.parse(json);
  const { aim } = parsed;
  let { systemInstruction, model, sections } = parsed;

    // Required field check
    if (!aim || !aim.trim()) {
      throw new Error("Missing required field: 'aim'.");
    }

    // Normalize optional fields and apply sensible defaults
    systemInstruction = typeof systemInstruction === "string" ? systemInstruction.trim() : "";
    model = typeof model === "string" && model.trim() ? model.trim() : "gemini-2.5-flash-lite";

    // Validate sections: must be an array if provided, and each section must have a non-empty heading
    if (!sections) {
      sections = [];
    } else if (!Array.isArray(sections)) {
      throw new Error("'sections' must be an array.");
    } else {
      sections = sections.map((sec, idx) => {
        if (!sec || typeof sec !== "object") {
          throw new Error(`Section ${idx + 1} must be an object.`);
        }
        if (!sec.heading || typeof sec.heading !== "string" || !sec.heading.trim()) {
          throw new Error(`Section ${idx + 1} is missing a non-empty 'heading'.`);
        }
        return {
          ...sec,
          description:
            sec.description && String(sec.description).trim()
              ? String(sec.description)
              : "No description provided.",
        };
      });
    }

    const systemPrompt: string = `Your identity:${systemInstruction}
    
    You have to write for the following AIM: ${aim}
    
    Follow the structure and guidelines provided in the sections below.
    Sections:
    ${sections?.map((section, index) => `${index + 1}. ${section.heading}: ${
      section.description || "No description provided."
    }`).join("\n") || "No specific sections provided."}
    
    Ensure clarity, conciseness, and relevance in your output.
    `;

    const { object } = await generateObject({
      model: google(model || "gemini-2.5-flash-lite"),
      schema: z.object({
        practical: practicalSectionSchema.array(),
      }),
      prompt: systemPrompt,
      output: "object",
    });

    const generatedSections = Array.isArray(object?.practical)
      ? (object.practical as Array<z.infer<typeof practicalSectionSchema>>)
      : [];

    const fallbackSections = sections ?? [];
    const finalSections = generatedSections.length > 0 ? generatedSections : fallbackSections;

    const toMarkdown = (
      title: string,
      secs: Array<{ heading: string; description: string }>
    ): string => {
      const lines: string[] = [];
      lines.push(`# ${title}`);
      lines.push("");
      for (const sec of secs) {
        const heading = (sec.heading || "").trim();
        const body = (sec.description || "").trim();
        if (heading) {
          lines.push(`## ${heading}`);
          lines.push("");
        }
        lines.push(body || "_(No content provided.)_");
        lines.push("");
      }
      return lines.join("\n");
    };

    const markdown = toMarkdown(aim, finalSections);

    return Response.json({ ok: true, aim, markdown });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid request";
    return new Response(message, { status: 400 });
  }
}
