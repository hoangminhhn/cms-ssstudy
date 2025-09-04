"use client";

import React, { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Book, FileText, Clock, FilePlus, Image, Link as LinkIcon, Play, Check } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import SortableJS from "sortablejs";
import CourseIncludes from "./CourseIncludes";

const AddClass: React.FC = () => {
  // ... (all previous state and code unchanged) ...

  // -- Highlights (Thông tin nổi bật) feature --
  interface HighlightItem {
    id: string;
    text: string;
  }

  const [highlights, setHighlights] = useState<HighlightItem[]>([]);
  const [newHighlightText, setNewHighlightText] = useState("");
  const [editingHighlightId, setEditingHighlightId] = useState<string | null>(null);
  const [editingHighlightText, setEditingHighlightText] = useState<string>("");

  const highlightsListRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!highlightsListRef.current) return;

    const sortable = SortableJS.create(highlightsListRef.current, {
      animation: 150,
      handle: ".drag-handle",
      onEnd: (evt) => {
        if (evt.oldIndex === undefined || evt.newIndex === undefined) return;
        setHighlights((prev) => {
          const items = [...prev];
          const [moved] = items.splice(evt.oldIndex, 1);
          items.splice(evt.newIndex, 0, moved);
          return items;
        });
      },
    });

    return () => sortable.destroy();
  }, [highlightsListRef.current]);

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
    if (editingHighlightId === id) {
      setEditingHighlightId(null);
      setEditingHighlightText("");
    }
    toast.success("Đã xóa thông tin nổi bật.");
  };

  // Inline edit handlers for highlights
  const startHighlightEdit = (id: string, text: string) => {
    setEditingHighlightId(id);
    setEditingHighlightText(text);
  };

  const saveHighlightEdit = (id: string) => {
    const trimmed = editingHighlightText.trim();
    if (!trimmed) {
      toast.error("Nội dung không được để trống.");
      return;
    }
    setHighlights((prev) => prev.map((h) => (h.id === id ? { ...h, text: trimmed } : h)));
    setEditingHighlightId(null);
    setEditingHighlightText("");
    toast.success("Đã cập nhật thông tin nổi bật.");
  };

  const cancelHighlightEdit = () => {
    setEditingHighlightId(null);
    setEditingHighlightText("");
  };

  // Small helper for keyboard add (Enter)
  const onHighlightKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddHighlight();
    }
  };

  // Ref for input focus
  const highlightInputRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    if (editingHighlightId && highlightInputRef.current) {
      highlightInputRef.current.focus();
      highlightInputRef.current.select();
    }
  }, [editingHighlightId]);

  // Add missing handleCancel function to reset highlights and inputs
  const handleCancel = () => {
    setNewHighlightText("");
    setHighlights([]);
    setEditingHighlightId(null);
    setEditingHighlightText("");
    toast.info("Đã hủy thay đổi.");
  };

  // ... (rest of AddClass component unchanged) ...

  return (
    <div className="space-y-6">
      {/* ... all previous cards and content unchanged ... */}

      <Card>
        <CardHeader>
          <CardTitle className="text-orange-600">Thông tin nổi bật</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Input
                placeholder="Nhập thông tin nổi bật..."
                value={newHighlightText}
                onChange={(e) => setNewHighlightText(e.target.value)}
                onKeyDown={onHighlightKeyDown}
                aria-label="Nhập thông tin nổi bật"
              />
              <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={handleAddHighlight}>
                Thêm
              </Button>
            </div>

            <div ref={highlightsListRef} className="space-y-2" aria-label="Danh sách thông tin nổi bật sắp xếp được">
              {highlights.length === 0 ? (
                <div className="text-sm text-muted-foreground p-4 border rounded">Chưa có thông tin nổi bật nào.</div>
              ) : (
                highlights.map((h) => {
                  const isEditing = editingHighlightId === h.id;
                  return (
                    <div
                      key={h.id}
                      className="flex items-center gap-3 border rounded p-3 bg-white dark:bg-gray-800"
                    >
                      <button
                        className="drag-handle p-1 text-gray-400 hover:text-gray-600 cursor-move"
                        aria-label="Kéo để thay đổi vị trí"
                        title="Kéo để thay đổi vị trí"
                      >
                        ☰
                      </button>

                      <div className="flex-1 min-w-0">
                        {isEditing ? (
                          <input
                            ref={highlightInputRef}
                            value={editingHighlightText}
                            onChange={(e) => setEditingHighlightText(e.target.value)}
                            onBlur={() => saveHighlightEdit(h.id)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                saveHighlightEdit(h.id);
                              } else if (e.key === "Escape") {
                                e.preventDefault();
                                cancelHighlightEdit();
                              }
                            }}
                            className="w-full bg-transparent border-b border-dashed focus:border-solid focus:outline-none py-1 text-sm"
                            aria-label={`Chỉnh sửa thông tin nổi bật`}
                          />
                        ) : (
                          <div
                            className="text-sm truncate cursor-text"
                            onClick={() => startHighlightEdit(h.id, h.text)}
                            onDoubleClick={() => startHighlightEdit(h.id, h.text)}
                            title="Nhấp hoặc nhấp đúp để chỉnh sửa"
                          >
                            {h.text}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {isEditing && (
                          <button
                            onClick={() => saveHighlightEdit(h.id)}
                            title="Hoàn thành"
                            className="h-8 w-8 rounded-md bg-green-600 hover:bg-green-700 flex items-center justify-center text-white"
                            aria-label="Lưu"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                        )}

                        <Button variant="ghost" size="icon" className="text-red-600" onClick={() => handleDeleteHighlight(h.id)} aria-label={`Xóa thông tin nổi bật`}>
                          Xóa
                        </Button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <p className="text-sm text-muted-foreground">Kéo-thả để thay đổi thứ tự các mục.</p>
          </div>
        </CardContent>
      </Card>

      {/* ... rest of AddClass component unchanged ... */}

      <div className="flex justify-end gap-2 p-4 border-t bg-gray-50 dark:bg-gray-800">
        <Button variant="outline" onClick={handleCancel}>HỦY</Button>
        <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={handleSave}>LƯU</Button>
      </div>
    </div>
  );
};

export default AddClass;