"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const notificationTypes = [
  { value: "all", label: "Toàn bộ" },
  { value: "class", label: "Lớp" },
  { value: "group", label: "Nhóm" },
  { value: "user", label: "Người dùng" },
];

const sampleClasses = [
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

const AddNotification: React.FC = () => {
  const navigate = useNavigate();

  const [title, setTitle] = React.useState("");
  const [content, setContent] = React.useState("");
  const [linkTitle, setLinkTitle] = React.useState("");
  const [linkUrl, setLinkUrl] = React.useState("");
  const [type, setType] = React.useState<string>("class");
  const [selectedClass, setSelectedClass] = React.useState<string>("");

  const validate = () => {
    if (!title.trim()) {
      toast.error("Vui lòng nhập tên thông báo.");
      return false;
    }
    if (!content.trim()) {
      toast.error("Vui lòng nhập nội dung thông báo.");
      return false;
    }
    if (type === "class" && !selectedClass) {
      toast.error("Vui lòng chọn lớp (khi loại là Lớp).");
      return false;
    }
    return true;
  };

  const handleCreate = () => {
    if (!validate()) return;

    const payload = {
      id: `n-${Date.now()}`,
      title: title.trim(),
      content: content.trim(),
      linkTitle: linkTitle.trim() || undefined,
      linkUrl: linkUrl.trim() || undefined,
      type,
      target: type === "class" ? selectedClass : undefined,
      createdAt: new Date().toISOString(),
    };

    // In a real app you'd send this to your backend. For now we simulate success.
    console.log("Create notification (demo):", payload);
    toast.success("Đã tạo thông báo (demo).");

    // Navigate back to list
    navigate("/notifications?tab=all-notifications");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tạo thông báo</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-4 items-start">
          {/* Left column labels - keep it visually similar: use empty left column so inputs align like provided image */}
          <div className="hidden lg:block" />

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
              <div>
                <Label htmlFor="notif-title">Tên thông báo</Label>
                <Input
                  id="notif-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Nhập tiêu đề thông báo"
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="notif-content">Nội dung</Label>
                <Textarea
                  id="notif-content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Nhập nội dung thông báo"
                  className="min-h-[160px]"
                />
              </div>

              <div>
                <Label htmlFor="link-title">Tiêu đề liên kết</Label>
                <Input
                  id="link-title"
                  value={linkTitle}
                  onChange={(e) => setLinkTitle(e.target.value)}
                  placeholder="Tiêu đề hiển thị cho liên kết (tuỳ chọn)"
                />
              </div>

              <div>
                <Label htmlFor="link-url">Liên kết</Label>
                <Input
                  id="link-url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://..."
                />
              </div>

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

              {type === "class" && (
                <div>
                  <Label htmlFor="class-select">Lớp</Label>
                  <Select value={selectedClass} onValueChange={(v) => setSelectedClass(v)}>
                    <SelectTrigger id="class-select">
                      <SelectValue placeholder="Chọn lớp" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Chọn lớp</SelectItem>
                      {sampleClasses.map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={handleCreate}>
                Tạo mới
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AddNotification;