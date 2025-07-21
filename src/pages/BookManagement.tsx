import React from 'react';
import Layout from '@/components/Layout';
import BookTable from '@/components/BookTable';
import { MadeWithDyad } from '@/components/made-with-dyad';
import BookSubMenuSheet from '@/components/BookSubMenuSheet';
import { Button } from '@/components/ui/button';
import { Menu, Book, PlusCircle, List, Tag, Star, FilePlus, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import Header from '@/components/Header';

const BookManagement: React.FC = () => {
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);
  const [activeSubMenuItem, setActiveSubMenuItem] = React.useState('all-books');
  const [isDesktopSubMenuOpen, setIsDesktopSubMenuOpen] = React.useState(true); // State for desktop sub-menu visibility

  const renderContent = () => {
    switch (activeSubMenuItem) {
      case 'all-books':
        return <BookTable />;
      case 'add-book':
        return <div className="p-4">Nội dung cho "Thêm sách" sẽ ở đây.</div>;
      case 'book-categories':
        return <div className="p-4">Nội dung cho "Danh mục sách" sẽ ở đây.</div>;
      case 'add-category':
        return <div className="p-4">Nội dung cho "Thêm danh mục" sẽ ở đây.</div>;
      case 'book-reviews':
        return <div className="p-4">Nội dung cho "Đánh giá sách" sẽ ở đây.</div>;
      case 'add-review':
        return <div className="p-4">Nội dung cho "Thêm đánh giá sách" sẽ ở đây.</div>;
      default:
        return <BookTable />;
    }
  };

  const menuItems = [
    { value: 'all-books', label: 'Tất cả sách', icon: Book },
    { value: 'add-book', label: 'Thêm sách', icon: PlusCircle },
    { value: 'book-categories', label: 'Danh mục sách', icon: List },
    { value: 'add-category', label: 'Thêm danh mục', icon: Tag },
    { value: 'book-reviews', label: 'Đánh giá sách', icon: Star },
    { value: 'add-review', label: 'Thêm đánh giá sách', icon: FilePlus },
  ];

  return (
    <Layout>
      {/* Use Header with toggle menu button and title */}
      <Header onToggleMenu={() => setIsSheetOpen(true)} title="Quản lý sách" />

      <div className="flex flex-col gap-6">
        {/* Mobile sub-menu sheet */}
        <BookSubMenuSheet
          isOpen={isSheetOpen}
          onOpenChange={setIsSheetOpen}
          onSelectMenuItem={setActiveSubMenuItem}
          activeItem={activeSubMenuItem}
        />

        {/* Desktop layout */}
        <div className={cn(
          "hidden lg:grid gap-6",
          isDesktopSubMenuOpen ? "lg:grid-cols-[200px_1fr]" : "lg:grid-cols-1" // Adjust grid columns based on collapse state
        )}>
          {/* Collapsible desktop sub-menu panel (conditionally rendered) */}
          {isDesktopSubMenuOpen && (
            <div className="flex flex-col border-r bg-gray-50/40 dark:bg-gray-800/40 transition-all duration-300 ease-in-out w-[200px]">
              <div className="flex items-center justify-end p-4 border-b">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsDesktopSubMenuOpen(false)} // Collapse button
                  className="text-orange-600 hover:text-orange-700 dark:text-orange-50 dark:hover:text-orange-100"
                >
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  <span className="text-sm font-medium">THU GỌN</span>
                </Button>
              </div>
              <nav className="grid items-start px-2 text-sm font-medium py-2">
                {menuItems.map((item) => (
                  <Button
                    key={item.value}
                    variant="ghost"
                    className={cn(
                      "flex items-center justify-start gap-3 rounded-lg px-3 py-2 text-gray-900 transition-all hover:bg-gray-100 dark:text-gray-50 dark:hover:bg-gray-800",
                      activeSubMenuItem === item.value && "bg-orange-100 text-orange-600 dark:bg-orange-800 dark:text-orange-50"
                    )}
                    onClick={() => setActiveSubMenuItem(item.value)}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </Button>
                ))}
              </nav>
            </div>
          )}

          {/* Main content area for desktop */}
          <div className="flex flex-col flex-1">
            <div className="flex items-center gap-4 mb-4"> {/* Header for content area */}
              {!isDesktopSubMenuOpen && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsDesktopSubMenuOpen(true)} // Expand button
                  className="text-orange-600 hover:text-orange-700 dark:text-orange-50 dark:hover:text-orange-100"
                >
                  <ChevronRight className="h-4 w-4 mr-2" />
                  <span className="text-sm font-medium">MỞ RỘNG</span>
                </Button>
              )}
            </div>
            {renderContent()}
          </div>
        </div>

        {/* Mobile content (only content, sheet handles navigation) */}
        <div className="lg:hidden">
          {renderContent()}
        </div>
      </div>
      <MadeWithDyad />
    </Layout>
  );
};

export default BookManagement;