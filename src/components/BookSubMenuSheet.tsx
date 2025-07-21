import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu, Book, PlusCircle, List, Tag, Star, FilePlus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BookSubMenuSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectMenuItem: (item: string) => void;
  activeItem: string;
}

const BookSubMenuSheet: React.FC<BookSubMenuSheetProps> = ({ isOpen, onOpenChange, onSelectMenuItem, activeItem }) => {
  const menuItems = [
    { value: 'all-books', label: 'Tất cả sách', icon: Book },
    { value: 'add-book', label: 'Thêm sách', icon: PlusCircle },
    { value: 'book-categories', label: 'Danh mục sách', icon: List },
    { value: 'add-category', label: 'Thêm danh mục', icon: Tag },
    { value: 'book-reviews', label: 'Đánh giá sách', icon: Star },
    { value: 'add-review', label: 'Thêm đánh giá sách', icon: FilePlus },
  ];

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-64 p-0 pt-10">
        <SheetHeader className="px-4 pb-4">
          <SheetTitle className="text-xl font-semibold">Quản lý sách</SheetTitle>
        </SheetHeader>
        <nav className="grid items-start px-2 text-sm font-medium">
          {menuItems.map((item) => (
            <Button
              key={item.value}
              variant="ghost"
              className={cn(
                "flex items-center justify-start gap-3 rounded-lg px-3 py-2 text-gray-900 transition-all hover:bg-gray-100 dark:text-gray-50 dark:hover:bg-gray-800",
                activeItem === item.value && "bg-orange-100 text-orange-600 dark:bg-orange-800 dark:text-orange-50"
              )}
              onClick={() => {
                onSelectMenuItem(item.value);
                onOpenChange(false); // Close sheet after selection
              }}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Button>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
};

export default BookSubMenuSheet;