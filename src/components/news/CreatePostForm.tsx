"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const mockCategories = [
  { id: "cat1", label: "Tin tức" },
  { id: "cat2", label: "Sự kiện" },
  { id: "cat3", label: "Chính sách" },
];

const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ align: [] }],
    ["link", "image"],
    ["clean"],
  ],
};

const quillFormats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "list",
  "bullet",
  "align",
  "link",
  "image",
];

const CreatePostForm: React.FC = () => {
  const navigate = useNavigate();

  const [title, setTitle] = React.useState("");
  const [category, setCategory] = React.useState<string>("");
  const [imageFile, setImageFile] = React.useState<File | null>(null);
  const [imagePreview, setImagePreview] = React.useState<string | null>(null);
  const [externalLink, setExternalLink] = React.useState("");
  const [shortDesc, setShortDesc] = React.useState("");
  const [content, setContent] = React.useState("");
  const [visible, setVisible] = React.useState(true);
  const [featured, setFeatured] = React.useState(false);
  const fileRef = React.useRef<HTMLInputElement | null>(null);

  // Keep selects always visible; no switch required
  const [selectedClass, setSelectedClass] = React.useState<string>("");
  const [selectedSubject, setSelectedSubject] = React.useState<string>("");

  const SUBJECT_OPTIONS = ["Toán", "Văn", "Tiếng Anh", "Vật Lý", "Hóa"];
  const CLASS_OPTIONS = ["Lớp 6", "Lớp 7", "Lớp 8", "Lớp 9", "Lớp 10", "Lớp 11", "Lớp 12"];

  React.useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  const onPickImage = () => fileRef.current?.click();

  const onImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setImageFile(f);
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
      setImagePreview(null);
    }
    if (f) {
      const url = URL.createObjectURL(f);
      setImagePreview(url);
    }
  };

  const validate = () => {
    if (!title.trim()) {
      toast.error("Vui lòng nhập tiêu đề.");
      return false;
    }
    if (!category) {
      toast.error("Vui lòng chọn danh mục.");
      return false;
    }
    // selects are informational; no strict validation required per request
    return true;
  };

  const handleSave = () => {
    if (!validate()) return;

    const payload: any = {
      id: `post-${Date.now()}`,
      title: title.trim(),
      category,
      externalLink: externalLink.trim() || undefined,
      shortDesc,
      content,
      visible,
      featured,
      imageName: imageFile?.name ?? null,
      updatedAt: new Date().toISOString(),
      // keep class/subject if provided (optional)
      class: selectedClass || undefined,
      subject: selectedSubject || undefined,
    };

    console.log("Saving post (demo):", payload);
    toast.success("Đã lưu bài viết (mô phỏng).");
    navigate("/news?tab=posts");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Thêm bài viết mới</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-6 items-start">
            <div className="hidden lg:block" />

            <div className="space-y-4">
              {/* Row 1: Title and Category */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <div className="md:col-span-2">
                  <Label htmlFor="title">Tiêu đề</Label>
                  <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Nhập tiêu đề" />
                </div>

                <div>
                  <Label htmlFor="category">Chọn danh mục</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="-- Chọn danh mục --" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockCategories.map((c) => (
                        <SelectItem key={c.id} value={c.id}>{c.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* New full-width label + always visible Class & Subject selects.
                  They occupy the full width; on small screens they stack, on larger they align inline. */}
              <div>
                <Label className="mb-2">Danh mục Lớp/Môn (Chỉ sử dụng cho Lịch Livestream)</Label>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <div className="flex-1 sm:flex-none sm:w-[180px]">
                    <Select value={selectedClass} onValueChange={setSelectedClass}>
                      <SelectTrigger id="class-select">
                        <SelectValue placeholder="Lớp" />
                      </SelectTrigger>
                      <SelectContent>
                        {CLASS_OPTIONS.map((c) => (
                          <SelectItem key={c} value={c}>{c}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex-1 sm:flex-none sm:w-[220px]">
                    <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                      <SelectTrigger id="subject-select">
                        <SelectValue placeholder="Môn" />
                      </SelectTrigger>
                      <SelectContent>
                        {SUBJECT_OPTIONS.map((s) => (
                          <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div>
                <Label className="mb-2">Mô tả ngắn</Label>
                <div className="border rounded">
                  <ReactQuill
                    value={shortDesc}
                    onChange={setShortDesc}
                    modules={quillModules}
                    formats={quillFormats}
                    placeholder="Nhập mô tả ngắn..."
                    className="min-h-[120px]"
                  />
                </div>
              </div>

              <div>
                <Label className="mb-2">Nội dung</Label>
                <div className="border rounded">
                  <ReactQuill
                    value={content}
                    onChange={setContent}
                    modules={quillModules}
                    formats={quillFormats}
                    placeholder="Nhập nội dung..."
                    className="min-h-[320px]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                <div className="flex items-center gap-3">
                  <div>
                    <Label>Hiển thị</Label>
                    <div className="pt-2">
                      <Switch checked={visible} onCheckedChange={(v) => setVisible(!!v)} />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div>
                    <Label>Nổi bật</Label>
                    <div className="pt-2">
                      <Switch checked={featured} onCheckedChange={(v) => setFeatured(!!v)} />
                    </div>
                  </div>
                </div>

                <div />

                <div className="flex justify-end">
                  <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={handleSave}>Lưu</Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreatePostForm;