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

  // New: subject/class filter toggle + selections
  const [enableSubjectClassFilter, setEnableSubjectClassFilter] = React.useState<boolean>(false);
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
    // If filter enabled, ensure both class and subject selected (class first requirement)
    if (enableSubjectClassFilter) {
      if (!selectedClass) {
        toast.error("Vui lòng chọn Lớp khi bật bộ lọc môn/lớp.");
        return false;
      }
      if (!selectedSubject) {
        toast.error("Vui lòng chọn Môn khi bật bộ lọc môn/lớp.");
        return false;
      }
    }
    return true;
  };

  const handleSave = () => {
    if (!validate()) return;

    // Build payload (demo). In a real app you'd call an API here.
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
    };

    // include class/subject if filter enabled (class first)
    if (enableSubjectClassFilter) {
      payload.class = selectedClass;
      payload.subject = selectedSubject;
    }

    console.log("Saving post (demo):", payload);
    toast.success("Đã lưu bài viết (mô phỏng).");
    // After saving go back to list
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
            {/* Left column placeholder for large screens */}
            <div className="hidden lg:block" />

            <div className="space-y-4">
              {/* Top row: Title (span 2 cols on md), Category, and Switch+Class/Subject inline */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
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

                {/* Switch column: show switch always; when enabled show Class then Subject inline (Class first) */}
                <div>
                  <div className="flex items-center justify-end gap-3">
                    <div className="flex items-center gap-2">
                      <Switch checked={enableSubjectClassFilter} onCheckedChange={(v) => setEnableSubjectClassFilter(!!v)} />
                      <Label className="mb-0">Bật bộ lọc môn/lớp</Label>
                    </div>
                  </div>

                  {enableSubjectClassFilter && (
                    <div className="mt-2 grid grid-cols-2 gap-2">
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
                  )}
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