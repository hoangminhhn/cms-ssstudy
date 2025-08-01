import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { List, PlusCircle, LayoutGrid } from 'lucide-react'; // Import LayoutGrid icon

interface SubMenuItem {
  id: string;
  label: string;
  icon: React.ElementType;
  path: string;
}

const subMenuItems: SubMenuItem[] = [
  { id: 'all-word-exams', label: 'Tất cả đề thi', icon: List, path: '/word-exam-upload?tab=all-word-exams' },
  { id: 'add-word-exam', label: 'Thêm đề bằng file word', icon: PlusCircle, path: '/word-exam-upload?tab=add-word-exam' },
  { id: 'exam-categories', label: 'Danh mục kỳ thi', icon: LayoutGrid, path: '/word-exam-upload?tab=exam-categories' },
  { id: 'test-categories', label: 'Danh mục bài kiểm tra', icon: LayoutGrid, path: '/word-exam-upload?tab=test-categories' }, // New item
];

const WordExamSubMenu: React.FC = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const activeTab = searchParams.get('tab') || 'all-word-exams'; // Default to 'all-word-exams'

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

export default WordExamSubMenu;