"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type SystemInstructionState = {
  systemInstruction: string;
  setSystemInstruction: (v: string) => void;
  reset: () => void;
};

const DEFAULT_SYSTEM_INSTRUCTION = `You are a helpful assistant that generates lab files based on provided aims. Follow best practices and keep output organized.`;

export const useSystemInstructionStore = create<SystemInstructionState>()(
  persist(
    (set) => ({
      systemInstruction: DEFAULT_SYSTEM_INSTRUCTION,
      setSystemInstruction: (v: string) => set({ systemInstruction: v }),
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
