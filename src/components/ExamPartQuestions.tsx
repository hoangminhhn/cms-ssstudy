"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AddMultipleChoiceQuestionModal from "./AddMultipleChoiceQuestionModal";
import GroupPartModal from "./GroupPartModal";

interface ExamPartQuestionsProps {
  parts: any[];
  onDeleteAll: () => void;
  onDeleteQuestion: (partId: string, questionId: string) => void;
  onDeletePart: (partId: string) => void;
  onAddDefaultPart: () => void;
  onAddGroupPart: (partId: string) => void;
  renderPartHeader?: (partId: string) => React.ReactNode;
  onAddOrUpdateQuestion: (partId: string, questionId: string | null, newQuestion: any) => void;
}

const ExamPartQuestions: React.FC<ExamPartQuestionsProps> = ({
  parts,
  onDeleteAll,
  onDeleteQuestion,
  onDeletePart,
  onAddDefaultPart,
  onAddGroupPart,
  renderPartHeader,
  onAddOrUpdateQuestion,
}) => {
  const [isGroupPartModalOpen, setIsGroupPartModalOpen] = useState(false);

  const openGroupPartModal = () => {
    setIsGroupPartModalOpen(true);
  };

  const closeGroupPartModal = () => {
    setIsGroupPartModalOpen(false);
  };

  return (
    <>
      <Card>
        <div className="flex items-center justify-between px-4 py-2 border-b border-border">
          <h2 className="text-lg font-semibold truncate">Đề thi</h2>
          <div className="flex items-center gap-2">
            <Button className="bg-cyan-500 hover:bg-cyan-600 text-white" onClick={onAddDefaultPart}>
              + Phần thi mặc định
            </Button>
            <Button
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={openGroupPartModal}
            >
              + Phần thi nhóm chủ đề
            </Button>
          </div>
        </div>
        <CardContent>
          {/* Giữ nguyên phần nội dung khác */}
        </CardContent>
      </Card>

      {/* Giữ nguyên các modal khác nếu có */}

      <GroupPartModal isOpen={isGroupPartModalOpen} onClose={closeGroupPartModal} />
    </>
  );
};

export default ExamPartQuestions;