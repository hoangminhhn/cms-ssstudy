"use client";

import React from "react";
import SortableJS from "sortablejs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

/**
 * BookIncludes
 * - Manage a small list of related resources for a book: recommended books or materials.
 * - Each item: title + source (e.g., publisher or link)
 * - Supports add, inline edit, delete, reorder (SortableJS)
 * - Distinct component specifically named for books to avoid duplication
 */

type IncludeItem = {
  id: string;
  title: string;
  source?: string;
};

const BookIncludes: React.FC = () => {
  const [items, setItems] = React.useState<IncludeItem[]>([]);
  const [title, setTitle] = React.useState<string>("");
  const [source, setSource] = React.useState<string>("");
  const listRef = React.useRef<HTMLDivElement | null>(null);
  const sortableRef = React.useRef<any>(null);

  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [editTitle, setEditTitle] = React.useState<string>("");
  const [editSource, setEditSource] = React.useState<string>("");

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
    const newIt: IncludeItem = { id: `bi-${Date.now()}`, title: t, source: source.trim() || undefined };
    setItems((p) => [...p, newIt]);
    setTitle("");
    setSource("");
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

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <Input
          placeholder="Tên sách / tài nguyên đề xuất"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="sm:col-span-2"
        />
        <Input placeholder="Nguồn / Nhà xuất bản / Link" value={source} onChange={(e) => setSource(e.target.value)} />
      </div>
      <div className="flex justify-end">
        <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={addItem}>
          Thêm tài nguyên
        </Button>
      </div>

      <div ref={listRef} className="space-y-2">
        {items.length === 0 ? (
          <div className="text-sm text-muted-foreground p-3 border rounded">Chưa có tài nguyên kèm theo.</div>
        ) : (
          items.map((it, idx) => (
            <div key={it.id} className="flex items-start gap-3 border rounded p-3 bg-white dark:bg-gray-800">
              <div className="bi-drag cursor-move text-gray-400 select-none pt-1">≡</div>

              <div className="flex-1 min-w-0">
                {editingId === it.id ? (
                  <div className="grid grid-cols-1 gap-2">
                    <input
                      className="w-full border-b px-2 py-1"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      placeholder="Tiêu đề"
                    />
                    <input
                      className="w-full border-b px-2 py-1"
                      value={editSource}
                      onChange={(e) => setEditSource(e.target.value)}
                      placeholder="Nguồn / Link"
                    />
                  </div>
                ) : (
                  <>
                    <div className="font-medium text-sm truncate">{it.title}</div>
                    <div className="text-xs text-muted-foreground">{it.source ?? "Không có nguồn"}</div>
                  </>
                )}
              </div>

              <div className="flex flex-col gap-2">
                {editingId === it.id ? (
                  <>
                    <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" onClick={() => saveEdit(it.id)}>Lưu</Button>
                    <Button variant="outline" size="sm" onClick={() => { setEditingId(null); setEditTitle(""); setEditSource(""); }}>Hủy</Button>
                  </>
                ) : (
                  <>
                    <Button variant="ghost" size="icon" onClick={() => startEdit(it)}>Sửa</Button>
                    <Button variant="ghost" size="icon" className="text-red-600" onClick={() => removeItem(it.id)}>Xóa</Button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="text-xs text-muted-foreground">Danh sách sách/tài liệu kèm theo có thể được sắp xếp bằng cách kéo.</div>
    </div>
  );
};

export default BookIncludes;