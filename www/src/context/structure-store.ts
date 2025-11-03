"use client";

import { create } from "zustand";
import { PracticalSection } from "@/lib/types";

export type StructureState = {
  sections: PracticalSection[];
  setSections: (list: PracticalSection[]) => void;
  addSection: () => void;
  updateSection: (index: number, value: PracticalSection) => void;
  removeSection: (index: number) => void;
  clear: () => void;
};

export const useStructureStore = create<StructureState>((set, get) => ({
  sections: [],
  setSections: (list) => set({ sections: list }),
  addSection: () =>
    set({ sections: [...get().sections, { heading: "", description: "" }] }),
  updateSection: (index, value) =>
    set({
      sections: get().sections.map((s, i) => (i === index ? value : s)),
    }),
  removeSection: (index) =>
    set({ sections: get().sections.filter((_, i) => i !== index) }),
  clear: () => set({ sections: [] }),
}));
