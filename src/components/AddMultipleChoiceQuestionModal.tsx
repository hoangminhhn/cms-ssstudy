"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

interface AddMultipleChoiceQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (question: MultipleChoiceQuestion) => void;
  questionNumber: number;
}

export interface MultipleChoiceQuestion {
  questionText: string;
  options: string[];
  correctOptionIndex: number;
  difficulty: "Nhận biết" | "Thông hiểu" | "Vận dụng" | "Vận dụng cao";
  explanation: string;
  videoLink: string;
}

const defaultOptions = ["", "", "", "", ""];

const AddMultipleChoiceQuestionModal: React.FC<AddMultipleChoiceQuestionModalProps> = ({
  isOpen,
  onClose,
  onSave,
  questionNumber,
}) => {
  const [questionText, setQuestionText] = useState<string>("");
  const [options, setOptions] = useState<string[]>(defaultOptions);
  const [correctOptionIndex, setCorrectOptionIndex] = useState<number>(0);
  const [difficulty, setDifficulty] = useState<MultipleChoiceQuestion["difficulty"]>("Nhận biết");
  const [explanation, setExplanation] = useState<string>("");
  const [videoLink, setVideoLink] = useState<string>("");

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSave = () => {
    // Validate at least question text and one option filled
    if (!questionText.trim()) {
      alert("Vui lòng nhập nội dung câu hỏi.");
      return;
    }
    if (options.filter(opt => opt.trim() !== "").length < 2) {
      alert("Vui lòng nhập ít nhất 2 lựa chọn.");
      return;
    }
    onSave({
      questionText,
      options,
      correctOptionIndex,
      difficulty,
      explanation,
      videoLink,
    });
    // Reset form
    setQuestionText("");
    setOptions(defaultOptions);
    setCorrectOptionIndex(0);
    setDifficulty("Nhận biết");
    setExplanation("");
    setVideoLink("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-w-3xl w-full overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Câu {questionNumber} - Trắc nghiệm</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="question-text" className="mb-1 block">Câu hỏi</Label>
            <ReactQuill
              theme="snow"
              value={questionText}
              onChange={setQuestionText}
              placeholder="Nhập nội dung câu hỏi..."
              className="h-32"
            />
          </div>

          <div>
            <Label className="mb-1 block">Các lựa chọn</Label>
            <RadioGroup
              value={String(correctOptionIndex)}
              onValueChange={(val) => setCorrectOptionIndex(Number(val))}
              className="space-y-2"
            >
              {options.map((opt, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <RadioGroupItem value={String(idx)} id={`option-${idx}`} />
                  <Label htmlFor={`option-${idx}`} className="flex-1">
                    <input
                      type="text"
                      value={opt}
                      onChange={(e) => handleOptionChange(idx, e.target.value)}
                      placeholder={`Lựa chọn ${String.fromCharCode(65 + idx)}`}
                      className="w-full rounded border border-gray-300 px-2 py-1 dark:border-gray-600 dark:bg-gray-700"
                    />
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div>
            <Label className="mb-1 block">Độ khó</Label>
            <RadioGroup
              value={difficulty}
              onValueChange={(val) => setDifficulty(val as MultipleChoiceQuestion["difficulty"])}
              className="flex space-x-4"
            >
              {["Nhận biết", "Thông hiểu", "Vận dụng", "Vận dụng cao"].map((level) => (
                <div key={level} className="flex items-center gap-1">
                  <RadioGroupItem value={level} id={`difficulty-${level}`} />
                  <Label htmlFor={`difficulty-${level}`}>{level}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div>
            <Label htmlFor="explanation" className="mb-1 block">Lời giải</Label>
            <ReactQuill
              theme="snow"
              value={explanation}
              onChange={setExplanation}
              placeholder="Nhập lời giải..."
              className="h-24"
            />
          </div>

          <div>
            <Label htmlFor="video-link" className="mb-1 block">Video tham khảo</Label>
            <input
              id="video-link"
              type="text"
              value={videoLink}
              onChange={(e) => setVideoLink(e.target.value)}
              placeholder="Nhập link video tham khảo"
              className="w-full rounded border border-gray-300 px-2 py-1 dark:border-gray-600 dark:bg-gray-700"
            />
          </div>
        </div>
        <DialogFooter className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>Hủy</Button>
          <Button onClick={handleSave} className="bg-orange-500 hover:bg-orange-600 text-white">Cập nhật</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddMultipleChoiceQuestionModal;