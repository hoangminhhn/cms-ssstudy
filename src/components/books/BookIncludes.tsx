"use client";

import React from "react";
import SortableJS from "sortablejs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Book, FileText, Clock, FilePlus, Image, Play, Link as LinkIcon, Check } from "lucide-react";
import { cn } from "@/lib/utils";

type IncludeItem = {
  id: string;
  title: string;
  source?: string;
  builtInKey?: BuiltInIconKey;
};

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

const BookIncludes: React.FC = () => {
  const [items, setItems] = React.useState<IncludeItem[]>([]);
  const [title, setTitle] = React.useState<string>("");
  const [source, setSource] = React.useState<string>("");
  const listRef = React.useRef<HTMLDivElement | null>(null);
  const sortableRef = React.useRef<any>(null);

  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [editTitle, setEditTitle] = React.useState<string>("");
  const [editSource, setEditSource] = React.useState<string>("");

  // Icon picker state
  const [dialogOpenId, setDialogOpenId] = React.useState<string | null>(null); // item id or "new"
  const [selectedIconForNew, setSelectedIconForNew] = React.useState<BuiltInIconKey>("Book");

  // Initialize Sortable safely
  React.useEffect(() => {
    const el = listRef.current;
    if (!el) return;

    try {
      if (sortableRef.current && typeof sortableRef.current.destroy === "function") {
        try {
          sortableRef.current.destroy();
        } catch {
          // ignore
        }
        sortableRef.current = null;
      }

      const sortable = SortableJS.create(el, {
        animation: 150,
        handle: ".bi-drag",
        onEnd: (evt: any) => {
          if (evt.oldIndex == null || evt.newIndex == null) return;
          setItems((prev) => {
            const copy = [...prev];
            const [moved] = copy.splice(evt.oldIndex, 1);
            copy.splice(evt.newIndex, 0, moved);
            return copy;
          });
        },
      });

      sortableRef.current = sortable;
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("BookIncludes sortable init error:", err);
    }

    return () => {
      try {
        if (sortableRef.current && typeof sortableRef.current.destroy === "function") {
          sortableRef.current.destroy();
        }
      } catch {
        // ignore
      } finally {
        sortableRef.current = null;
      }
    };
  }, [listRef.current]);

  const addItem = () => {
    const t = title.trim();
    if (!t) {
      toast.error("Vui lòng nhập tiêu đề tài nguyên.");
      return;
    }
    const newIt: IncludeItem = {
      id: `bi-${Date.now()}`,
      title: t,
      source: source.trim() || undefined,
      builtInKey: selectedIconForNew,
    };
    setItems((p) => [...p, newIt]);
    setTitle("");
    setSource("");
    setSelectedIconForNew("Book");
    toast.success("Đã thêm tài nguyên liên quan.");
  };

  const removeItem = (id: string) => {
    setItems((p) => p.filter((i) => i.id !== id));
    if (editingId === id) {
      setEditingId(null);
      setEditTitle("");
      setEditSource("");
    }
    toast.success("Đã xóa mục.");
  };

  const startEdit = (it: IncludeItem) => {
    setEditingId(it.id);
    setEditTitle(it.title);
    setEditSource(it.source ?? "");
  };

  const saveEdit = (id: string) => {
    const t = editTitle.trim();
    if (!t) {
      toast.error("Tiêu đề không được rỗng.");
      return;
    }
    setItems((p) => p.map((it) => (it.id === id ? { ...it, title: t, source: editSource.trim() || undefined } : it)));
    setEditingId(null);
    setEditTitle("");
    setEditSource("");
    toast.success("Đã lưu thay đổi.");
  };

  const handleOpenIconPicker = (id: string | "new") => {
    setDialogOpenId(id);
  };

  const handleUpdateIcon = (targetId: string, key: BuiltInIconKey) => {
    if (targetId === "new") {
      setSelectedIconForNew(key);
    } else {
      setItems((prev) => prev.map((it) => (it.id === targetId ? { ...it, builtInKey: key } : it)));
    }
    setDialogOpenId(null);
    toast.success("Đã cập nhật icon.");
  };

  const renderIconPickerContent = (targetId: string | null) => {
    const isForNew = targetId === "new";
    const currentKey = isForNew ? selectedIconForNew : items.find((it) => it.id === targetId)?.builtInKey ?? "Book";

    return (
      <div className="p-2">
        <div className="grid grid-cols-4 gap-2">
          {AVAILABLE_ICON_KEYS.map((k) => {
            const isSelected = k === currentKey;
            const IconComp = BUILT_IN_ICONS[k];
            return (
              <button
                key={k}
                onClick={() => handleUpdateIcon(targetId ?? "new", k)}
                className={cn(
                  "p-3 rounded-md flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700",
                  isSelected ? "ring-2 ring-orange-300" : ""
                )}
                aria-label={`Chọn icon ${k}`}
                title={k}
              >
                <IconComp className="h-6 w-6 text-gray-700" />
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    // outer container without Card border/background
    <div className="bg-transparent p-0">
      {/* inner compact box that holds the inputs & list (matches the screenshot's inner bordered box) */}
      <div className="rounded-lg p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        {/* Add row — compact sizes */}
        <div className="flex items-center gap-2 mb-3">
          <Input
            placeholder="Ví dụ: 15+ Chuyên đề"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="flex-1 h-9 text-sm"
            aria-label="Tên tài nguyên"
            onDoubleClick={() => {}} // keep default
          />

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => handleOpenIconPicker("new")}
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

          <Button className="h-9 px-3 text-sm bg-green-600 hover:bg-green-700 text-white" onClick={addItem}>Thêm</Button>
        </div>

        {/* List */}
        <div ref={listRef} className="space-y-2">
          {items.length === 0 ? (
            <div className="text-sm text-muted-foreground p-3 border rounded">Chưa có tài nguyên kèm theo.</div>
          ) : (
            items.map((it) => {
              const IconComp = BUILT_IN_ICONS[it.builtInKey ?? "Book"];
              const isEditing = editingId === it.id;
              return (
                <div
                  key={it.id}
                  className="flex items-center gap-3 rounded p-2 bg-gray-50 dark:bg-gray-900 hover:shadow-sm"
                >
                  <div className="bi-drag cursor-move text-gray-300 select-none pl-1 pr-1 text-sm">≡</div>

                  <div className="h-8 w-8 rounded-md bg-white dark:bg-gray-800 flex items-center justify-center text-gray-700 border">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => handleOpenIconPicker(it.id)}
                          className="p-1 rounded-md"
                          aria-label="Thay đổi icon"
                        >
                          <IconComp className="h-4 w-4" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>Click để thay đổi icon</TooltipContent>
                    </Tooltip>
                  </div>

                  <div className="flex-1 min-w-0">
                    {isEditing ? (
                      <input
                        autoFocus
                        className="w-full border-b border-gray-200 focus:border-gray-400 px-1 py-1 text-sm bg-transparent"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") saveEdit(it.id);
                          if (e.key === "Escape") {
                            setEditingId(null);
                            setEditTitle("");
                            setEditSource("");
                          }
                        }}
                      />
                    ) : (
                      <div
                        className="text-sm truncate cursor-text"
                        onDoubleClick={() => startEdit(it)}
                        title="Double-click để chỉnh sửa"
                      >
                        {it.title}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {isEditing ? (
                      <button
                        onClick={() => saveEdit(it.id)}
                        className="h-8 w-8 rounded-md bg-green-600 hover:bg-green-700 flex items-center justify-center text-white text-sm"
                        aria-label="Lưu"
                        title="Lưu"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                    ) : null}

                    <button
                      onClick={() => removeItem(it.id)}
                      className="text-sm text-red-600 hover:underline ml-1"
                      aria-label="Xóa"
                      title="Xóa"
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Icon picker dialog */}
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
      </div>
    </div>
  );
};

export default BookIncludes;