"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Plus } from "lucide-react";

interface ExamPart {
  id: string;
  name: string;
}

interface EditExamFormCategoryProps {
  initialParts: ExamPart[];
  onSave: (parts: ExamPart[]) => void;
}

const EditExamFormCategory: React.FC<EditExamFormCategoryProps> = ({ initialParts, onSave }) => {
  const [parts, setParts] = useState<ExamPart[]>(initialParts);
  const [expandedPartIds, setExpandedPartIds] = useState<Set<string>>(new Set());

  const togglePartExpanded = (partId: string) => {
    setExpandedPartIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(partId)) {
        newSet.delete(partId);
      } else {
        newSet.add(partId);
      }
      return newSet;
    });
  };

  const handlePartNameChange = (partId: string, newName: string) => {
    setParts((prev) =>
      prev.map((p) => (p.id === partId ? { ...p, name: newName } : p))
    );
  };

  const handleAddPart = () => {
    const newPart: ExamPart = {
      id: `part-${Date.now()}`,
      name: "Phần thi mới",
    };
    setParts((prev) => [...prev, newPart]);
  };

  const handleSave = () => {
    onSave(parts);
  };

  return (
    <div className="p-4 bg-white rounded-md shadow-md max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Quản lý phần thi</h2>

      <div className="space-y-4">
        {parts.map((part, index) => {
          const isExpanded = expandedPartIds.has(part.id);
          const prefix = `Phần ${index + 1}`;
          return (
            <div key={part.id} className="border rounded-md p-4">
              <div
                className="flex items-center justify-between mb-2 cursor-pointer select-none"
                onClick={() => togglePartExpanded(part.id)}
              >
                <div className="flex items-center gap-2">
                  {isExpanded ? (
                    <ChevronUp className="h-5 w-5" />
                  ) : (
                    <ChevronDown className="h-5 w-5" />
                  )}
                  <span className="font-semibold text-lg select-none">{prefix}:</span>
                  <Input
                    value={part.name}
                    onChange={(e) => handlePartNameChange(part.id, e.target.value)}
                    className="flex-1"
                    placeholder="Tên phần thi"
                  />
                </div>
              </div>
              {/* Bỏ phần con và các chức năng khác */}
              {isExpanded && (
                <div className="text-sm text-gray-500 italic">
                  Chỉ cho phép chỉnh sửa tên phần thi.
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex justify-between">
        <Button onClick={handleAddPart} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Thêm phần thi
        </Button>
        <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white">
          Lưu
        </Button>
      </div>
    </div>
  );
};

export default EditExamFormCategory;