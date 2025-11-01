import z from "zod";

export type Aim = {
    number: number;
    aim: string;
}

export const aimSchema = z.object({
    number: z.number(),
    aim: z.string(),
});
