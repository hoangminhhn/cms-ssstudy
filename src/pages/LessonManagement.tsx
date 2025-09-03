"use client";

import React, { useState } from "react";

/**
 * This page replaces the previous LessonManagement implementation with a
 * type-safe version of LessonItem and a simple LessonsList component
 * so the items variable is correctly typed and the compiler error is resolved.
 *
 * The key fix: use a discriminated union for `type` ("chapter" | "lesson")
 * and ensure all items adhere to that type (use explicit literal types).
 */

/* Lesson item types */
export type LessonItem =
  | {
      id: string;
      title: string;
      grade: string;
      subject: string;
      meta: string;
      type: "chapter";
    }
  | {
      id: string;
      title: string;
      grade: string;
      subject: string;
      meta: string;
      type: "lesson";
      duration: string;
      free: boolean;
    };

/* Simple LessonsList component used by this page */
const LessonsList: React.FC<{
  items: LessonItem[];
  onEditLesson?: (item: LessonItem) => void;
}> = ({ items, onEditLesson }) => {
  return (
    <div className="space-y-2">
      {items.map((it) => (
        <div
          key={it.id}
          className="p-3 border rounded flex items-center justify-between bg-white dark:bg-gray-800"
        >
          <div>
            <div className="font-medium">{it.title}</div>
            <div className="text-sm text-muted-foreground">
              {it.grade} • {it.subject} • {it.meta}
            </div>
            <div className="text-xs text-muted-foreground mt-1">Loại: {it.type}</div>
            {"duration" in it && (
              <div className="text-xs text-muted-foreground">Thời lượng: {it.duration} • {it.free ? "Miễn phí" : "Trả phí"}</div>
            )}
          </div>
          <div>
            <button
              onClick={() => onEditLesson?.(it)}
              className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
            >
              Sửa
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

const LessonManagementPage: React.FC = () => {
  // Ensure items are typed exactly as LessonItem[] with proper literal 'type' values
  const [items] = useState<LessonItem[]>([
    {
      id: "1",
      title: "Chương 1: Giới thiệu",
      grade: "Khóa A",
      subject: "Toán",
      meta: "5 bài",
      type: "chapter",
    },
    {
      id: "2",
      title: "Bài 1: Đại số cơ bản",
      grade: "Khóa A",
      subject: "Toán",
      meta: "Video + bài tập",
      type: "lesson",
      duration: "12:34",
      free: true,
    },
    {
      id: "3",
      title: "Bài 2: Phép cộng",
      grade: "Khóa A",
      subject: "Toán",
      meta: "Video",
      type: "lesson",
      duration: "08:20",
      free: false,
    },
  ]);

  const handleEditLesson = (item: LessonItem) => {
    // no-op for demo; in real app this would open the edit modal/page
    console.log("Edit lesson", item);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Quản lý bài học</h1>
      <LessonsList items={items} onEditLesson={handleEditLesson} />
    </div>
  );
};

export default LessonManagementPage;