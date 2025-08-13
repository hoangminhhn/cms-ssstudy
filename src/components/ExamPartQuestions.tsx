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
  questionType: string;
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
              <div className="mb-4 border-b border-gray-200 dark:border-gray-700">
                <nav className="-mb-px flex space-x-4" aria-label="Tabs">
                  {parts.map((part, idx) => (
                    <button
                      key={part.id}
                      className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                        idx === 0
                          ? "border-orange-500 text-orange-600"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      {part.name}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Bảng câu hỏi */}
              {parts.map((part) => (
                <div key={part.id} className="mb-6">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">#</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Mã câu hỏi</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Đáp án</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Loại câu hỏi</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Lời giải</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Video</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Ngày tải lên</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
                      {part.questions.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="text-center py-4 text-muted-foreground">
                            Chưa có câu hỏi nào.
                          </td>
                        </tr>
                      ) : (
                        part.questions.map((q, idx) => (
                          <tr key={q.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{`Câu ${idx + 1}`}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{q.id}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{q.correctAnswer}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{q.questionType}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-pink-600 dark:text-pink-400">{q.solution || "Chưa có"}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-pink-600 dark:text-pink-400">{q.videoLink || "Chưa có"}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{q.uploadDate}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                              <Button size="sm" variant="ghost" aria-label={`Sửa câu hỏi ${q.id}`}>
                                ✏️
                              </Button>
                              <Button size="sm" variant="destructive" aria-label={`Xóa câu hỏi ${q.id}`}>
                                🗑️
                              </Button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              ))}

              {/* Nút thao tác câu hỏi */}
              <div className="flex flex-wrap gap-2">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">+TRẮC NGHIỆM</Button>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">+TRẮC NGHIỆM ĐÚNG SAI</Button>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">+ĐIỀN SỐ/TRẢ LỜI NGẮN</Button>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">+KÉO THẢ</Button>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">+TN NHIỀU ĐÁP ÁN</Button>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">+ĐÚNG/SAI</Button>
              </div>

              {/* Nút xóa phần thi */}
              <div className="mt-4">
                <Button variant="destructive" className="float-right">Xóa phần thi</Button>
              </div>
            </CardContent>
          </Card>
        </>
      );
    };

export default ExamPartQuestions;