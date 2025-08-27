import React from 'react';
import Layout from '@/components/Layout';
import BookTable from '@/components/BookTable';
import { MadeWithDyad } from '@/components/made-with-dyad';
import { useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import AddBookForm from '@/components/AddBookForm';
import BookCategoryManagement from '@/components/BookCategoryManagement'; // Import new component
import EditBookCategoryForm from '@/components/EditBookCategoryForm'; // Import new component

const BookManagement: React.FC = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const activeTab = searchParams.get('tab') || 'all-books'; // Default to 'all-books'
  const categoryId = searchParams.get('categoryId'); // Get categoryId for editing

  const getHeaderTitle = () => {
    switch (activeTab) {
      case 'all-books':
        return 'Quản lý sách';
      case 'add-book':
        return 'Thêm sách mới';
      case 'book-categories':
        return 'Danh mục sách';
      case 'add-category':
        return 'Thêm danh mục sách'; // This tab will now be handled by BookCategoryManagement
      case 'edit-category':
        return `Chỉnh sửa danh mục sách #${categoryId}`;
      case 'book-reviews':
        return 'Đánh giá sách';
      case 'add-review':
        return 'Thêm đánh giá sách';
      default:
        return 'Quản lý sách';
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'all-books':
        return <BookTable />;
      case 'add-book':
        return <AddBookForm />;
      case 'book-categories':
      case 'add-category': // Add category form is part of BookCategoryManagement
        return <BookCategoryManagement />;
      case 'edit-category':
        return <EditBookCategoryForm />;
      case 'book-reviews':
        return <div className="p-4">Nội dung cho "Đánh giá sách" sẽ ở đây.</div>;
      case 'add-review':
        return <div className="p-4">Nội dung cho "Thêm đánh giá sách" sẽ ở đây.</div>;
      default:
        return <BookTable />;
    }
  };

  return (
    <Layout headerTitle={getHeaderTitle()}>
      <div className="flex flex-col gap-6 w-full overflow-x-hidden">
        {/* Mobile content - This section is for a placeholder mobile submenu implementation */}
        <div className="lg:hidden w-full overflow-x-hidden">
          <div className="flex items-center justify-between px-4 py-2 border-b bg-gray-50 dark:bg-gray-800">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => alert('Mobile submenu toggle (implement sheet/drawer)')}
              className="flex items-center gap-1 text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300"
            >
              <ChevronRight className="h-4 w-4" />
              <span className="text-sm font-semibold">MỞ RỘNG</span>
            </Button>
            <h2 className="text-lg font-semibold">{getHeaderTitle()}</h2>
            <div className="w-16" /> {/* Placeholder */}
          </div>
        </div>
        {renderContent()}
      </div>
      <MadeWithDyad />
    </Layout>
  );
};

export default BookManagement;