import React from 'react';
import { Book, PlusCircle, List, Tag, Star, FilePlus, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface BookSubMenuProps {
  isExpanded: boolean;
  onToggle: () => void;
  activeItem: string;
  onSelectMenuItem: (item: string) => void;
}

const menuItems = [
  { value: 'all-books', label: 'Tất cả sách', icon: Book },
  { value: 'add-book', label: 'Thêm sách', icon: PlusCircle },
  { value: 'book-categories', label: 'Danh mục sách', icon: List },
  { value: 'add-category', label: 'Thêm danh mục', icon: Tag },
  { value: 'book-reviews', label: 'Đánh giá sách', icon: Star },
  { value: 'add-review', label: 'Thêm đánh giá sách', icon: FilePlus },
];

const BookSubMenu: React.FC<BookSubMenuProps> = ({ isExpanded, onToggle, activeItem, onSelectMenuItem }) => {
  return (
    <div
      className={cn(
        "hidden lg:flex flex-col border-r bg-gray-50/40 dark:bg-gray-800/40 transition-all duration-300 ease-in-out",
        isExpanded ? "w-[200px]" : "w-14"
      )}
    >
      <div className="flex items-center justify-end p-4 border-b">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className="flex items-center gap-1 text-orange-600 hover:text-orange-700 dark:text-orange-50 dark:hover:text-orange-100"
        >
          {isExpanded ? (
            <>
              <ChevronLeft className="h-4 w-4" />
              <span className="text-sm font-semibold">THU GỌN</span>
            </>
          ) : (
            <>
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Mở rộng menu</span>
            </>
          )}
        </Button>
      </div>
      <nav className="grid items-start px-2 text-sm font-medium py-2 overflow-x-hidden">
        {menuItems.map((item) => (
          <Button
            key={item.value}
            variant="ghost"
            className={cn(
              "flex items-center rounded-lg px-3 py-2 text-gray-900 transition-all hover:bg-gray-100 dark:text-gray-50 dark:hover:bg-gray-800",
              isExpanded ? "justify-start gap-3" : "justify-center p-2",
              activeItem === item.value && "bg-orange-100 text-orange-600 dark:bg-orange-800 dark:text-orange-50"
            )}
            onClick={() => onSelectMenuItem(item.value)}
            title={!isExpanded ? item.label : undefined} // Show tooltip on collapsed icon
          >
            <item.icon className="h-5 w-5" />
            {isExpanded && item.label}
          </Button>
        ))}
      </nav>
    </div>
  );
};

export default BookSubMenu;