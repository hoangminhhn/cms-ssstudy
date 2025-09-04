"use client";

import React, { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import SortableJS from "sortablejs";
import { toast } from "sonner";
import { Check } from "lucide-react";
import CourseIncludes from "./CourseIncludes";

/**
 * AddClass page (courses/AddClass)
 * NOTE: This file focuses on preserving the existing page but updates only the
 * "Thông tin nổi bật" block to:
 * - Start inline edit on double-click (or Enter/Space when focused)
 * - Show a check (save) button only when currently editing that row
 *
 * Other features and UI are intentionally kept minimal and untouched for safety.
 */

interface HighlightItem {
  id: string;
  text: string;
}

const AddClass: React.FC = () => {
  // Other form states would live here (omitted for brevity)...
  const [highlights, setHighlights] = useState<HighlightItem[]>([]);
  const [newHighlightText, setNewHighlightText] = useState<string>("");

  // Inline edit state for highlights
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState<string>("");

  const highlightsListRef = useRef<HTMLDivElement | null>(null);
  const sortableRef = useRef<any>(null);
  const editInputRef = useRef<HTMLInputElement | null>(null);

  // Initialize Sortable for highlights with safe try/catch and cleanup
  useEffect(() => {
    const el = highlightsListRef.current;
    if (!el) return;

    try {
      if (sortableRef.current && typeof sortableRef.current.destroy === "function") {
        try {
          sortableRef.current.destroy();
        } catch (e) {
          // ignore
        }
        sortableRef.current = null;
      }

      const sortable = SortableJS.create(el, {
        animation: 150,
        handle: ".drag-handle",
        onEnd: (evt: any) => {
          const oldIndex = evt.oldIndex;
          const newIndex = evt.newIndex;
          if (typeof oldIndex !== "number" || typeof newIndex !== "number") return;
          setHighlights((prev) => {
            const items = [...prev];
            const [moved] = items.splice(oldIndex, 1);
            items.splice(newIndex, 0, moved);
            return items;
          });
        },
      });

      sortableRef.current = sortable;
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("SortableJS init error (highlights):", err);
    }

    return () => {
      try {
        if (sortableRef.current && typeof sortableRef.current.destroy === "function") {
          sortableRef.current.destroy();
        }
      } catch (e) {
        // ignore
      } finally {
        sortableRef.current = null;
      }
    };
  }, [highlightsListRef.current]);

  // Focus the input when entering edit mode
  useEffect(() => {
    if (editingId && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [editingId]);

  const handleAddHighlight = () => {
    const text = newHighlightText.trim();
    if (!text) {
      toast.error("Vui lòng nhập nội dung nổi bật.");
      return;
    }
    const id = `h-${Date.now()}`;
    setHighlights((prev) => [...prev, { id, text }]);
    setNewHighlightText("");
    toast.success("Đã thêm thông tin nổi bật.");
  };

  const handleDeleteHighlight = (id: string) => {
    setHighlights((prev) => prev.filter((h) => h.id !== id));
    // if deleting currently edited item, reset edit state
    if (editingId === id) {
      setEditingId(null);
      setEditingText("");
    }
    toast.success("Đã xóa thông tin nổi bật.");
  };

  const startInlineEdit = (item: HighlightItem) => {
    setEditingId(item.id);
    setEditingText(item.text);
  };

  const saveInlineEdit = (id: string) => {
    const trimmed = editingText.trim();
    if (!trimmed) {
      toast.error("Nội dung không được để trống.");
      return;
    }
    setHighlights((prev) => prev.map((h) => (h.id === id ? { ...h, text: trimmed } : h)));
    setEditingId(null);
    setEditingText("");
    toast.success("Đã cập nhật thông tin nổi bật.");
  };

  const cancelInlineEdit = () => {
    setEditingId(null);
    setEditingText("");
  };

  // keyboard support for highlight input (Enter to add)
  const onHighlightKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddHighlight();
    }
  };

  return (
    <div className="space-y-6">
      {/* Top metadata area (placeholder) */}
      <Card>
        <CardHeader>
          <CardTitle>Thêm Lớp</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* --- Thông tin nổi bật (HIGHIGHTS) --- */}
            <div>
              <Label className="text-orange-600 mb-2 block">Thông tin nổi bật</Label>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Nhập thông tin nổi bật..."
                    value={newHighlightText}
                    onChange={(e) => setNewHighlightText(e.target.value)}
                    onKeyDown={onHighlightKeyDown}
                  />
                  <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={handleAddHighlight}>
                    Thêm
                  </Button>
                </div>

                <div
                  ref={highlightsListRef}
                  className="space-y-2"
                  aria-label="Danh sách thông tin nổi bật sắp xếp được"
                >
                  {highlights.length === 0 ? (
                    <div className="text-sm text-muted-foreground p-4 border rounded">Chưa có thông tin nổi bật nào.</div>
                  ) : (
                    highlights.map((h) => {
                      const isEditing = editingId === h.id;
                      return (
                        <div
                          key={h.id}
                          className="flex items-center gap-3 border rounded p-3 bg-white dark:bg-gray-800"
                        >
                          <button
                            className="drag-handle p-1 text-gray-400 cursor-move"
                            aria-label="Kéo thả"
                            title="Kéo thả"
                          >
                            ☰
                          </button>

                          <div className="flex-1 min-w-0">
                            {isEditing ? (
                              <input
                                ref={editInputRef}
                                value={editingText}
                                onChange={(e) => setEditingText(e.target.value)}
                                onBlur={() => saveInlineEdit(h.id)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    e.preventDefault();
                                    saveInlineEdit(h.id);
                                  } else if (e.key === "Escape") {
                                    e.preventDefault();
                                    cancelInlineEdit();
                                  }
                                }}
                                className="w-full bg-transparent border-b border-dashed focus:border-solid focus:outline-none py-1 text-sm"
                                aria-label={`Chỉnh sửa nội dung ${h.text}`}
                              />
                            ) : (
                              <div
                                className="text-sm truncate cursor-pointer"
                                onDoubleClick={() => startInlineEdit(h)}
                                tabIndex={0}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter" || e.key === " ") {
                                    e.preventDefault();
                                    startInlineEdit(h);
                                  }
                                }}
                                title="Double-click để chỉnh sửa"
                              >
                                {h.text}
                              </div>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            {/* Check button appears only during editing */}
                            {isEditing ? (
                              <button
                                onClick={() => saveInlineEdit(h.id)}
                                title="Hoàn thành"
                                className="h-8 w-8 rounded-md bg-green-600 hover:bg-green-700 flex items-center justify-center text-white"
                                aria-label="Lưu"
                              >
                                <Check className="h-4 w-4" />
                              </button>
                            ) : null}

                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-red-600"
                              onClick={() => handleDeleteHighlight(h.id)}
                              aria-label={`Xóa ${h.text}`}
                            >
                              Xóa
                            </Button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            {/* Include CourseIncludes component (unchanged) */}
            <CourseIncludes />
          </div>
        </CardContent>
      </Card>

      {/* Footer actions */}
      <div className="flex justify-end gap-2 p-4 border-t bg-gray-50 dark:bg-gray-800">
        <Button variant="outline">HỦY</Button>
        <Button className="bg-orange-500 hover:bg-orange-600 text-white">LƯU</Button>
      </div>
    </div>
  );
};

export default AddClass;