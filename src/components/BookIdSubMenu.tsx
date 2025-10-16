import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { BookOpen, PlusCircle, LayoutGrid, Plus, MessageSquare, MessageSquarePlus } from 'lucide-react';

interface SubMenuItem {
  id: string;
  label: string;
  icon: React.ElementType;
  path: string;
}

const subMenuItems: SubMenuItem[] = [
  { id: 'all-books-id', label: 'Tất cả sách ID', icon: BookOpen, path: '/books-id?tab=all-books-id' },
  { id: 'add-book-id', label: 'Thêm sách ID', icon: PlusCircle, path: '/books-id?tab=add-book-id' },
  { id: 'book-categories-id', label: 'Danh mục sách ID', icon: LayoutGrid, path: '/books-id?tab=book-categories-id' },
  { id: 'add-category-id', label: 'Thêm danh mục ID', icon: Plus, path: '/books-id?tab=add-category-id' },
  { id: 'book-reviews-id', label: 'Đánh giá sách ID', icon: MessageSquare, path: '/books-id?tab=book-reviews-id' },
  { id: 'add-review-id', label: 'Thêm đánh giá ID', icon: MessageSquarePlus, path: '/books-id?tab=add-review-id' },
];

const BookIdSubMenu: React.FC = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const activeTab = searchParams.get('tab') || 'all-books-id'; // Default to first

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

export default BookIdSubMenu;