import React from 'react';
import Layout from '@/components/Layout';
import { MadeWithDyad } from '@/components/made-with-dyad';
import { useLocation } from 'react-router-dom';
import BookIdToolbar from '@/components/bookid/BookIdToolbar';
import BookIdList from '@/components/bookid/BookIdList';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';

const BookIdManagement: React.FC = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const activeTab = searchParams.get('tab') || 'all-books-id'; // Default to 'all-books-id'

  // Local search handler (could be extended to fetch data)
  const [searchQuery, setSearchQuery] = React.useState<string>("");

  return (
    <Layout headerTitle="Quản lý Sách ID">
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
            <h2 className="text-lg font-semibold">Quản lý Sách ID</h2>
            <div className="w-16" /> {/* Placeholder */}
          </div>
        </div>

        {/* Toolbar specific to Book ID module */}
        <div>
          <BookIdToolbar initialQuery={searchQuery} onSearch={(q) => setSearchQuery(q)} />
        </div>

        {/* Dedicated list for Book ID module */}
        <div>
          <BookIdList query={searchQuery} />
        </div>
      </div>
      <MadeWithDyad />
    </Layout>
  );
};

export default BookIdManagement;