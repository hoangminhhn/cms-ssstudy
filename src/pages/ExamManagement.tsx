import React from 'react';
import Layout from '@/components/Layout';
import ExamTable from '@/components/ExamTable';
import { MadeWithDyad } from '@/components/made-with-dyad';
import { useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';

const ExamManagement: React.FC = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const activeTab = searchParams.get('tab') || 'all-exams'; // Default to 'all-exams'

  const renderContent = () => {
    switch (activeTab) {
      case 'all-exams':
        return <ExamTable />;
      case 'add-exam':
        return <div className="p-4">Nội dung cho "Thêm đề" sẽ ở đây.</div>;
      case 'exam-categories':
        return <div className="p-4">Nội dung cho "Danh mục đề" sẽ ở đây.</div>;
      case 'add-category':
        return <div className="p-4">Nội dung cho "Thêm danh mục" sẽ ở đây.</div>;
      case 'exam-reports':
        return <div className="p-4">Nội dung cho "Báo lỗi" sẽ ở đây.</div>;
      default:
        return <ExamTable />;
    }
  };

  return (
    <Layout headerTitle="Quản lý đề thi">
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
            <h2 className="text-lg font-semibold">Quản lý đề thi</h2>
            <div className="w-16" /> {/* Placeholder */}
          </div>
        </div>
        {renderContent()}
      </div>
      <MadeWithDyad />
    </Layout>
  );
};

export default ExamManagement;