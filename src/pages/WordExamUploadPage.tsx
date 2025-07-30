import React from 'react';
import Layout from '@/components/Layout';
import { MadeWithDyad } from '@/components/made-with-dyad';
import { useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import ExamTable from '@/components/ExamTable';
import WordExamUpload from '@/components/WordExamUpload';
import ExamCategoryManagement from '@/components/ExamCategoryManagement';
import EditExamFormCategory from '@/components/EditExamFormCategory'; // Import the new component

const WordExamUploadPage: React.FC = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const activeTab = searchParams.get('tab') || 'all-word-exams'; // Default to 'all-word-exams'
  const categoryId = searchParams.get('categoryId'); // Get categoryId for editing

  const getHeaderTitle = () => {
    switch (activeTab) {
      case 'all-word-exams':
        return 'Tất cả đề thi Word';
      case 'add-word-exam':
        return 'Thêm đề bằng file Word';
      case 'exam-categories':
        return 'Danh mục kỳ thi';
      case 'edit-category':
        return `Chỉnh sửa danh mục #${categoryId}`;
      default:
        return 'Quản lý đề thi Word';
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'all-word-exams':
        return <ExamTable />;
      case 'add-word-exam':
        return <WordExamUpload />;
      case 'exam-categories':
        return <ExamCategoryManagement />;
      case 'edit-category':
        return <EditExamFormCategory />; // Render the new component here
      default:
        return <ExamTable />;
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

export default WordExamUploadPage;