"use client";

import React from "react";
import SortableJS from "sortablejs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check } from "lucide-react";
import { toast } from "sonner";

/**
 * Highlights component (Thông tin nổi bật)
 * - Quản lý state nội bộ cho các mục nổi bật
 * - Cho phép thêm / xóa / kéo-thả để sắp xếp (SortableJS)
 * - Double-click vào mục để chỉnh sửa; khi đang chỉnh sửa chỉ hiện nút tick để lưu
 */

type HighlightItem = {
  id: string;
  text: string;
};

const Highlights: React.FC = () => {
  const [items, setItems] = React.useState<HighlightItem[]>([]);
  const [value, setValue] = React.useState<string>("");
  const listRef = React.useRef<HTMLDivElement | null>(null);
  const sortableRef = React.useRef<any>(null);

  // Editing state
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [editingValue, setEditingValue] = React.useState<string>("");
  const editInputRef = React.useRef<HTMLInputElement | null>(null);

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
        handle: ".drag-handle",
        onEnd: (evt: any) => {
          if (evt.oldIndex === undefined || evt.newIndex === undefined) return;
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
      console.error("SortableJS init error (Highlights):", err);
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

  // Focus input when entering edit mode
  React.useEffect(() => {
    if (editingId && editInputRef.current) {
      editInputRef.current.focus();
      // Move caret to end
      const val = editInputRef.current.value;
      editInputRef.current.setSelectionRange(val.length, val.length);
    }
  }, [editingId]);

  const addItem = () => {
    const txt = value.trim();
    if (!txt) {
      toast.error("Vui lòng nhập nội dung nổi bật.");
      return;
    }
    const newItem: HighlightItem = { id: `h-${Date.now()}`, text: txt };
    setItems((prev) => [...prev, newItem]);
    setValue("");
    toast.success("Đã thêm mục nổi bật.");
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    // If we removed the item that was being edited, clear edit state
    if (editingId === id) {
      setEditingId(null);
      setEditingValue("");
    }
    toast.success("Đã xóa mục nổi bật.");
  };

  const onKeyDownAdd = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addItem();
    }
  };

  const onKeyDownEdit = (e: React.KeyboardEvent<HTMLInputElement>, id: string) => {
    if (e.key === "Enter") {
      e.preventDefault();
      saveEdit(id);
    } else if (e.key === "Escape") {
      e.preventDefault();
      cancelEdit();
    }
  };

  const startEdit = (item: HighlightItem) => {
    setEditingId(item.id);
    setEditingValue(item.text);
  };

  const saveEdit = (id: string) => {
    const txt = editingValue.trim();
    if (!txt) {
      toast.error("Nội dung không được trống.");
      return;
    }
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, text: txt } : it)));
    setEditingId(null);
    setEditingValue("");
    toast.success("Đã lưu thay đổi.");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingValue("");
    toast.info("Đã hủy chỉnh sửa.");
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Input
          placeholder="Nhập thông tin nổi bật..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onKeyDownAdd}
          aria-label="Thông tin nổi bật"
        />
        <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={addItem}>Thêm</Button>
      </div>

      <div ref={listRef} className="space-y-2" aria-live="polite">
        {items.length === 0 ? (
          <div className="text-sm text-muted-foreground p-4 border rounded">Chưa có thông tin nổi bật nào.</div>
        ) : (
          items.map((it, idx) => (
            <div key={it.id} className="flex items-center gap-3 border rounded p-3 bg-white dark:bg-gray-800">
              <button
                className="drag-handle p-1 text-gray-400 cursor-move select-none"
                aria-label={`Kéo để thay đổi vị trí mục ${idx + 1}`}
                title="Kéo để thay đổi vị trí"
              >
                ☰
              </button>

              <div className="flex-1 flex items-center gap-3">
                <div className="h-8 w-8 flex items-center justify-center rounded-full bg-green-50 text-green-600">
                  <Check className="h-4 w-4" />
                </div>

                {/* Display text or input when editing */}
                {editingId === it.id ? (
                  <input
                    ref={editInputRef}
                    className="flex-1 text-sm bg-white border rounded px-2 py-1"
                    value={editingValue}
                    onChange={(e) => setEditingValue(e.target.value)}
                    onKeyDown={(e) => onKeyDownEdit(e, it.id)}
                    aria-label={`Chỉnh sửa mục ${idx + 1}`}
                  />
                ) : (
                  <div
                    className="text-sm break-words cursor-text"
                    onDoubleClick={() => startEdit(it)}
                    title="Double-click để chỉnh sửa"
                  >
                    {it.text}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                {/* Tick button only visible while editing this item */}
                {editingId === it.id && (
                  <Button
                    className="bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => saveEdit(it.id)}
                    aria-label="Lưu chỉnh sửa"
                    size="sm"
                  >
                    <Check className="w-4 h-4" />
                  </Button>
                )}

                <Button variant="ghost" className="text-red-600 hover:bg-red-50" onClick={() => removeItem(it.id)}>
                  Xóa
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      <p className="text-xs text-muted-foreground mt-2">Kéo-thả để thay đổi thứ tự các mục. Double-click vào mục để chỉnh sửa; khi đang chỉnh sửa nhấn tick để lưu.</p>
    </div>
  );
};

export default Highlights;