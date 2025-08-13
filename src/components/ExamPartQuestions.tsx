"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AddMultipleChoiceQuestionModal from "./AddMultipleChoiceQuestionModal";
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
          {/* Giữ nguyên toàn bộ phần nội dung hiển thị câu hỏi, tab phần thi, nút thêm câu hỏi, nút xóa phần thi,... */}
          {parts.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">Chưa có phần thi nào.</div>
          ) : (
            <div>
              {/* Tab phần thi */}
              <div className="mb-4 flex space-x-2 overflow-x-auto">
                {parts.map((part) => (
                  <button
                    key={part.id}
                    className="px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-700"
                    // Thêm logic chọn tab nếu có
                  >
                    {part.name}
                  </button>
                ))}
              </div>

              {/* Hiển thị câu hỏi từng phần */}
              {parts.map((part) => (
                <div key={part.id} className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">{part.name}</h3>
                  {part.questions.length === 0 ? (
                    <p className="text-muted-foreground">Chưa có câu hỏi nào.</p>
                  ) : (
                    <table className="w-full table-auto border-collapse border border-gray-300 dark:border-gray-700">
                      <thead>
                        <tr>
                          <th className="border border-gray-300 dark:border-gray-700 p-2">Mã câu hỏi</th>
                          <th className="border border-gray-300 dark:border-gray-700 p-2">Đáp án đúng</th>
                          <th className="border border-gray-300 dark:border-gray-700 p-2">Lời giải</th>
                          <th className="border border-gray-300 dark:border-gray-700 p-2">Tài liệu</th>
                          <th className="border border-gray-300 dark:border-gray-700 p-2">Video</th>
                          <th className="border border-gray-300 dark:border-gray-700 p-2">Ngày tải lên</th>
                          <th className="border border-gray-300 dark:border-gray-700 p-2">Thao tác</th>
                        </tr>
                      </thead>
                      <tbody>
                        {part.questions.map((q) => (
                          <tr key={q.id}>
                            <td className="border border-gray-300 dark:border-gray-700 p-2">{q.id}</td>
                            <td className="border border-gray-300 dark:border-gray-700 p-2">{q.correctAnswer}</td>
                            <td className="border border-gray-300 dark:border-gray-700 p-2">{q.solution}</td>
                            <td className="border border-gray-300 dark:border-gray-700 p-2">{q.documentLink || "-"}</td>
                            <td className="border border-gray-300 dark:border-gray-700 p-2">{q.videoLink || "-"}</td>
                            <td className="border border-gray-300 dark:border-gray-700 p-2">{q.uploadDate}</td>
                            <td className="border border-gray-300 dark:border-gray-700 p-2">
                              {/* Nút chỉnh sửa, xóa câu hỏi */}
                              <Button size="sm" variant="outline" className="mr-2">Sửa</Button>
                              <Button size="sm" variant="destructive">Xóa</Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              ))}

              {/* Nút thêm câu hỏi, xóa phần thi,... */}
              <div className="flex gap-2 mt-4">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">Thêm câu hỏi</Button>
                <Button variant="destructive">Xóa phần thi</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Giữ nguyên các modal khác nếu có */}
      <AddMultipleChoiceQuestionModal
        isOpen={false}
        onClose={() => {}}
        onSave={() => {}}
        questionNumber={0}
      />

      <GroupPartModal isOpen={isGroupPartModalOpen} onClose={closeGroupPartModal} />
    </>
  );
};

export default ExamPartQuestions;