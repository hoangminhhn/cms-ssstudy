"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Props = {
  // current value for question display mode: 'one' = 1 Câu, 'all' = Tất cả câu hỏi
  questionDisplay: "one" | "all";
  setQuestionDisplay: (v: "one" | "all") => void;
};

/**
 * EditExamFormCategory
 * - Renders a Select allowing the user to choose between "1 Câu" and "Tất cả câu hỏi".
 * - This component expects questionDisplay and setQuestionDisplay to be provided by the parent.
 * - Only the select options and trigger content were changed per request.
 */
const EditExamFormCategory: React.FC<Props> = ({ questionDisplay, setQuestionDisplay }) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="question-display">Chế độ hiển thị câu hỏi</Label>
      <Select value={questionDisplay} onValueChange={(v) => setQuestionDisplay(v as "one" | "all")}>
        <SelectTrigger id="question-display" aria-label="Chọn chế độ hiển thị câu hỏi">
          <SelectValue placeholder="Chọn chế độ hiển thị" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="one">1 Câu</SelectItem>
          <SelectItem value="all">Tất cả câu hỏi</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default EditExamFormCategory;