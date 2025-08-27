import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { BookOpen, PlusCircle, LayoutGrid, MessageSquare, Plus, MessageSquarePlus } from 'lucide-react';

interface SubMenuItem {
  id: string;
  label: string;
  icon: React.ElementType;
  path: string;
}

const subMenuItems: SubMenuItem[] = [
  { id: 'all-books', label: 'Tất cả sách', icon: BookOpen, path: '/books?tab=all-books' },
  { id: 'add-book', label: 'Thêm sách', icon: PlusCircle, path: '/books?tab=add-book' },
  { id: 'book-categories', label: 'Danh mục sách', icon: LayoutGrid, path: '/books?tab=book-categories' },
  { id: 'add-category', label: 'Thêm danh mục', icon: Plus, path: '/books?tab=add-category' },
  { id: 'book-reviews', label: 'Đánh giá sách', icon: MessageSquare, path: '/books?tab=book-reviews' },
  { id: 'add-review', label: 'Thêm đánh giá sách', icon: MessageSquarePlus, path: '/books?tab=add-review' },
];

const BookSubMenu: React.FC = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const activeTab = searchParams.get('tab') || 'all-books'; // Default to 'all-books'

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

export default BookSubMenu;