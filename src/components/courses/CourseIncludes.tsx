"use client";

import React, { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Book, FileText, Clock, FilePlus, Image, Link as LinkIcon, Play, Check } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import SortableJS from "sortablejs";

type BuiltInIconKey = "Book" | "FileText" | "Clock" | "FilePlus" | "Play" | "Image" | "Link";

const BUILT_IN_ICONS: Record<BuiltInIconKey, React.ComponentType<any>> = {
  Book,
  FileText,
  Clock,
  FilePlus,
  Play,
  Image,
  Link: LinkIcon,
};

const AVAILABLE_ICON_KEYS = Object.keys(BUILT_IN_ICONS) as BuiltInIconKey[];

interface CustomInclude {
  id: string;
  label: string;
  builtInKey: BuiltInIconKey;
}

const CourseIncludes: React.FC = () => {
  // Fixed fields state
  const [topics, setTopics] = useState<string>("");
  const [lessons, setLessons] = useState<string>("");
  const [exercises, setExercises] = useState<string>("");
  const [hours, setHours] = useState<string>("");

  // Custom fields state
  const [customLabel, setCustomLabel] = useState<string>("");
  const [selectedIconForNew, setSelectedIconForNew] = useState<BuiltInIconKey>("Book");

  const [customItems, setCustomItems] = useState<CustomInclude[]>([]);

  // dialog state for icon picker (target 'new' or item id)
  const [dialogOpenId, setDialogOpenId] = useState<string | null>(null);

  // Sortable ref
  const listRef = useRef<HTMLDivElement | null>(null);
  const sortableInstanceRef = useRef<any>(null);

  // Inline edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState<string>("");

  // Initialize Sortable safely
  useEffect(() => {
    const el = listRef.current;
    if (!el) return;

    try {
      if (sortableInstanceRef.current && typeof sortableInstanceRef.current.destroy === "function") {
        try {
          sortableInstanceRef.current.destroy();
        } catch {
          // ignore
        }
        sortableInstanceRef.current = null;
      }

      const sortable = SortableJS.create(el, {
        animation: 150,
        handle: ".drag-handle",
        onEnd: (evt: any) => {
          const oldIndex = evt.oldIndex;
          const newIndex = evt.newIndex;
          if (typeof oldIndex !== "number" || typeof newIndex !== "number") return;
          setCustomItems((prev) => {
            const items = [...prev];
            const [moved] = items.splice(oldIndex, 1);
            items.splice(newIndex, 0, moved);
            return items;
          });
        },
      });

      sortableInstanceRef.current = sortable;
    } catch (err) {
      // If SortableJS fails to initialize for any reason, do not crash the whole page.
      // Log and notify in dev, but keep the UI usable (users can still add/edit items, just no drag-drop).
      // eslint-disable-next-line no-console
      console.error("SortableJS init error in CourseIncludes:", err);
    }

    return () => {
      try {
        if (sortableInstanceRef.current && typeof sortableInstanceRef.current.destroy === "function") {
          sortableInstanceRef.current.destroy();
        }
      } catch {
        // swallow cleanup errors
      } finally {
        sortableInstanceRef.current = null;
      }
    };
    // We intentionally do not add `customItems` to deps; sortable is tied to the container element not items.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listRef.current]);

  // add new custom item
  const handleAddCustom = () => {
    const label = customLabel.trim();
    if (!label) {
      toast.error("Vui lòng nhập nội dung cho mục bổ sung.");
      return;
    }
    const newItem: CustomInclude = {
      id: `ci-${Date.now()}`,
      label,
      builtInKey: selectedIconForNew,
    };
    setCustomItems((prev) => [...prev, newItem]);
    setCustomLabel("");
    setSelectedIconForNew("Book");
    toast.success("Đã thêm mục 'Khóa học bao gồm'.");
  };

  const handleRemoveCustom = (id: string) => {
    setCustomItems((prev) => prev.filter((c) => c.id !== id));
    if (editingId === id) {
      setEditingId(null);
      setEditingText("");
    }
    toast.success("Đã xóa mục.");
  };

  const handleUpdateItemIcon = (id: string, key: BuiltInIconKey) => {
    if (id === "new") {
      setSelectedIconForNew(key);
      setDialogOpenId(null);
      return;
    }
    setCustomItems((prev) => prev.map((it) => (it.id === id ? { ...it, builtInKey: key } : it)));
    setDialogOpenId(null);
    toast.success("Đã cập nhật icon.");
  };

  // start inline edit
  const startInlineEdit = (item: CustomInclude) => {
    setEditingId(item.id);
    setEditingText(item.label);
  };

  // save inline edit
  const saveInlineEdit = (id: string) => {
    const trimmed = editingText.trim();
    if (!trimmed) {
      toast.error("Nội dung không được để trống.");
      return;
    }
    setCustomItems((prev) => prev.map((it) => (it.id === id ? { ...it, label: trimmed } : it)));
    setEditingId(null);
    setEditingText("");
    toast.success("Đã cập nhật mục.");
  };

  // cancel inline edit
  const cancelInlineEdit = () => {
    setEditingId(null);
    setEditingText("");
  };

  // render icon picker
  const renderIconPickerContent = (targetId: string | null) => {
    const isForNew = targetId === "new";
    const currentKey = isForNew ? selectedIconForNew : customItems.find((it) => it.id === targetId)?.builtInKey;

    return (
      <div className="p-2">
        <div className="grid grid-cols-4 gap-2">
          {AVAILABLE_ICON_KEYS.map((k) => {
            const isSelected = k === currentKey;
            return (
              <button
                key={k}
                onClick={() => handleUpdateItemIcon(targetId ?? "new", k)}
                className={cn(
                  "p-3 rounded-md flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700",
                  isSelected ? "ring-2 ring-orange-300" : ""
                )}
                aria-label={`Chọn icon ${k}`}
                title={k}
              >
                {React.createElement(BUILT_IN_ICONS[k], { className: "h-6 w-6 text-gray-700" })}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  // refs to focus inline edit input
  const editInputRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    if (editingId && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [editingId]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Khóa học bao gồm</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {/* Fixed 4 rows */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-3 flex-shrink-0">
                <Book className="h-5 w-5 text-gray-600" />
                <div className="text-sm text-gray-700 whitespace-nowrap">Số chuyên đề</div>
              </div>
              <div className="flex-1 min-w-0">
                <Input
                  value={topics}
                  onChange={(e) => setTopics(e.target.value)}
                  placeholder="Ví dụ: 20+ Chuyên đề"
                  className="w-full"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-3 flex-shrink-0">
                <FileText className="h-5 w-5 text-gray-600" />
                <div className="text-sm text-gray-700 whitespace-nowrap">Số bài học</div>
              </div>
              <div className="flex-1 min-w-0">
                <Input
                  value={lessons}
                  onChange={(e) => setLessons(e.target.value)}
                  placeholder="Ví dụ: 150+ Bài học"
                  className="w-full"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-3 flex-shrink-0">
                <FilePlus className="h-5 w-5 text-gray-600" />
                <div className="text-sm text-gray-700 whitespace-nowrap">Số bài tập</div>
              </div>
              <div className="flex-1 min-w-0">
                <Input
                  value={exercises}
                  onChange={(e) => setExercises(e.target.value)}
                  placeholder="Ví dụ: 200+ Bài tập"
                  className="w-full"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-3 flex-shrink-0">
                <Clock className="h-5 w-5 text-gray-600" />
                <div className="text-sm text-gray-700 whitespace-nowrap">Số giờ học</div>
              </div>
              <div className="flex-1 min-w-0">
                <Input
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                  placeholder="Ví dụ: 400+ Giờ học"
                  className="w-full"
                />
              </div>
            </div>
          </div>

          <hr className="my-2" />

          {/* Add custom items */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium">Thêm mục tùy chỉnh</div>
              <div className="text-xs text-muted-foreground">Nhập nội dung và chọn icon bên cạnh</div>
            </div>

            <div className="flex items-center gap-2">
              {/* Label text removed visually: keep label element for layout/accessibility but hidden visually */}
              <Label className="sr-only">Nội dung</Label>

              <div className="flex-1 flex items-center gap-2 min-w-0">
                <Input
                  value={customLabel}
                  onChange={(e) => setCustomLabel(e.target.value)}
                  placeholder="Ví dụ: 20+ Bài giảng livestream tương tác"
                  className="flex-1 min-w-0"
                />

                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => setDialogOpenId("new")}
                      className="h-9 w-9 rounded-md border flex items-center justify-center bg-white hover:bg-gray-50"
                      aria-label="Chọn icon"
                      title="Chọn icon"
                    >
                      <span className="sr-only">Chọn icon</span>
                      <div className="h-5 w-5 text-gray-600">{React.createElement(BUILT_IN_ICONS[selectedIconForNew], { className: "h-5 w-5" })}</div>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>Click để chọn icon</TooltipContent>
                </Tooltip>

                <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={handleAddCustom}>
                  Thêm
                </Button>
              </div>
            </div>
          </div>

          {/* Render custom items (sortable + inline edit) */}
          {customItems.length > 0 && (
            <div className="mt-3 space-y-2">
              <div ref={listRef} className="space-y-2" aria-live="polite">
                {customItems.map((it) => {
                  const IconComp = BUILT_IN_ICONS[it.builtInKey];
                  const isEditing = editingId === it.id;
                  return (
                    <div
                      key={it.id}
                      data-id={it.id}
                      className="flex items-center gap-3 justify-between border rounded px-3 py-2 bg-white dark:bg-gray-800"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <button
                          className="drag-handle cursor-move p-1 text-gray-400 hover:text-gray-600"
                          aria-label="Kéo để thay đổi vị trí"
                          title="Kéo để thay đổi vị trí"
                        >
                          ☰
                        </button>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              onClick={() => setDialogOpenId(it.id)}
                              className="h-8 w-8 rounded-md flex items-center justify-center bg-gray-100 hover:bg-gray-200"
                              aria-label="Bấm để thay đổi biểu tượng"
                              title="Bấm để thay đổi biểu tượng"
                            >
                              <IconComp className="h-4 w-4 text-gray-700" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>click để thay đổi icon</TooltipContent>
                        </Tooltip>

                        <div className="flex-1 min-w-0">
                          {isEditing ? (
                            <input
                              ref={editInputRef}
                              value={editingText}
                              onChange={(e) => setEditingText(e.target.value)}
                              onBlur={() => saveInlineEdit(it.id)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  saveInlineEdit(it.id);
                                } else if (e.key === "Escape") {
                                  e.preventDefault();
                                  cancelInlineEdit();
                                }
                              }}
                              className="w-full bg-transparent border-b border-dashed focus:border-solid focus:outline-none py-1 text-sm"
                              aria-label={`Chỉnh sửa nội dung ${it.label}`}
                            />
                          ) : (
                            <div
                              className="text-sm truncate cursor-text"
                              onDoubleClick={() => startInlineEdit(it)}
                              onClick={() => startInlineEdit(it)}
                              title="Nhấp để chỉnh sửa"
                            >
                              {it.label}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {isEditing ? (
                          <button
                            onClick={() => saveInlineEdit(it.id)}
                            title="Hoàn thành"
                            className="h-8 w-8 rounded-md bg-green-600 hover:bg-green-700 flex items-center justify-center text-white"
                            aria-label="Lưu"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                        ) : null}

                        <Button variant="ghost" size="icon" className="text-red-600" onClick={() => handleRemoveCustom(it.id)} aria-label={`Xóa ${it.label}`}>
                          Xóa
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Dialog used for icon selection (centered) */}
        <Dialog open={dialogOpenId !== null} onOpenChange={(open) => { if (!open) setDialogOpenId(null); }}>
          <DialogContent className="max-w-md w-full">
            <DialogHeader>
              <DialogTitle>Chọn icon</DialogTitle>
            </DialogHeader>

            <div className="mt-2">
              {renderIconPickerContent(dialogOpenId)}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpenId(null)}>Đóng</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default CourseIncludes;