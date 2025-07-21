import React from 'react';
import Layout from '@/components/Layout';
import BookTable from '@/components/BookTable';
import { MadeWithDyad } from '@/components/made-with-dyad';
import BookSubMenuSheet from '@/components/BookSubMenuSheet';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';

const BookManagement: React.FC = () => {
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);
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

  return (
    <Layout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" className="lg:hidden" onClick={() => setIsSheetOpen(true)}>
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
          <h1 className="text-2xl font-semibold">Quản lý sách</h1>
        </div>
        
        <BookSubMenuSheet
          isOpen={isSheetOpen}
          onOpenChange={setIsSheetOpen}
          onSelectMenuItem={setActiveSubMenuItem}
          activeItem={activeSubMenuItem}
        />

        {/* Desktop sub-menu (always visible on large screens) */}
        <div className="hidden lg:grid lg:grid-cols-[200px_1fr] gap-6">
          <nav className="grid items-start px-2 text-sm font-medium">
            <Button
              variant="ghost"
              className={cn(
                "flex items-center justify-start gap-3 rounded-lg px-3 py-2 text-gray-900 transition-all hover:bg-gray-100 dark:text-gray-50 dark:hover:bg-gray-800",
                activeSubMenuItem === 'all-books' && "bg-orange-100 text-orange-600 dark:bg-orange-800 dark:text-orange-50"
              )}
              onClick={() => setActiveSubMenuItem('all-books')}
            >
              <Book className="h-5 w-5" />
              Tất cả sách
            </Button>
            <Button
              variant="ghost"
              className={cn(
                "flex items-center justify-start gap-3 rounded-lg px-3 py-2 text-gray-900 transition-all hover:bg-gray-100 dark:text-gray-50 dark:hover:bg-gray-800",
                activeSubMenuItem === 'add-book' && "bg-orange-100 text-orange-600 dark:bg-orange-800 dark:text-orange-50"
              )}
              onClick={() => setActiveSubMenuItem('add-book')}
            >
              <PlusCircle className="h-5 w-5" />
              Thêm sách
            </Button>
            <Button
              variant="ghost"
              className={cn(
                "flex items-center justify-start gap-3 rounded-lg px-3 py-2 text-gray-900 transition-all hover:bg-gray-100 dark:text-gray-50 dark:hover:bg-gray-800",
                activeSubMenuItem === 'book-categories' && "bg-orange-100 text-orange-600 dark:bg-orange-800 dark:text-orange-50"
              )}
              onClick={() => setActiveSubMenuItem('book-categories')}
            >
              <List className="h-5 w-5" />
              Danh mục sách
            </Button>
            <Button
              variant="ghost"
              className={cn(
                "flex items-center justify-start gap-3 rounded-lg px-3 py-2 text-gray-900 transition-all hover:bg-gray-100 dark:text-gray-50 dark:hover:bg-gray-800",
                activeSubMenuItem === 'add-category' && "bg-orange-100 text-orange-600 dark:bg-orange-800 dark:text-orange-50"
              )}
              onClick={() => setActiveSubMenuItem('add-category')}
            >
              <Tag className="h-5 w-5" />
              Thêm danh mục
            </Button>
            <Button
              variant="ghost"
              className={cn(
                "flex items-center justify-start gap-3 rounded-lg px-3 py-2 text-gray-900 transition-all hover:bg-gray-100 dark:text-gray-50 dark:hover:bg-gray-800",
                activeSubMenuItem === 'book-reviews' && "bg-orange-100 text-orange-600 dark:bg-orange-800 dark:text-orange-50"
              )}
              onClick={() => setActiveSubMenuItem('book-reviews')}
            >
              <Star className="h-5 w-5" />
              Đánh giá sách
            </Button>
            <Button
              variant="ghost"
              className={cn(
                "flex items-center justify-start gap-3 rounded-lg px-3 py-2 text-gray-900 transition-all hover:bg-gray-100 dark:text-gray-50 dark:hover:bg-gray-800",
                activeSubMenuItem === 'add-review' && "bg-orange-100 text-orange-600 dark:bg-orange-800 dark:text-orange-50"
              )}
              onClick={() => setActiveSubMenuItem('add-review')}
            >
              <FilePlus className="h-5 w-5" />
              Thêm đánh giá sách
            </Button>
          </nav>
          <div className="flex-1">
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