import z from "zod";

export type Practical = {
    number: number;
    aim: string;
}

export const practicalsSchema = z.object({
    number: z.number(),
    aim: z.string(),
});
