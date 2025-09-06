"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { toast } from "sonner";
import { Book, FileText, Clock, FilePlus, Play, Image, Link as LinkIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type BuiltInIconKey = "Book" | "FileText" | "Clock" | "FilePlus" | "Play" | "Image" | "Link";
const ICONS: Record<BuiltInIconKey, React.ComponentType<any>> = {
  Book,
  FileText,
  Clock,
  FilePlus,
  Play,
  Image,
  Link: LinkIcon,
};

type CustomInclude = {
  id: string;
  label: string;
  icon: BuiltInIconKey;
};

const DEFAULT_ICON: BuiltInIconKey = "Book";

const BookCourseIncludes: React.FC = () => {
  // Fixed fields
  const [topics, setTopics] = React.useState("");
  const [lessons, setLessons] = React.useState("");
  const [exercises, setExercises] = React.useState("");
  const [hours, setHours] = React.useState("");

  // Custom items (isolated to this component)
  const [customLabel, setCustomLabel] = React.useState("");
  const [customIcon, setCustomIcon] = React.useState<BuiltInIconKey>(DEFAULT_ICON);
  const [customItems, setCustomItems] = React.useState<CustomInclude[]>([]);

  // Inline edit state
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [editingText, setEditingText] = React.useState<string>("");

  const addCustom = () => {
    const txt = customLabel.trim();
    if (!txt) {
      toast.error("Vui lòng nhập nội dung mục bổ sung.");
      return;
    }
    const item: CustomInclude = { id: `ci-${Date.now()}`, label: txt, icon: customIcon };
    setCustomItems((s) => [...s, item]);
    setCustomLabel("");
    setCustomIcon(DEFAULT_ICON);
    toast.success("Đã thêm mục.");
  };

  const removeCustom = (id: string) => {
    setCustomItems((s) => s.filter((it) => it.id !== id));
    if (editingId === id) {
      setEditingId(null);
      setEditingText("");
    }
    toast.success("Đã xóa mục.");
  };

  const startEdit = (it: CustomInclude) => {
    setEditingId(it.id);
    setEditingText(it.label);
  };

  const saveEdit = (id: string) => {
    const txt = editingText.trim();
    if (!txt) {
      toast.error("Nội dung không được để trống.");
      return;
    }
    setCustomItems((s) => s.map((it) => (it.id === id ? { ...it, label: txt } : it)));
    setEditingId(null);
    setEditingText("");
    toast.success("Đã lưu thay đổi.");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingText("");
    toast.info("Đã hủy chỉnh sửa.");
  };

  const changeIcon = (id: string, icon: BuiltInIconKey) => {
    setCustomItems((s) => s.map((it) => (it.id === id ? { ...it, icon } : it)));
    toast.success("Đã cập nhật icon.");
  };

  return (
    <Card className="border-0 shadow-none bg-transparent">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Khóa học bao gồm</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {/* Fixed fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Label className="text-sm">Số chuyên đề</Label>
              <Input value={topics} onChange={(e) => setTopics(e.target.value)} placeholder="Ví dụ: 20+ chuyên đề" />
            </div>
            <div>
              <Label className="text-sm">Số bài học</Label>
              <Input value={lessons} onChange={(e) => setLessons(e.target.value)} placeholder="Ví dụ: 150+ bài" />
            </div>
            <div>
              <Label className="text-sm">Số bài tập</Label>
              <Input value={exercises} onChange={(e) => setExercises(e.target.value)} placeholder="Ví dụ: 200+ bài tập" />
            </div>
            <div>
              <Label className="text-sm">Số giờ học</Label>
              <Input value={hours} onChange={(e) => setHours(e.target.value)} placeholder="Ví dụ: 400+ giờ" />
            </div>
          </div>

          <hr />

          {/* Add custom item */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_160px_120px] gap-2 items-center">
            <div>
              <Label className="text-sm">Thêm mục tùy chỉnh</Label>
              <Input
                value={customLabel}
                onChange={(e) => setCustomLabel(e.target.value)}
                placeholder="Ví dụ: Hỗ trợ trắc nghiệm, Livestream tương tác..."
              />
            </div>

            <div>
              <Label className="text-sm">Icon</Label>
              <Select value={customIcon} onValueChange={(v) => setCustomIcon(v as BuiltInIconKey)}>
                <SelectTrigger className="w-full h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(ICONS).map((k) => (
                    <SelectItem key={k} value={k}>
                      <div className="inline-flex items-center gap-2">
                        {React.createElement(ICONS[k as BuiltInIconKey], { className: "h-4 w-4" })}
                        <span>{k}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button className="w-full bg-green-600 hover:bg-green-700 text-white" onClick={addCustom}>
                Thêm
              </Button>
            </div>
          </div>

          {/* Custom items list (no drag/drop - isolated behavior) */}
          <div className="space-y-2">
            {customItems.length === 0 ? (
              <div className="text-sm text-muted-foreground p-3 border rounded">Chưa có mục bổ sung.</div>
            ) : (
              customItems.map((it) => {
                const Icon = ICONS[it.icon];
                const isEditing = editingId === it.id;
                return (
                  <div key={it.id} className="flex items-center justify-between gap-3 border rounded p-2 bg-white">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="p-1 rounded bg-gray-100">
                        <Icon className="h-5 w-5 text-gray-700" />
                      </div>

                      <div className="min-w-0 flex-1">
                        {isEditing ? (
                          <input
                            value={editingText}
                            onChange={(e) => setEditingText(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                saveEdit(it.id);
                              } else if (e.key === "Escape") {
                                cancelEdit();
                              }
                            }}
                            className="w-full border-b px-2 py-1 text-sm"
                            aria-label="Chỉnh sửa mục"
                          />
                        ) : (
                          <div
                            className="text-sm truncate cursor-pointer"
                            onDoubleClick={() => startEdit(it)}
                            title="Nhấp hoặc double-click để chỉnh sửa"
                          >
                            {it.label}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* icon selector per item */}
                      <Select value={it.icon} onValueChange={(v) => changeIcon(it.id, v as BuiltInIconKey)}>
                        <SelectTrigger className="h-9 w-36">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.keys(ICONS).map((k) => (
                            <SelectItem key={k} value={k}>
                              <div className="inline-flex items-center gap-2">
                                {React.createElement(ICONS[k as BuiltInIconKey], { className: "h-4 w-4" })}
                                <span>{k}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      {isEditing ? (
                        <>
                          <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" onClick={() => saveEdit(it.id)}>
                            Lưu
                          </Button>
                          <Button variant="outline" size="sm" onClick={cancelEdit}>
                            Hủy
                          </Button>
                        </>
                      ) : (
                        <Button variant="ghost" size="sm" className="text-red-600" onClick={() => removeCustom(it.id)}>
                          Xóa
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BookCourseIncludes;