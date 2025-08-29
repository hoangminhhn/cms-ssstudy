import React from "react";
import { FileText, Clock, Calendar, User, Edit, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

export interface TestItem {
  id: string;
  title: string;
  grade: string;
  subject: string;
  teacher: string;
  duration: string;
  questions: number;
  startDate: string;
  endDate: string;
  description: string;
  active: boolean;
  participants?: number;
  completed?: number;
}

interface TestRowProps {
  test: TestItem;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onView: (id: string) => void;
  onToggleActive: (id: string, active: boolean) => void;
}

const TestRow: React.FC<TestRowProps> = ({ test, onEdit, onDelete, onView, onToggleActive }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };

  return (
    <div className="border rounded-md overflow-hidden bg-white dark:bg-gray-800">
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-md bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
              <FileText className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-sm font-medium">{test.title}</h3>
                <span className="text-xs font-medium bg-orange-100 text-orange-600 px-2 py-0.5 rounded-md">
                  {test.grade}
                </span>
                <span className="text-xs font-medium bg-pink-100 text-pink-700 px-2 py-0.5 rounded-md">
                  {test.subject}
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  <span>{test.teacher}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{test.duration} phút</span>
                </div>
                <div className="flex items-center gap-1">
                  <FileText className="h-3 w-3" />
                  <span>{test.questions} câu</span>
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>{formatDate(test.startDate)} - {formatDate(test.endDate)}</span>
                </div>
              </div>
              {test.description && (
                <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                  {test.description}
                </p>
              )}
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-2">
              <Switch checked={test.active} onCheckedChange={(checked) => onToggleActive(test.id, checked)} />
              <span className="text-xs">{test.active ? "Hoạt động" : "Tạm dừng"}</span>
            </div>
            <div className="flex items-center gap-2">
              {test.participants !== undefined && (
                <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                  {test.participants} tham gia
                </span>
              )}
              {test.completed !== undefined && (
                <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 px-2 py-1 rounded">
                  {test.completed} hoàn thành
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="border-t bg-gray-50 dark:bg-gray-900 px-4 py-2 flex justify-end gap-2">
        <Button variant="ghost" size="sm" onClick={() => onView(test.id)}>
          <Eye className="h-4 w-4 mr-1" />
          Xem
        </Button>
        <Button variant="ghost" size="sm" onClick={() => onEdit(test.id)}>
          <Edit className="h-4 w-4 mr-1" />
          Chỉnh sửa
        </Button>
        <Button variant="ghost" size="sm" className="text-red-600" onClick={() => onDelete(test.id)}>
          <Trash2 className="h-4 w-4 mr-1" />
          Xóa
        </Button>
      </div>
    </div>
  );
};

export default TestRow;