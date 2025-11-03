"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { getAllPracticals, updatePractical } from "@/lib/idb";
import type { StoredPractical } from "@/lib/types";
import { Input } from "@/components/ui/input";
import dynamic from "next/dynamic";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

export default function EditorPage() {
  const [practicals, setPracticals] = useState<StoredPractical[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [markdown, setMarkdown] = useState("");
  const [title, setTitle] = useState("");
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const all = await getAllPracticals();
        setPracticals(all.sort((a, b) => b.createdAt - a.createdAt));
        if (all.length && !selectedId) {
          setSelectedId(all[0].id);
          setMarkdown(all[0].markdown || "");
          setTitle(all[0].aim || "");
        }
      } catch (e) {
        console.error("Failed to load practicals", e);
      }
    })();
  }, [selectedId]);

  const selected = useMemo(
    () => practicals.find((p) => p.id === selectedId) || null,
    [practicals, selectedId]
  );

  // removed effect for syncing selection -> editor; handled in click handler and initial load

  // Helper to perform an immediate save (used by debounce and before selection change)
  const doSave = async (id: string, nextTitle: string, nextMarkdown: string) => {
    try {
      setIsSaving(true);
      await updatePractical(id, {
        markdown: nextMarkdown,
        aim: nextTitle,
        updatedAt: Date.now(),
      });
      setLastSavedAt(Date.now());
    } catch (e) {
      console.error("Failed to save practical", e);
    } finally {
      setIsSaving(false);
    }
  };

  // Debounced save of markdown and title changes
  useEffect(() => {
    if (!selectedId) return;
  if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      // fire-and-forget; doSave handles its own state
      void doSave(selectedId, title, markdown);
    }, 500);

    return () => {
  if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [markdown, title, selectedId]);

  return (
    <div className="flex h-screen">
      {/* Left sidebar: practical canvases */}
      <aside className="w-72 border-r overflow-y-auto p-3 space-y-2">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-semibold">Practicals</h2>
        </div>
        {practicals.map((p) => (
          <button
            key={p.id}
            onClick={async () => {
              // Save current selection immediately before switching
              if (saveTimer.current) clearTimeout(saveTimer.current);
              if (selectedId) {
                await doSave(selectedId, title, markdown);
              }
              setSelectedId(p.id);
              setMarkdown(p.markdown || "");
              setTitle(p.aim || "");
            }}
            className={
              "w-full text-left rounded-md border p-3 hover:bg-accent transition-colors" +
              (p.id === selectedId ? " bg-accent" : "")
            }
          >
            <div className="text-sm font-medium line-clamp-1">{p.aim || "Untitled"}</div>
            <div className="text-xs text-muted-foreground line-clamp-2 mt-1">
              {p.markdown || "(empty)"}
            </div>
          </button>
        ))}
      </aside>

      {/* Center editor */}
      <main className="flex-1 h-full p-4 overflow-y-auto">
        {selected ? (
          <div className="max-w-4xl mx-auto space-y-3">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Practical title"
              aria-label="Practical title"
            />
            <div className="flex items-center justify-end text-xs text-muted-foreground">
              {isSaving ? (
                <span>Saving…</span>
              ) : lastSavedAt ? (
                <span>Saved {new Date(lastSavedAt).toLocaleTimeString()}</span>
              ) : (
                <span>Not saved yet</span>
              )}
            </div>
            <div data-color-mode="auto">
              <MDEditor
                value={markdown}
                onChange={(v) => setMarkdown(v || "")}
                height={Math.max(300, typeof window !== "undefined" ? window.innerHeight - 220 : 600)}
                preview="live"
              />
            </div>
          </div>
        ) : (
          <div className="h-full grid place-items-center">
            <p className="text-muted-foreground">No practical selected.</p>
          </div>
        )}
      </main>
    </div>
  );
}
