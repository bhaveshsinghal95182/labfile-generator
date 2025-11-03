import z from "zod";

export type Practical = {
    number: number;
    aim: string;
}

export const practicalsSchema = z.object({
    number: z.number(),
    aim: z.string(),
});

export type PracticalSection = {
    heading: string;
    description: string;
}

export const practicalSectionSchema = z.object({
    heading: z.string().min(1, "Heading is required"),
    description: z.string().default("")
});

export type StoredPractical = {
    id: string;
    aim: string;
    markdown: string;
    sections: PracticalSection[];
    systemInstruction: string;
    model: string;
    createdAt: number;
    updatedAt: number;
}
