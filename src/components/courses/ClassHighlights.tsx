"use client";

import React, { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Check } from "lucide-react";
import SortableJS from "sortablejs";

interface HighlightItem {
  id: string;
  text: string;
}

const ClassHighlights: React.FC = () => {
  const [highlights, setHighlights] = useState<HighlightItem[]>([]);
  const [newText, setNewText] = useState("");
  const listRef = useRef<HTMLDivElement | null>(null);
  const sortableRef = useRef<any>(null);

  useEffect(() => {
    const el = listRef.current;
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
      // Do not crash page if Sortable fails
      // eslint-disable-next-line no-console
      console.error("SortableJS (highlights) init error:", err);
    }

    return () => {
      try {
        if (sortableRef.current && typeof sortableRef.current.destroy === "function") {
          sortableRef.current.destroy();
        }
      } catch (e) {
        // swallow
      } finally {
        sortableRef.current = null;
      }
    };
  }, [listRef.current]);

  const addHighlight = () => {
    const t = newText.trim();
    if (!t) {
      toast.error("Nhập nội dung trước khi thêm.");
      return;
    }
    setHighlights((prev) => [...prev, { id: `h-${Date.now()}`, text: t }]);
    setNewText("");
    toast.success("Đã thêm mục.");
  };

  const removeHighlight = (id: string) => {
    setHighlights((prev) => prev.filter((h) => h.id !== id));
    toast.success("Đã xóa mục.");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Thông tin nổi bật</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Input placeholder="Nhập nội dung nổi bật..." value={newText} onChange={(e) => setNewText(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addHighlight(); } }} />
            <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={addHighlight}>Thêm</Button>
          </div>

          <div ref={listRef} className="space-y-2" aria-live="polite">
            {highlights.length === 0 ? (
              <div className="text-sm text-muted-foreground p-4 border rounded">Chưa có mục nổi bật.</div>
            ) : (
              highlights.map((h) => (
                <div key={h.id} className="flex items-center gap-3 border rounded p-3 bg-white dark:bg-gray-800">
                  <button className="drag-handle p-1 text-gray-400 cursor-move" aria-label="Kéo thay đổi vị trí">☰</button>
                  <div className="flex-1">{h.text}</div>
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 flex items-center justify-center rounded-full bg-green-50 text-green-600"><Check className="h-4 w-4" /></div>
                    <Button variant="ghost" className="text-red-600" onClick={() => removeHighlight(h.id)}>Xóa</Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClassHighlights;