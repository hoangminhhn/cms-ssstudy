"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface DocumentFormProps {
  title: string;
  setTitle: (v: string) => void;
  slug: string;
  setSlug: (v: string) => void;
  shortDesc: string;
  setShortDesc: (v: string) => void;
  content: string;
  setContent: (v: string) => void;
  category: string;
  setCategory: (v: string) => void;
  subject: string;
  setSubject: (v: string) => void;
  classLevel: string;
  setClassLevel: (v: string) => void;
}

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const DocumentForm: React.FC<DocumentFormProps> = ({
  title,
  setTitle,
  slug,
  setSlug,
  shortDesc,
  setShortDesc,
  content,
  setContent,
  category,
  setCategory,
  subject,
  setSubject,
  classLevel,
  setClassLevel,
}) => {
  React.useEffect(() => {
    // update slug as user types title but allow manual edits if slug differs
    const s = slugify(title || "");
    if (!slug || slug === "" || slug === slugify(slug)) {
      setSlug(s);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title]);

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 border rounded-lg p-6">
        <h3 className="text-lg font-medium mb-4">Thông tin cơ bản</h3>

        <div className="grid grid-cols-1 gap-4">
          <div>
            <Label htmlFor="doc-title">Tiêu đề *</Label>
            <Input
              id="doc-title"
              placeholder="Nhập tiêu đề tài liệu"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="doc-slug">Slug *</Label>
            <Input
              id="doc-slug"
              placeholder="url-slug"
              value={slug}
              onChange={(e) => setSlug(slugify(e.target.value))}
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="short-desc">Mô tả ngắn</Label>
            <Textarea
              id="short-desc"
              placeholder="Mô tả ngắn về tài liệu"
              value={shortDesc}
              onChange={(e) => setShortDesc(e.target.value)}
              className="mt-2 min-h-[80px]"
            />
          </div>

          <div>
            <Label htmlFor="content">Nội dung chi tiết (Markdown)</Label>
            <Textarea
              id="content"
              placeholder="Nội dung chi tiết (hỗ trợ markdown)"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="mt-2 min-h-[180px] font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground mt-2">Hỗ trợ Markdown: **in đậm**, *nghiêng*, # tiêu đề, - danh sách, `code`</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <Label>Danh mục</Label>
              <Input placeholder="VD: Đề thi" value={category} onChange={(e) => setCategory(e.target.value)} className="mt-2" />
            </div>

            <div>
              <Label>Môn học</Label>
              <Input placeholder="VD: Toán" value={subject} onChange={(e) => setSubject(e.target.value)} className="mt-2" />
            </div>

            <div>
              <Label>Khối lớp</Label>
              <Select value={classLevel} onValueChange={setClassLevel}>
                <SelectTrigger className="w-full h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {/* Use a non-empty sentinel value for the placeholder to avoid Radix Select error */}
                  <SelectItem value="none">Chọn khối lớp</SelectItem>
                  <SelectItem value="grade-1">Lớp 1</SelectItem>
                  <SelectItem value="grade-6">Lớp 6</SelectItem>
                  <SelectItem value="grade-10">Lớp 10</SelectItem>
                  <SelectItem value="grade-12">Lớp 12</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* file dropzone area placed by page below; this component only handles form fields */}
    </div>
  );
};

export default DocumentForm;