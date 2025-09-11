"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const EditExamFormCategory: React.FC = () => {
  const [questionDisplay, setQuestionDisplay] = React.useState<string>("list");

  return (
    <div className="space-y-3">
      <div>
        <Label htmlFor="question-display">Cách hiển thị câu hỏi</Label>
        <Select value={questionDisplay} onValueChange={setQuestionDisplay}>
          {/* Updated placeholder/text: changed from "Danh sách" to "tất cả câu hỏi" */}
          <SelectTrigger id="question-display">
            <SelectValue placeholder="tất cả câu hỏi" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="list">tất cả câu hỏi</SelectItem>
            <SelectItem value="random">Ngẫu nhiên</SelectItem>
            <SelectItem value="one-by-one">Một câu một lần</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default EditExamFormCategory;