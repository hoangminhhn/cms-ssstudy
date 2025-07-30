import React from 'react';
import Layout from '@/components/Layout';
import { MadeWithDyad } from '@/components/made-with-dyad';
import { useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';

// Removed imports for WordExamUpload, CreateExamFromBankForm, TemplateBuilder as they are no longer directly rendered by default

const WordExamUploadPage: React.FC = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const activeTab = searchParams.get('tab') || 'all-word-exams'; // Default to 'all-word-exams'

  const getHeaderTitle = () => {
    // Since only 'all-word-exams' is expected, simplify the title logic
    return 'Tất cả đề thi file Word';
  };

  const renderContent = () => {
    // Since only 'all-word-exams' is expected, provide a placeholder
    return (
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-4">Tất cả đề thi file Word</h3>
        <p className="text-muted-foreground">Đây là nơi bạn sẽ phát triển lại nội dung cho mục "Tất cả đề thi file Word".</p>
      </div>
    );
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