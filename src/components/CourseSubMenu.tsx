import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { List, PlusCircle, LayoutGrid, Plus, ClipboardList, BookOpen } from 'lucide-react';

interface SubMenuItem {
  id: string;
  label: string;
  icon: React.ElementType;
  path: string;
}

const subMenuItems: SubMenuItem[] = [
  { id: 'online-classes', label: 'Lớp Online', icon: List, path: '/courses?tab=online-classes' },
  { id: 'offline-classes', label: 'Lớp Offline', icon: List, path: '/courses?tab=offline-classes' },
  { id: 'add-class', label: 'Thêm lớp', icon: PlusCircle, path: '/courses?tab=add-class' },
  { id: 'subjects', label: 'Môn học', icon: BookOpen, path: '/courses?tab=subjects' },
  { id: 'add-subject', label: 'Thêm môn học', icon: Plus, path: '/courses?tab=add-subject' },
  { id: 'categories', label: 'Danh mục', icon: LayoutGrid, path: '/courses?tab=categories' },
  { id: 'add-category', label: 'Thêm danh mục', icon: Plus, path: '/courses?tab=add-category' },
  { id: 'course-reviews', label: 'Đánh giá khóa học', icon: ClipboardList, path: '/courses?tab=course-reviews' },
  { id: 'add-course-review', label: 'Thêm đánh giá', icon: PlusCircle, path: '/courses?tab=add-course-review' },
];

const CourseSubMenu: React.FC = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const activeTab = searchParams.get('tab') || 'online-classes';

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

export default CourseSubMenu;