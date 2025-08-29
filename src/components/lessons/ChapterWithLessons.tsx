import React, { useState } from "react";
import { ChevronDown, ChevronRight, Folder, FileText, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface LessonItem {
  id: string;
  title: string;
  grade?: string;
  subject?: string;
  meta?: string;
  type?: "chapter" | "lesson";
  duration?: string;
  free?: boolean;
}

interface ChapterWithLessonsProps {
  chapter: LessonItem;
  lessons: LessonItem[];
  onAddLesson: (chapterId: string) => void;
  onEditLesson?: (lessonId: string) => void;
  onDeleteLesson?: (lessonId: string) => void;
}

const ChapterWithLessons: React.FC<ChapterWithLessonsProps> = ({
  chapter,
  lessons,
  onAddLesson,
  onEditLesson,
  onDeleteLesson
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="border rounded-md overflow-hidden bg-white dark:bg-gray-800">
      {/* Chapter row */}
      <div 
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-md bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400">
            <Folder className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-sm font-medium">{chapter.title}</h3>
            <div className="flex items-center gap-2 mt-1">
              {chapter.grade && (
                <span className="text-xs font-medium bg-orange-100 text-orange-600 px-2 py-0.5 rounded-md">
                  {chapter.grade}
                </span>
              )}
              {chapter.subject && (
                <span className="text-xs font-medium bg-pink-100 text-pink-700 px-2 py-0.5 rounded-md">
                  {chapter.subject}
                </span>
              )}
              <span className="text-xs text-muted-foreground">
                {lessons.length} bài học
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            className="bg-orange-500 hover:bg-orange-600 text-white"
            onClick={(e) => {
              e.stopPropagation();
              onAddLesson(chapter.id);
            }}
          >
            <Plus className="h-4 w-4 mr-1" />
            Thêm bài học
          </Button>
          {isExpanded ? (
            <ChevronDown className="h-5 w-5 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          )}
        </div>
      </div>

      {/* Lessons dropdown */}
      {isExpanded && (
        <div className="border-t bg-gray-50 dark:bg-gray-900 p-2">
          {lessons.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground text-sm">
              Chưa có bài học nào trong chương này
            </div>
          ) : (
            <div className="space-y-2">
              {lessons.map((lesson) => (
                <div 
                  key={lesson.id} 
                  className="flex items-center justify-between p-3 rounded-md hover:bg-white dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-200">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">{lesson.title}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        {lesson.duration && (
                          <span className="text-xs text-muted-foreground">
                            {lesson.duration}
                          </span>
                        )}
                        {lesson.free && (
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                            Miễn phí
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onEditLesson?.(lesson.id)}
                    >
                      Chỉnh sửa
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-red-600"
                      onClick={() => onDeleteLesson?.(lesson.id)}
                    >
                      Xóa
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ChapterWithLessons;