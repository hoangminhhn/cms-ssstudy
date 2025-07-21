import React from 'react';
import Layout from '@/components/Layout';
import BookTable from '@/components/BookTable';
import { MadeWithDyad } from '@/components/made-with-dyad';
import BookSubMenu from '@/components/BookSubMenu';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';

const BookManagement: React.FC = () => {
  const [isDesktopSubMenuOpen, setIsDesktopSubMenuOpen] = React.useState(false);
  const [activeSubMenuItem, setActiveSubMenuItem] = React.useState('all-books');

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

  const headerLeftAdornment = !isDesktopSubMenuOpen ? (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setIsDesktopSubMenuOpen(true)}
      className="flex items-center gap-1 text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300"
    >
      <span className="text-sm font-semibold">MỞ RỘNG</span>
      <ChevronRight className="h-4 w-4" />
    </Button>
  ) : null;

  return (
    <Layout headerTitle="Quản lý sách" headerLeftAdornment={headerLeftAdornment}>
      <div className="flex flex-col gap-6 w-full overflow-x-hidden lg:grid" style={{ gridTemplateColumns: isDesktopSubMenuOpen ? '200px 1fr' : '56px 1fr' }}>
        {/* Desktop Submenu */}
        <BookSubMenu
          isExpanded={isDesktopSubMenuOpen}
          onToggle={() => setIsDesktopSubMenuOpen(!isDesktopSubMenuOpen)}
          activeItem={activeSubMenuItem}
          onSelectMenuItem={setActiveSubMenuItem}
        />

        {/* Main Content Area */}
        <div className="flex flex-col flex-1 w-full overflow-x-hidden">
          {/* Removed the redundant header div here as content is now passed to Layout/Header */}
          {renderContent()}
        </div>

        {/* Mobile content - You might want to add a sheet/drawer for mobile submenu here if needed */}
        <div className="lg:hidden w-full overflow-x-hidden">
          <div className="flex items-center justify-between px-4 py-2 border-b bg-gray-50 dark:bg-gray-800">
            <Button
              variant="ghost"
              size="sm"
              // This button could open a mobile sheet/drawer for the submenu
              onClick={() => alert('Mobile submenu toggle (implement sheet/drawer)')}
              className="flex items-center gap-1 text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300"
            >
              <ChevronRight className="h-4 w-4" />
              <span className="text-sm font-semibold">MỞ RỘNG</span>
            </Button>
            <h2 className="text-lg font-semibold">Quản lý sách</h2>
            <div className="w-16" /> {/* Placeholder */}
          </div>
          {renderContent()}
        </div>
      </div>
      <MadeWithDyad />
    </Layout>
  );
};

export default BookManagement;