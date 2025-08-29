import React from "react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import ChapterWithLessons from "./ChapterWithLessons";
import { Card, CardContent } from "@/components/ui/card";

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

interface LessonsListProps {
  items: LessonItem[];
  onEditLesson?: (lessonId: string) => void;
  onDeleteLesson?: (lessonId: string) => void;
}

const LessonsList: React.FC<LessonsListProps> = ({ 
  items, 
  onEditLesson, 
  onDeleteLesson 
}) => {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [itemsPerPage, setItemsPerPage] = React.useState(20);

  // Group items by chapters
  const groupedItems = React.useMemo(() => {
    const groups: { chapter: LessonItem; lessons: LessonItem[] }[] = [];
    let currentChapter: LessonItem | null = null;
    
    items.forEach(item => {
      if (item.type === 'chapter') {
        // Save current chapter and start a new group
        currentChapter = item;
        groups.push({
          chapter: item,
          lessons: []
        });
      } else if (item.type === 'lesson' && currentChapter) {
        // Add lesson to current chapter
        if (groups.length > 0) {
          groups[groups.length - 1].lessons.push(item);
        }
      }
    });
    
    return groups;
  }, [items]);

  const totalPages = Math.max(1, Math.ceil(groupedItems.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, groupedItems.length);
  const currentGroups = groupedItems.slice(startIndex, endIndex);

  React.useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [itemsPerPage, groupedItems.length, totalPages]);

  return (
    <Card>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          {currentGroups.length === 0 ? (
            <div className="text-center text-muted-foreground p-6">Không tìm thấy mục nào.</div>
          ) : (
            <div className="space-y-3">
              {currentGroups.map((group) => (
                <ChapterWithLessons
                  key={group.chapter.id}
                  chapter={group.chapter}
                  lessons={group.lessons}
                  onEditLesson={onEditLesson}
                  onDeleteLesson={onDeleteLesson}
                />
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            Hiển thị
            <Select value={String(itemsPerPage)} onValueChange={(v) => { setItemsPerPage(Number(v)); setCurrentPage(1); }}>
              <SelectTrigger className="w-[70px] h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
            từ {groupedItems.length === 0 ? 0 : startIndex + 1} đến {endIndex} trong tổng số {groupedItems.length}
          </div>

          <div className="flex items-center gap-2">
            <button
              className="px-3 py-1 border rounded disabled:opacity-50"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              ‹
            </button>
            <div className="px-3 py-1 bg-white border rounded text-sm">{currentPage}</div>
            <button
              className="px-3 py-1 border rounded disabled:opacity-50"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              ›
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LessonsList;