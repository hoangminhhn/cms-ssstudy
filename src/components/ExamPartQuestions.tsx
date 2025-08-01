"use client";

import React from "react";
import { Button } from "@/components/ui/button";

interface ExamPartQuestionsProps {
  // ... your props here
}

const ExamPartQuestions: React.FC<ExamPartQuestionsProps> = (props) => {
  return (
    <div>
      {/* ... other content */}
      <div className="flex flex-wrap gap-2 mt-4 px-2">
        <Button className="bg-cyan-500 hover:bg-cyan-600 text-white flex-1 min-w-[120px] text-sm">
          +TRẮC NGHIỆM
        </Button>
        <Button className="bg-cyan-500 hover:bg-cyan-600 text-white flex-1 min-w-[120px] text-sm">
          {/* Giữ nguyên nội dung nút thứ hai nếu có */}
          {/* Nếu bạn có nội dung cụ thể cho nút này, vui lòng cung cấp để tôi giữ nguyên */}
        </Button>
      </div>
      {/* ... other content */}
    </div>
  );
};

export default ExamPartQuestions;