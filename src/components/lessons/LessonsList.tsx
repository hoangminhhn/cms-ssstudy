import React from "react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import LessonRow, { LessonRowProps } from "./LessonRow";
import { Card, CardContent } from "@/components/ui/card";

interface LessonItem {
  id: string;
  title: string;
  grade?: string;
  subject?: string;
  meta?: string;
  type?: "chapter" | "lesson";
}

interface LessonsListProps {
  items: LessonItem[];
  onOpen?: (id: string, type?: "chapter" | "lesson") => void;
}

const LessonsList: React.FC<LessonsListProps> = ({ items, onOpen }) => {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [itemsPerPage, setItemsPerPage] = React.useState(20);

  const totalPages = Math.max(1, Math.ceil(items.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, items.length);
  const currentItems = items.slice(startIndex, endIndex);

  React.useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemsPerPage, items.length, totalPages]);

  return (
    <Card>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          {currentItems.length === 0 ? (
            <div className="text-center text-muted-foreground p-6">Không tìm thấy mục nào.</div>
          ) : (
            <div className="space-y-3">
              {currentItems.map((it) => (
                <LessonRow
                  key={it.id}
                  id={it.id}
                  title={it.title}
                  grade={it.grade}
                  subject={it.subject}
                  meta={it.meta}
                  type={it.type}
                  onOpen={onOpen}
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
            từ {items.length === 0 ? 0 : startIndex + 1} đến {endIndex} trong tổng số {items.length}
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