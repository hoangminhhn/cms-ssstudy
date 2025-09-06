"use client";

import React from "react";
import SortableJS from "sortablejs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

/**
 * BookHighlights
 * - Manage short highlight lines for a book (e.g. "Bán chạy", "Có giải chi tiết", ...)
 * - Add, inline edit, delete, reorder via SortableJS
 * - Distinct from other 'Highlights' components by labels and structure
 */

type Highlight = {
  id: string;
  text: string;
};

const BookHighlights: React.FC = () => {
  const [items, setItems] = React.useState<Highlight[]>([]);
  const [value, setValue] = React.useState<string>("");
  const listRef = React.useRef<HTMLDivElement | null>(null);
  const sortableRef = React.useRef<any>(null);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [editingText, setEditingText] = React.useState<string>("");

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
        handle: ".bh-drag",
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
      console.error("BookHighlights Sortable init error:", err);
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
    const txt = value.trim();
    if (!txt) {
      toast.error("Vui lòng nhập nội dung nổi bật.");
      return;
    }
    const it = { id: `bh-${Date.now()}`, text: txt };
    setItems((p) => [...p, it]);
    setValue("");
    toast.success("Đã thêm điểm nổi bật sách.");
  };

  const removeItem = (id: string) => {
    setItems((p) => p.filter((i) => i.id !== id));
    if (editingId === id) {
      setEditingId(null);
      setEditingText("");
    }
    toast.success("Đã xóa mục.");
  };

  const startEdit = (it: Highlight) => {
    setEditingId(it.id);
    setEditingText(it.text);
  };

  const saveEdit = (id: string) => {
    const v = editingText.trim();
    if (!v) {
      toast.error("Nội dung không được rỗng.");
      return;
    }
    setItems((p) => p.map((it) => (it.id === id ? { ...it, text: v } : it)));
    setEditingId(null);
    setEditingText("");
    toast.success("Đã lưu thay đổi.");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingText("");
    toast.info("Đã hủy chỉnh sửa.");
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Input
          placeholder="Thêm điểm nổi bật cho sách, ví dụ: 'Kèm đáp án chi tiết'"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addItem();
            }
          }}
        />
        <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={addItem}>
          Thêm
        </Button>
      </div>

      <div ref={listRef} className="space-y-2" aria-live="polite">
        {items.length === 0 ? (
          <div className="text-sm text-muted-foreground p-3 border rounded">Chưa có điểm nổi bật cho sách.</div>
        ) : (
          items.map((it, idx) => (
            <div key={it.id} className="flex items-center gap-3 border rounded p-2 bg-white dark:bg-gray-800">
              <button
                aria-label={`Kéo phần ${idx + 1}`}
                title="Kéo để sắp xếp"
                className="bh-drag cursor-move text-gray-400 p-1 select-none"
              >
                ☰
              </button>

              <div className="flex-1 min-w-0">
                {editingId === it.id ? (
                  <input
                    className="w-full bg-transparent border-b px-2 py-1 text-sm"
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") saveEdit(it.id);
                      if (e.key === "Escape") cancelEdit();
                    }}
                  />
                ) : (
                  <div
                    className="text-sm truncate cursor-text"
                    onDoubleClick={() => startEdit(it)}
                    title="Double-click để chỉnh sửa"
                  >
                    {it.text}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                {editingId === it.id ? (
                  <>
                    <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" onClick={() => saveEdit(it.id)}>
                      Lưu
                    </Button>
                    <Button variant="outline" size="sm" onClick={cancelEdit}>
                      Hủy
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="ghost" size="icon" onClick={() => startEdit(it)} title="Chỉnh sửa">
                      Sửa
                    </Button>
                    <Button variant="ghost" size="icon" className="text-red-600" onClick={() => removeItem(it.id)} title="Xóa">
                      Xóa
                    </Button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="text-xs text-muted-foreground">Kéo-thả để sắp xếp. Double-click để chỉnh sửa.</div>
    </div>
  );
};

export default BookHighlights;