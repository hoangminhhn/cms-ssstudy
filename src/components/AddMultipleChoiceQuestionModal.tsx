"use client";

import React, { useState, useEffect } from "react";
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

  // New props for editing existing question
  questionText?: string;
  options?: string[];
  correctOptionIndex?: number;
  difficulty?: "Nhận biết" | "Thông hiểu" | "Vận dụng" | "Vận dụng cao";
  explanation?: string;
  videoLink?: string;
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
  questionText: initialQuestionText = "",
  options: initialOptions = defaultOptions,
  correctOptionIndex: initialCorrectOptionIndex = 0,
  difficulty: initialDifficulty = "Nhận biết",
  explanation: initialExplanation = "",
  videoLink: initialVideoLink = "",
}) => {
  const [questionText, setQuestionText] = useState<string>(initialQuestionText);
  const [options, setOptions] = useState<string[]>(initialOptions);
  const [correctOptionIndex, setCorrectOptionIndex] = useState<number>(initialCorrectOptionIndex);
  const [difficulty, setDifficulty] = useState<MultipleChoiceQuestion["difficulty"]>(initialDifficulty);
  const [explanation, setExplanation] = useState<string>(initialExplanation);
  const [videoLink, setVideoLink] = useState<string>(initialVideoLink);

  // Reset state when modal opens or initial props change
  useEffect(() => {
    if (isOpen) {
      setQuestionText(initialQuestionText);
      setOptions(initialOptions);
      setCorrectOptionIndex(initialCorrectOptionIndex);
      setDifficulty(initialDifficulty);
      setExplanation(initialExplanation);
      setVideoLink(initialVideoLink);
    }
  }, [isOpen, initialQuestionText, initialOptions, initialCorrectOptionIndex, initialDifficulty, initialExplanation, initialVideoLink]);

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSave = () => {
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
    // Reset handled by parent on close
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-w-4xl w-full max-h-[90vh] overflow-y-auto p-8 space-y-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
            Câu {questionNumber} - Trắc nghiệm
          </DialogTitle>
        </DialogHeader>

        {/* Câu hỏi */}
        <section className="space-y-2">
          <Label htmlFor="question-text" className="text-lg font-medium text-gray-700 dark:text-gray-300">
            Câu hỏi
          </Label>
          <ReactQuill
            theme="snow"
            value={questionText}
            onChange={setQuestionText}
            placeholder="Nhập nội dung câu hỏi..."
            className="h-40 rounded-md border border-gray-300 dark:border-gray-600 shadow-sm"
          />
        </section>

        {/* Các lựa chọn */}
        <section className="space-y-3">
          <Label className="text-lg font-medium text-gray-700 dark:text-gray-300">
            Các lựa chọn
          </Label>
          <RadioGroup
            value={String(correctOptionIndex)}
            onValueChange={(val) => setCorrectOptionIndex(Number(val))}
            className="space-y-3"
          >
            {options.map((opt, idx) => {
              const letter = String.fromCharCode(65 + idx);
              return (
                <div key={idx} className="flex items-center gap-3">
                  <div className="flex items-center gap-1 min-w-[3.5rem]">
                    <RadioGroupItem
                      value={String(idx)}
                      id={`option-${idx}`}
                      className="h-5 w-5 text-orange-600 focus:ring-2 focus:ring-orange-400"
                    />
                    <span className="select-none font-semibold text-gray-700 dark:text-gray-300">{letter}.</span>
                  </div>
                  <input
                    type="text"
                    value={opt}
                    onChange={(e) => handleOptionChange(idx, e.target.value)}
                    placeholder={`Lựa chọn ${letter}`}
                    className="flex-1 rounded-md border border-gray-300 px-4 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder:text-gray-500"
                  />
                </div>
              );
            })}
          </RadioGroup>
        </section>

        {/* Độ khó */}
        <section className="space-y-2">
          <Label className="text-lg font-medium text-gray-700 dark:text-gray-300">
            Độ khó
          </Label>
          <RadioGroup
            value={difficulty}
            onValueChange={(val) => setDifficulty(val as MultipleChoiceQuestion["difficulty"])}
            className="flex flex-wrap gap-8"
          >
            {["Nhận biết", "Thông hiểu", "Vận dụng", "Vận dụng cao"].map((level) => (
              <div key={level} className="flex items-center gap-2">
                <RadioGroupItem
                  value={level}
                  id={`difficulty-${level}`}
                  className="h-5 w-5 text-orange-600 focus:ring-2 focus:ring-orange-400"
                />
                <Label htmlFor={`difficulty-${level}`} className="cursor-pointer select-none text-gray-900 dark:text-gray-100">
                  {level}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </section>

        {/* Lời giải */}
        <section className="space-y-2">
          <Label htmlFor="explanation" className="text-lg font-medium text-gray-700 dark:text-gray-300">
            Lời giải
          </Label>
          <ReactQuill
            theme="snow"
            value={explanation}
            onChange={setExplanation}
            placeholder="Nhập lời giải..."
            className="h-32 rounded-md border border-gray-300 dark:border-gray-600 shadow-sm"
          />
        </section>

        {/* Video tham khảo */}
        <section className="space-y-2">
          <Label htmlFor="video-link" className="text-lg font-medium text-gray-700 dark:text-gray-300">
            Video tham khảo
          </Label>
          <input
            id="video-link"
            type="text"
            value={videoLink}
            onChange={(e) => setVideoLink(e.target.value)}
            placeholder="Nhập link video tham khảo"
            className="w-full rounded-md border border-gray-300 px-4 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder:text-gray-500"
          />
        </section>

        {/* Nút hành động */}
        <DialogFooter className="flex justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
          <Button variant="outline" onClick={onClose}>Hủy</Button>
          <Button onClick={handleSave} className="bg-orange-500 hover:bg-orange-600 text-white">
            Cập nhật
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddMultipleChoiceQuestionModal;