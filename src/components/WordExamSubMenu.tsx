import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { List, LayoutTemplate } from 'lucide-react';

interface SubMenuItem {
  id: string;
  label: string;
  icon: React.ElementType;
  path: string;
}

const subMenuItems: SubMenuItem[] = [
  { id: 'word-exam-upload', label: 'Tải lên đề Word', icon: List, path: '/word-exam-upload?tab=word-exam-upload' },
  { id: 'question-bank', label: 'Ngân hàng câu hỏi', icon: List, path: '/word-exam-upload?tab=question-bank' },
  { id: 'create-template', label: 'Tạo template đề thi', icon: LayoutTemplate, path: '/word-exam-upload?tab=create-template' },
];

const WordExamSubMenu: React.FC = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const activeTab = searchParams.get('tab') || 'word-exam-upload'; // Default to 'word-exam-upload'

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