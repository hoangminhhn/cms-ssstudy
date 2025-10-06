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
    return true;
  };

  const handleSave = () => {
    if (!validate()) return;

    // Build payload (demo). In a real app you'd call an API here.
    const payload = {
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
            {/* Labels column (left) */}
            <div className="hidden lg:block" />

            {/* Form column (right) */}
            <div className="space-y-4">
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

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <div>
                  <Label>Hình ảnh</Label>
                  <div className="flex items-center gap-3">
                    <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onImageChange} />
                    <Button variant="outline" onClick={onPickImage}>Chọn ảnh</Button>
                    <div className="text-sm text-muted-foreground">{imageFile?.name ?? "Chưa chọn ảnh"}</div>
                  </div>
                  {imagePreview && (
                    <div className="mt-2">
                      <img src={imagePreview} alt="preview" className="max-h-40 rounded border" />
                    </div>
                  )}
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="external">External_link</Label>
                  <Input id="external" value={externalLink} onChange={(e) => setExternalLink(e.target.value)} placeholder="Link (nếu có)" />
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