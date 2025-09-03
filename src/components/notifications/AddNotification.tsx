"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const classOptions = [
  "Chọn lớp",
  "Lớp 1",
  "Lớp 2",
  "Lớp 3",
  "Lớp 4",
  "Lớp 5",
  "Lớp 6",
  "Lớp 7",
  "Lớp 8",
  "Lớp 9",
  "Lớp 10",
  "Lớp 11",
  "Lớp 12",
];

const notificationTypes = [
  { value: "all", label: "Toàn bộ" },
  { value: "class", label: "Lớp" },
  { value: "group", label: "Nhóm" },
  { value: "custom", label: "Tùy chọn" },
];

const AddNotification: React.FC = () => {
  const navigate = useNavigate();

  const [title, setTitle] = React.useState("");
  const [content, setContent] = React.useState("");
  const [linkTitle, setLinkTitle] = React.useState("");
  const [link, setLink] = React.useState("");
  const [type, setType] = React.useState<string>("class");
  const [selectedClass, setSelectedClass] = React.useState<string>(classOptions[0]);

  const handleCreate = () => {
    if (!title.trim()) {
      toast.error("Vui lòng nhập Tên thông báo.");
      return;
    }
    if (!content.trim()) {
      toast.error("Vui lòng nhập Nội dung.");
      return;
    }
    if (type === "class" && (selectedClass === "" || selectedClass === classOptions[0])) {
      toast.error("Vui lòng chọn lớp áp dụng.");
      return;
    }

    // Demo save: show toast and navigate back to list
    console.log("New notification:", { title, content, linkTitle, link, type, selectedClass });
    toast.success("Đã tạo thông báo.");
    navigate("/notifications?tab=all-notifications");
  };

  return (
    <div className="p-4">
      <Card>
        <CardHeader>
          <CardTitle>Tạo thông báo</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleCreate();
            }}
            className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-6"
          >
            <div className="md:col-span-1" />

            <div className="md:col-span-1 space-y-4">
              <div className="grid grid-cols-1 gap-2">
                <Label htmlFor="notif-title">Tên thông báo</Label>
                <Input id="notif-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Tên thông báo" />
              </div>

              <div className="grid grid-cols-1 gap-2">
                <Label htmlFor="notif-content">Nội dung</Label>
                <Textarea id="notif-content" value={content} onChange={(e) => setContent(e.target.value)} placeholder="Nội dung thông báo" className="min-h-[160px]" />
              </div>

              <div className="grid grid-cols-1 gap-2">
                <Label htmlFor="link-title">Tiêu đề liên kết</Label>
                <Input id="link-title" value={linkTitle} onChange={(e) => setLinkTitle(e.target.value)} placeholder="Tiêu đề liên kết (ví dụ: Xem chi tiết)" />
              </div>

              <div className="grid grid-cols-1 gap-2">
                <Label htmlFor="link">Liên kết</Label>
                <Input id="link" value={link} onChange={(e) => setLink(e.target.value)} placeholder="https://..." />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="notif-type">Loại thông báo</Label>
                  <Select value={type} onValueChange={(v) => setType(v)}>
                    <SelectTrigger id="notif-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {notificationTypes.map((t) => (
                        <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="class">Lớp</Label>
                  <Select value={selectedClass} onValueChange={(v) => setSelectedClass(v)}>
                    <SelectTrigger id="class">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {classOptions.map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white">
                  Tạo mới
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddNotification;