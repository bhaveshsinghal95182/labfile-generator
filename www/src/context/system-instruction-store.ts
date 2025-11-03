"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type SystemInstructionState = {
  systemInstruction: string;
  model: string;
  setSystemInstruction: (v: string) => void;
  setModel: (v: string) => void;
  reset: () => void;
};

const DEFAULT_SYSTEM_INSTRUCTION = `You are a helpful assistant that generates lab files based on provided aims. Follow best practices and keep output organized.`;
export const DEFAULT_MODEL = "gemini-2.5-flash-lite";

export const useSystemInstructionStore = create<SystemInstructionState>()(
  persist(
    (set) => ({
      systemInstruction: DEFAULT_SYSTEM_INSTRUCTION,
      model: DEFAULT_MODEL,
      setSystemInstruction: (v: string) => set({ systemInstruction: v }),
      setModel: (v: string) => set({ model: v }),
      reset: () => set({ systemInstruction: DEFAULT_SYSTEM_INSTRUCTION }),
    }),
    {
      name: "system-instruction",
      storage: createJSONStorage(() => localStorage),
      version: 1,
    }
  )
);

export { DEFAULT_SYSTEM_INSTRUCTION };
