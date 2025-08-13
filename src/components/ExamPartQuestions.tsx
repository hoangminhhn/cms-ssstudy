"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trash2, Pencil } from "lucide-react";
import AddMultipleChoiceQuestionModal, { MultipleChoiceQuestion } from "./AddMultipleChoiceQuestionModal";
import GroupPartModal from "./GroupPartModal";

interface Question {
  id: string;
  correctAnswer: string;
  solution: string;
  documentLink?: string;
  videoLink?: string;
  uploadDate: string;
}

interface ExamPart {
  id: string;
  name: string;
  questions: Question[];
}

interface ExamPartQuestionsProps {
  parts: ExamPart[];
  onDeleteAll: () => void;
  onDeleteQuestion: (partId: string, questionId: string) => void;
  onDeletePart: (partId: string) => void;
  onAddDefaultPart: () => void;
  onAddGroupPart: (partId: string) => void;
  renderPartHeader?: (partId: string) => React.ReactNode;
  onAddOrUpdateQuestion: (partId: string, questionId: string | null, newQuestion: Question) => void;
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
  const [selectedTab, setSelectedTab] = React.useState(parts.length > 0 ? parts[0].id : "");
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingQuestion, setEditingQuestion] = React.useState<MultipleChoiceQuestion | null>(null);
  const [editingQuestionIndex, setEditingQuestionIndex] = React.useState<number | null>(null);
  const [editingPartId, setEditingPartId] = React.useState<string | null>(null);

  // State popup nhóm chủ đề
  const [isGroupPartModalOpen, setIsGroupPartModalOpen] = useState(false);

  React.useEffect(() => {
    if (parts.length > 0 && !parts.find((p) => p.id === selectedTab)) {
      setSelectedTab(parts[0].id);
    }
  }, [parts, selectedTab]);

  const handleAddMultipleChoice = () => {
    setEditingQuestion(null);
    setEditingQuestionIndex(null);
    setEditingPartId(selectedTab);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingQuestion(null);
    setEditingQuestionIndex(null);
    setEditingPartId(null);
  };

  const handleSaveQuestion = (question: MultipleChoiceQuestion) => {
    if (!editingPartId) return;

    const newQuestion: Question = {
      id:
        editingQuestionIndex !== null && parts.find((p) => p.id === editingPartId)?.questions[editingQuestionIndex]
          ? parts.find((p) => p.id === editingPartId)!.questions[editingQuestionIndex].id
          : Date.now().toString(),
      correctAnswer: String.fromCharCode(65 + question.correctOptionIndex),
      solution: question.explanation,
      videoLink: question.videoLink,
      uploadDate: new Date().toLocaleDateString(),
      documentLink: undefined,
    };

    onAddOrUpdateQuestion(editingPartId, editingQuestionIndex !== null ? newQuestion.id : null, newQuestion);

    handleModalClose();
  };

  const handleEditQuestion = (partId: string, questionIndex: number) => {
    const part = parts.find((p) => p.id === partId);
    if (!part) return;
    const question = part.questions[questionIndex];
    if (!question) return;

    const options = Array(5).fill("");
    const correctOptionIndex = question.correctAnswer.charCodeAt(0) - 65;

    const editingQ: MultipleChoiceQuestion = {
      questionText: "", // No question text stored
      options,
      correctOptionIndex: correctOptionIndex >= 0 && correctOptionIndex < 5 ? correctOptionIndex : 0,
      difficulty: "Nhận biết",
      explanation: question.solution || "",
      videoLink: question.videoLink || "",
    };

    setEditingQuestion(editingQ);
    setEditingQuestionIndex(questionIndex);
    setEditingPartId(partId);
    setIsModalOpen(true);
  };

  // Helper to check if part is a group part (id starts with 'group-part-')
  const isGroupPart = (partId: string) => partId.startsWith("group-part-");

  // Mở popup nhóm chủ đề
  const openGroupPartModal = () => {
    setIsGroupPartModalOpen(true);
  };

  // Đóng popup nhóm chủ đề
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
            <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={openGroupPartModal}>
              + Phần thi nhóm chủ đề
            </Button>
          </div>
        </div>
        <CardContent>
          {/* ... giữ nguyên phần còn lại */}
        </CardContent>
      </Card>

      <AddMultipleChoiceQuestionModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSave={handleSaveQuestion}
        questionNumber={editingQuestionIndex !== null ? editingQuestionIndex + 1 : parts.findIndex((p) => p.id === editingPartId) + 1}
        {...(editingQuestion ? { ...editingQuestion } : {})}
      />

      <GroupPartModal isOpen={isGroupPartModalOpen} onClose={closeGroupPartModal} />
    </>
  );
};

export default ExamPartQuestions;