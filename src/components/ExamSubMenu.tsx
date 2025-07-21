import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { List, PlusCircle, LayoutGrid, AlertTriangle, Plus } from 'lucide-react'; // Removed FileText icon

interface SubMenuItem {
  id: string;
  label: string;
  icon: React.ElementType;
  path: string;
}

const subMenuItems: SubMenuItem[] = [
  { id: 'all-exams', label: 'Tất cả đề', icon: List, path: '/exams?tab=all-exams' },
  { id: 'add-exam', label: 'Thêm đề', icon: PlusCircle, path: '/exams?tab=add-exam' },
  // Removed: { id: 'word-exam-upload', label: 'Đề thi file word', icon: FileText, path: '/exams?tab=word-exam-upload' },
  { id: 'exam-categories', label: 'Danh mục đề', icon: LayoutGrid, path: '/exams?tab=exam-categories' },
  { id: 'add-category', label: 'Thêm danh mục', icon: Plus, path: '/exams?tab=add-category' },
  { id: 'exam-reports', label: 'Báo lỗi', icon: AlertTriangle, path: '/exams?tab=exam-reports' },
];

const ExamSubMenu: React.FC = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const activeTab = searchParams.get('tab') || 'all-exams'; // Default to 'all-exams'

  return (
    <div className="ml-4 border-l border-gray-200 dark:border-gray-700 pl-2 py-1">
      <nav className="grid items-start text-sm font-medium gap-1">
        {subMenuItems.map((item) => (
          <Link
            key={item.id}
            to={item.path}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 transition-all hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700",
              activeTab === item.id && "bg-orange-100 text-orange-600 dark:bg-orange-800 dark:text-orange-50"
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default ExamSubMenu;