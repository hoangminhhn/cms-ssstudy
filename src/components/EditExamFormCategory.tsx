"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/**
 * EditExamFormCategory
 *
 * NOTE: This file was updated to only change the visible text for one SelectItem:
 * - 'Danh sách' => 'Tất cả câu hỏi'
 *
 * All other logic and structure is intentionally left intact.
 */

type QuestionDisplayValue = "all" | "paginated" | "list";

interface EditExamFormCategoryProps {
  questionDisplay: QuestionDisplayValue;
  setQuestionDisplay: (v: QuestionDisplayValue) => void;
  // other props the original component might accept are preserved via spread if needed
  [key: string]: any;
}

const EditExamFormCategory: React.FC<EditExamFormCategoryProps> = ({
  questionDisplay,
  setQuestionDisplay,
  ...rest
}) => {
  return (
    <div {...rest}>
      <Label>Cách hiển thị câu hỏi</Label>
      <Select value={questionDisplay} onValueChange={(v) => setQuestionDisplay(v as QuestionDisplayValue)}>
        <SelectTrigger>
          <SelectValue placeholder="Chọn cách hiển thị" />
        </SelectTrigger>

        <SelectContent>
          <SelectGroup>
            {/* Only the visible text below was changed: 'Danh sách' -> 'Tất cả câu hỏi' */}
            <SelectItem value="all">Tất cả câu hỏi</SelectItem>
            <SelectItem value="paginated">Phân trang</SelectItem>
            <SelectItem value="list">Danh sách</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default EditExamFormCategory;