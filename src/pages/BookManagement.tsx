import React from 'react';
import Layout from '@/components/Layout';
import BookTable from '@/components/BookTable';
import { MadeWithDyad } from '@/components/made-with-dyad';
import { useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import AddBookForm from '@/components/AddBookForm';
import BookCategoryManagement from '@/components/BookCategoryManagement';
import AddBookCategory from '@/components/AddBookCategory';
import BookReviews from '@/components/BookReviews'; // NEW import
import AddBookReview from '@/components/AddBookReview'; // NEW import

const BookManagement: React.FC = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const activeTab = searchParams.get('tab') || 'all-books'; // Default to 'all-books'

  const renderContent = () => {
    switch (activeTab) {
      case 'all-books':
        return <BookTable />;
      case 'add-book':
        return <AddBookForm />;
      case 'book-categories':
        return <BookCategoryManagement />;
      case 'add-category':
        return <AddBookCategory />;
      case 'book-reviews':
        return <BookReviews />; // NEW: render BookReviews here
      case 'add-review':
        return <AddBookReview />; // NEW: render AddBookReview here
      default:
        return <BookTable />;
    }
  };

  return (
    <Layout headerTitle="Quản lý sách">
      <div className="flex flex-col gap-6 w-full overflow-x-hidden">
        {/* Mobile content - placeholder for submenu sheet/drawer */}
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
            <h2 className="text-lg font-semibold">Quản lý sách</h2>
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