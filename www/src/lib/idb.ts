"use client";

import type { StoredPractical } from "@/lib/types";

const DB_NAME = "labfile";
const DB_VERSION = 1;
const STORE_PRACTICALS = "practicals" as const;

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === "undefined") {
      reject(new Error("IndexedDB is not available in this environment."));
      return;
    }
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_PRACTICALS)) {
        const store = db.createObjectStore(STORE_PRACTICALS, { keyPath: "id" });
        store.createIndex("createdAt", "createdAt");
        store.createIndex("updatedAt", "updatedAt");
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error || new Error("Failed to open DB"));
  });
}

export async function savePracticals(practicals: StoredPractical[]): Promise<void> {
  if (!practicals.length) return;
  const db = await openDB();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE_PRACTICALS, "readwrite");
    const store = tx.objectStore(STORE_PRACTICALS);
    for (const p of practicals) {
      store.put(p);
    }
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error || new Error("Transaction failed"));
  });
}

export async function getAllPracticals(): Promise<StoredPractical[]> {
  const db = await openDB();
  return await new Promise<StoredPractical[]>((resolve, reject) => {
    const tx = db.transaction(STORE_PRACTICALS, "readonly");
    const store = tx.objectStore(STORE_PRACTICALS);
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result as StoredPractical[]);
    req.onerror = () => reject(req.error || new Error("Failed to read practicals"));
  });
}

export async function updatePractical(
  id: string,
  updates: Partial<Pick<StoredPractical, "markdown" | "sections" | "updatedAt" | "aim">>
): Promise<void> {
  const db = await openDB();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE_PRACTICALS, "readwrite");
    const store = tx.objectStore(STORE_PRACTICALS);
    const getReq = store.get(id);
    getReq.onsuccess = () => {
      const existing = getReq.result as StoredPractical | undefined;
      if (!existing) {
        reject(new Error("Practical not found"));
        return;
      }
      const next: StoredPractical = { ...existing, ...updates } as StoredPractical;
      store.put(next);
    };
    getReq.onerror = () => reject(getReq.error || new Error("Failed to load practical"));
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error || new Error("Transaction failed"));
  });
}
