"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type QuestionDisplayOption = "sequential" | "all";

const EditExamFormCategory: React.FC = () => {
  const [name, setName] = React.useState<string>("");
  const [slug, setSlug] = React.useState<string>("");
  const [questionDisplay, setQuestionDisplay] = React.useState<QuestionDisplayOption>("sequential");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Chỉnh sửa danh mục kỳ thi</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="category-name">Tên danh mục</Label>
          <Input
            id="category-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nhập tên danh mục"
          />
        </div>

        <div>
          <Label htmlFor="category-slug">Slug</Label>
          <Input
            id="category-slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="Nhập slug"
          />
        </div>

        <div>
          <Label htmlFor="question-display" className="mb-2 block">
            Cách hiển thị câu hỏi
          </Label>

          <Select value={questionDisplay} onValueChange={(v) => setQuestionDisplay(v as QuestionDisplayOption)}>
            <SelectTrigger id="question-display" aria-label="Cách hiển thị câu hỏi">
              <SelectValue placeholder="Chọn cách hiển thị" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="sequential">Lần lượt từng câu hỏi</SelectItem>
              <SelectItem value="all">Tất cả câu hỏi</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline">Hủy</Button>
          <Button className="bg-orange-500 hover:bg-orange-600 text-white">Lưu thay đổi</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EditExamFormCategory;