import React from "react";
import { Folder, FileText, ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface LessonItem {
  id: string;
  title: string;
  duration?: string;
  free?: boolean;
}

export interface LessonRowProps {
  id: string;
  title: string;
  grade?: string;
  subject?: string;
  meta?: string;
  type?: "chapter" | "lesson";
  isExpanded?: boolean;
  onToggleExpand?: (id: string) => void;
  lessons?: LessonItem[];
  onEditLesson?: (id: string) => void;
  onDeleteLesson?: (id: string) => void;
}

const LessonRow: React.FC<LessonRowProps> = ({ 
  id, 
  title, 
  grade, 
  subject, 
  meta, 
  type, 
  isExpanded, 
  onToggleExpand,
  lessons = [],
  onEditLesson,
  onDeleteLesson
}) => {
  return (
    <div className="border border-transparent hover:border-gray-200 dark:hover:border-gray-700 bg-white dark:bg-gray-800 rounded-md transition-colors">
      <div
        className={cn(
          "flex items-center gap-4 p-4 cursor-pointer",
          type === "chapter" && "hover:bg-orange-50 dark:hover:bg-orange-900/20"
        )}
        onClick={() => type === "chapter" && onToggleExpand?.(id)}
      >
        <div className="flex items-center gap-3">
          <div className={cn(
            "p-2 rounded-md",
            type === "chapter" 
              ? "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400" 
              : "bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-200"
          )}>
            {type === "chapter" ? <Folder className="h-6 w-6" /> : <FileText className="h-6 w-6" />}
          </div>
          {type === "chapter" && (
            <div className="text-gray-500">
              {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-medium truncate">{title}</h3>
            {grade && (
              <span className="text-xs font-medium bg-orange-100 text-orange-600 px-2 py-0.5 rounded-md">
                {grade}
              </span>
            )}
            {subject && (
              <span className="text-xs font-medium bg-pink-100 text-pink-700 px-2 py-0.5 rounded-md">
                {subject}
              </span>
            )}
          </div>
          {meta && <div className="text-xs text-muted-foreground mt-1 truncate">{meta}</div>}
        </div>

        <div className="text-sm text-muted-foreground flex items-center gap-2">
          <div className="flex items-center gap-1">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs">{type === "chapter" ? "Chương" : "Bài học"}</span>
          </div>
        </div>
      </div>

      {type === "chapter" && isExpanded && lessons.length > 0 && (
        <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/20 p-4">
          <div className="space-y-2">
            {lessons.map((lesson) => (
              <div key={lesson.id} className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">{lesson.title}</h4>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                      {lesson.duration && (
                        <span>{lesson.duration}</span>
                      )}
                      {lesson.free && (
                        <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                          Miễn phí
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    className="text-xs text-blue-600 hover:text-blue-800"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditLesson?.(lesson.id);
                    }}
                  >
                    Chỉnh sửa
                  </button>
                  <button 
                    className="text-xs text-red-600 hover:text-red-800"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteLesson?.(lesson.id);
                    }}
                  >
                    Xóa
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LessonRow;