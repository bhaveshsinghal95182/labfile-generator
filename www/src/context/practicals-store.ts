"use client";

import { create } from "zustand";
import { Practical } from "@/lib/types";

export type PracticalsState = {
  practicals: Practical[];
  setPracticals: (list: Practical[]) => void;
  addPractical: () => void;
  updatePractical: (index: number, value: Practical) => void;
  removePractical: (index: number) => void;
  clear: () => void;
};

export const usePracticalsStore = create<PracticalsState>((set, get) => ({
  practicals: [],
  setPracticals: (list) => set({ practicals: list }),
  addPractical: () => set({ practicals: [...get().practicals, { number: 0, aim: "" }] }),
  updatePractical: (index, value) =>
    set({
      practicals: get().practicals.map((p, i) => (i === index ? value : p)),
    }),
  removePractical: (index) =>
    set({ practicals: get().practicals.filter((_, i) => i !== index) }),
  clear: () => set({ practicals: [] }),
}));
