import React from "react";
import { Folder, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

export interface LessonRowProps {
  id: string;
  title: string;
  grade?: string;
  subject?: string;
  meta?: string;
  onOpen?: (id: string) => void;
}

const LessonRow: React.FC<LessonRowProps> = ({ id, title, grade, subject, meta, onOpen }) => {
  return (
    <div
      className="flex items-center gap-4 p-4 rounded-md border border-transparent hover:border-gray-200 dark:hover:border-gray-700 bg-white dark:bg-gray-800"
      role="button"
      onClick={() => onOpen?.(id)}
    >
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-md bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-200">
          <Folder className="h-6 w-6" />
        </div>
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
          <span className="text-xs">Thư mục</span>
        </div>
      </div>
    </div>
  );
};

export default LessonRow;