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
 * - Có keyboard support (Enter để thêm)
 *
 * Tách riêng để khi muốn chỉnh sửa chỉ cần sửa file này mà không ảnh hưởng tới AddClass.
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

  React.useEffect(() => {
    const el = listRef.current;
    if (!el) return;

    try {
      // destroy previous instance if present
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
      // avoid crashing the app if Sortable fails to initialize
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
    toast.success("Đã xóa mục nổi bật.");
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addItem();
    }
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Input
          placeholder="Nhập thông tin nổi bật..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onKeyDown}
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
                <div className="text-sm break-words">{it.text}</div>
              </div>

              <div>
                <Button variant="ghost" className="text-red-600 hover:bg-red-50" onClick={() => removeItem(it.id)}>
                  Xóa
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      <p className="text-xs text-muted-foreground mt-2">Kéo-thả để thay đổi thứ tự các mục.</p>
    </div>
  );
};

export default Highlights;