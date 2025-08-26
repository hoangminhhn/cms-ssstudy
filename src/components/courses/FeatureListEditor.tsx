import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Trash, Check, GripVertical } from "lucide-react";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "@hello-pangea/dnd";

export type FeatureItem = {
  id: string;
  text: string;
  highlighted?: boolean;
  visible?: boolean;
};

type Props = {
  initialItems?: FeatureItem[];
  onChange?: (items: FeatureItem[]) => void;
};

const makeId = () => String(Date.now() + Math.round(Math.random() * 10000));

export default function FeatureListEditor({ initialItems = [], onChange }: Props) {
  const [items, setItems] = useState<FeatureItem[]>(
    initialItems.length ? initialItems : [
      { id: makeId(), text: "Giáo viên giàu kinh nghiệm", highlighted: false, visible: true },
      { id: makeId(), text: "Lộ trình rõ ràng theo năng lực", highlighted: false, visible: true },
      { id: makeId(), text: "Tài liệu học kèm cập nhật", highlighted: false, visible: true },
    ]
  );

  useEffect(() => {
    onChange?.(items);
  }, [items, onChange]);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const newItems = Array.from(items);
    const [removed] = newItems.splice(result.source.index, 1);
    newItems.splice(result.destination.index, 0, removed);
    setItems(newItems);
  };

  const addItem = () => {
    setItems((s) => [...s, { id: makeId(), text: "Nội dung mới", highlighted: false, visible: true }]);
  };

  const removeItem = (id: string) => {
    setItems((s) => s.filter((i) => i.id !== id));
  };

  const updateText = (id: string, text: string) => {
    setItems((s) => s.map((it) => (it.id === id ? { ...it, text } : it)));
  };

  const toggleHighlight = (id: string) => {
    setItems((s) => s.map((it) => (it.id === id ? { ...it, highlighted: !it.highlighted } : it)));
  };

  const toggleVisible = (id: string) => {
    setItems((s) => s.map((it) => (it.id === id ? { ...it, visible: !it.visible } : it)));
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Danh sách tính năng / lợi ích (Feature List)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Editor column */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm font-medium text-orange-600">Chỉnh sửa mục</div>
                <div className="flex items-center gap-2">
                  <Button size="sm" onClick={addItem} className="bg-green-500 hover:bg-green-600 text-white">Thêm mục</Button>
                </div>
              </div>

              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="features-droppable">
                  {(provided) => (
                    <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-2">
                      {items.map((it, idx) => (
                        <Draggable key={it.id} draggableId={it.id} index={idx}>
                          {(draggableProvided) => (
                            <div
                              ref={draggableProvided.innerRef}
                              {...draggableProvided.draggableProps}
                              className="flex items-start gap-2 p-3 border rounded-md bg-white"
                            >
                              <div {...draggableProvided.dragHandleProps} className="pt-1 cursor-grab">
                                <GripVertical className="text-muted-foreground" />
                              </div>

                              <div className="flex-1">
                                <Input
                                  value={it.text}
                                  onChange={(e) => updateText(it.id, e.target.value)}
                                  className="mb-2"
                                />
                                <div className="flex items-center gap-3">
                                  <div className="flex items-center gap-2">
                                    <Switch checked={!!it.highlighted} onCheckedChange={() => toggleHighlight(it.id)} />
                                    <span className="text-sm">Nổi bật</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Switch checked={!!it.visible} onCheckedChange={() => toggleVisible(it.id)} />
                                    <span className="text-sm">Hiển thị</span>
                                  </div>
                                </div>
                              </div>

                              <div className="flex flex-col items-end gap-2">
                                <button
                                  onClick={() => removeItem(it.id)}
                                  aria-label="Xóa mục"
                                  className="p-1 rounded hover:bg-red-50"
                                >
                                  <Trash className="text-red-600" />
                                </button>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}

                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </div>

            {/* Preview column */}
            <div>
              <div className="mb-3 flex items-center justify-between">
                <div className="text-sm font-medium text-orange-600">Xem trước</div>
                <div className="text-xs text-muted-foreground">Desktop: 2 cột • Mobile: 1 cột</div>
              </div>

              <div className="p-4 border rounded-md bg-white">
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {items.filter(it => it.visible).map((it) => (
                    <li key={it.id} className={`flex items-start gap-3 p-2 rounded ${it.highlighted ? "bg-yellow-50 border border-yellow-100" : ""}`}>
                      <div className="mt-1">
                        <Check className={`h-5 w-5 ${it.highlighted ? "text-yellow-600" : "text-green-600"}`} />
                      </div>
                      <div className="text-sm leading-snug text-gray-700">{it.text}</div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="text-xs text-muted-foreground mt-2">Icon cố định: dấu tick (Check). Bạn có thể sắp xếp, bật/tắt và đánh dấu nổi bật cho từng mục.</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}