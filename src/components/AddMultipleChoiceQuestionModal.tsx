"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import dynamic from "next/dynamic";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

interface AddMultipleChoiceQuestionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (question: {
    questionNumber: number;
    correctAnswer: string;
    solution: string;
    documentLink: string;
    videoLink: string;
  }) => void;
}

const AddMultipleChoiceQuestionModal: React.FC<AddMultipleChoiceQuestionModalProps> = ({
  open,
  onOpenChange,
  onSave,
}) => {
  const [questionNumber, setQuestionNumber] = useState<number>(1);
  const [correctAnswer, setCorrectAnswer] = useState<string>("A");
  const [solution, setSolution] = useState<string>("");
  const [documentLink, setDocumentLink] = useState<string>("");
  const [videoLink, setVideoLink] = useState<string>("");

  const handleSave = () => {
    onSave({
      questionNumber,
      correctAnswer,
      solution,
      documentLink,
      videoLink,
    });
    // Reset form
    setQuestionNumber(questionNumber + 1);
    setCorrectAnswer("A");
    setSolution("");
    setDocumentLink("");
    setVideoLink("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Thêm câu hỏi trắc nghiệm</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="question-number">Câu</Label>
            <Input
              id="question-number"
              type="number"
              min={1}
              value={questionNumber}
              onChange={(e) => setQuestionNumber(Number(e.target.value))}
            />
          </div>
          <div>
            <Label>Đáp án</Label>
            <RadioGroup
              onValueChange={setCorrectAnswer}
              value={correctAnswer}
              className="flex space-x-4 mt-1"
            >
              {["A", "B", "C", "D"].map((option) => (
                <div key={option} className="flex items-center space-x-1">
                  <RadioGroupItem value={option} id={`answer-${option}`} />
                  <Label htmlFor={`answer-${option}`}>{option}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
          <div>
            <Label>Lời giải</Label>
            <ReactQuill
              theme="snow"
              value={solution}
              onChange={setSolution}
              className="h-40"
            />
          </div>
          <div>
            <Label htmlFor="document-link">Tài liệu tham khảo</Label>
            <Input
              id="document-link"
              value={documentLink}
              onChange={(e) => setDocumentLink(e.target.value)}
              placeholder="Nhập link tài liệu"
            />
          </div>
          <div>
            <Label htmlFor="video-link">Video tham khảo</Label>
            <Input
              id="video-link"
              value={videoLink}
              onChange={(e) => setVideoLink(e.target.value)}
              placeholder="Nhập link video"
            />
          </div>
        </div>
        <DialogFooter className="space-x-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Bỏ qua
          </Button>
          <Button onClick={handleSave} className="bg-orange-500 hover:bg-orange-600 text-white">
            Lưu & Thêm mới
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddMultipleChoiceQuestionModal;