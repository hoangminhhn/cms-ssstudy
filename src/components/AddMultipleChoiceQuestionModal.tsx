"use client";

import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import katex from "katex";
import "katex/dist/katex.min.css";

interface AddMultipleChoiceQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (question: MultipleChoiceQuestion) => void;
  questionNumber: number;

  questionText?: string;
  options?: string[];
  correctOptionIndex?: number;
  difficulty?: "Nhận biết" | "Thông hiểu" | "Vận dụng" | "Vận dụng cao";
  explanation?: string;
  videoLink?: string;

  questionTypeLabel?: string;
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
  questionTypeLabel = "Trắc nghiệm",
}) => {
  const [questionText, setQuestionText] = useState<string>(initialQuestionText);
  const [options, setOptions] = useState<string[]>(initialOptions);
  const [correctOptionIndex, setCorrectOptionIndex] = useState<number>(initialCorrectOptionIndex);
  const [difficulty, setDifficulty] = useState<MultipleChoiceQuestion["difficulty"]>(initialDifficulty);
  const [explanation, setExplanation] = useState<string>(initialExplanation);
  const [videoLink, setVideoLink] = useState<string>(initialVideoLink);

  // Per-option formula editor state keyed by index
  const [formulaDrafts, setFormulaDrafts] = useState<Record<number, string>>({});
  const [openPopoverIndex, setOpenPopoverIndex] = useState<number | null>(null);
  const [previewHtml, setPreviewHtml] = useState<Record<number, string>>({});

  useEffect(() => {
    if (isOpen) {
      setQuestionText(initialQuestionText);
      setOptions(initialOptions);
      setCorrectOptionIndex(initialCorrectOptionIndex);
      setDifficulty(initialDifficulty);
      setExplanation(initialExplanation);
      setVideoLink(initialVideoLink);
      setFormulaDrafts({});
      setOpenPopoverIndex(null);
      setPreviewHtml({});
    }
  }, [isOpen, initialQuestionText, initialOptions, initialCorrectOptionIndex, initialDifficulty, initialExplanation, initialVideoLink]);

  const handleOptionChange = (index: number, value: string) => {
    setOptions((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const handleSave = () => {
    if (!questionText.trim()) {
      alert("Vui lòng nhập nội dung câu hỏi.");
      return;
    }
    if (options.filter((opt) => opt.trim() !== "").length < 2) {
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
  };

  // Formula handling
  const updateFormulaDraft = (index: number, value: string) => {
    setFormulaDrafts((prev) => ({ ...prev, [index]: value }));
    // render preview (try/catch)
    try {
      const html = katex.renderToString(value || "\\; ", { throwOnError: false, displayMode: true });
      setPreviewHtml((p) => ({ ...p, [index]: html }));
    } catch (err) {
      setPreviewHtml((p) => ({ ...p, [index]: "<span class='text-red-500'>Invalid formula</span>" }));
    }
  };

  const insertFormulaIntoOption = (index: number) => {
    const latex = (formulaDrafts[index] || "").trim();
    if (!latex) {
      // nothing to insert
      setOpenPopoverIndex(null);
      return;
    }
    // Append as inline LaTeX between $...$
    setOptions((prev) => {
      const next = [...prev];
      const suffix = ` $${latex}$`;
      next[index] = (next[index] || "") + suffix;
      return next;
    });
    setOpenPopoverIndex(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-w-4xl w-full max-h-[90vh] overflow-y-auto p-8 space-y-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
            Câu {questionNumber} - {questionTypeLabel}
          </DialogTitle>
        </DialogHeader>

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

        <section className="space-y-3">
          <Label className="text-lg font-medium text-gray-700 dark:text-gray-300">
            Các lựa chọn
          </Label>

          {/* Wrap options with RadioGroup to satisfy RadioGroupItem usage */}
          <RadioGroup value={String(correctOptionIndex)} onValueChange={(val) => setCorrectOptionIndex(Number(val))} className="space-y-3">
            {options.map((opt, idx) => {
              const letter = String.fromCharCode(65 + idx);
              return (
                <div key={idx} className="relative group flex items-center gap-3">
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

                  {/* Inline Formula button - appears on hover/focus of group */}
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity">
                    <Popover open={openPopoverIndex === idx} onOpenChange={(open) => setOpenPopoverIndex(open ? idx : null)}>
                      <PopoverTrigger asChild>
                        <button
                          type="button"
                          aria-label={`Chèn công thức cho lựa chọn ${letter}`}
                          title="Chèn công thức"
                          className="h-8 w-8 rounded-md bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 flex items-center justify-center text-sm font-semibold"
                        >
                          ∑
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[320px] p-3">
                        <div className="space-y-2">
                          <Label className="text-sm">Nhập LaTeX</Label>
                          <textarea
                            value={formulaDrafts[idx] ?? ""}
                            onChange={(e) => updateFormulaDraft(idx, e.target.value)}
                            className="w-full min-h-[80px] rounded-md border px-2 py-2 text-sm bg-white dark:bg-gray-800"
                            placeholder="Ví dụ: \frac{a}{b} hoặc x^2 + y^2 = z^2"
                            aria-label={`LaTeX cho lựa chọn ${letter}`}
                          />

                          <div>
                            <Label className="text-sm">Xem trước</Label>
                            <div className="mt-2 min-h-[44px] rounded-md border bg-white dark:bg-gray-900 p-2">
                              <div
                                dangerouslySetInnerHTML={{
                                  __html: previewHtml[idx] ?? (formulaDrafts[idx] ? katex.renderToString(formulaDrafts[idx], { throwOnError: false, displayMode: true }) : "<span class='text-muted-foreground'>Preview</span>"),
                                }}
                              />
                            </div>
                          </div>

                          <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => { setOpenPopoverIndex(null); }}>
                              Hủy
                            </Button>
                            <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={() => insertFormulaIntoOption(idx)}>
                              Chèn
                            </Button>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              );
            })}
          </RadioGroup>
        </section>

        <section className="space-y-2">
          <Label className="text-lg font-medium text-gray-700 dark:text-gray-300">Độ khó</Label>
          <RadioGroup
            value={difficulty}
            onValueChange={(val) => setDifficulty(val as MultipleChoiceQuestion["difficulty"])}
            className="flex flex-wrap gap-8"
          >
            {["Nhận biết", "Thông hiểu", "Vận dụng", "Vận dụng cao"].map((level) => (
              <div key={level} className="flex items-center gap-2">
                <RadioGroupItem value={level} id={`difficulty-${level}`} className="h-5 w-5 text-orange-600" />
                <Label htmlFor={`difficulty-${level}`} className="cursor-pointer select-none text-gray-900 dark:text-gray-100">{level}</Label>
              </div>
            ))}
          </RadioGroup>
        </section>

        <section className="space-y-2">
          <Label htmlFor="explanation" className="text-lg font-medium text-gray-700 dark:text-gray-300">Lời giải</Label>
          <ReactQuill
            theme="snow"
            value={explanation}
            onChange={setExplanation}
            placeholder="Nhập lời giải..."
            className="h-32 rounded-md border border-gray-300 dark:border-gray-600 shadow-sm"
          />
        </section>

        <section className="space-y-2">
          <Label htmlFor="video-link" className="text-lg font-medium text-gray-700 dark:text-gray-300">Video tham khảo</Label>
          <input
            id="video-link"
            type="text"
            value={videoLink}
            onChange={(e) => setVideoLink(e.target.value)}
            placeholder="Nhập link video tham khảo"
            className="w-full rounded-md border border-gray-300 px-4 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder:text-gray-500"
          />
        </section>

        <DialogFooter className="flex justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
          <Button variant="outline" onClick={onClose}>Hủy</Button>
          <Button onClick={handleSave} className="bg-orange-500 hover:bg-orange-600 text-white">Cập nhật</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddMultipleChoiceQuestionModal;