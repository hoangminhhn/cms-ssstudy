import React from 'react';
import Layout from '@/components/Layout';
import WordExamUpload from '@/components/WordExamUpload';
import { MadeWithDyad } from '@/components/made-with-dyad';
import { useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';

const WordExamUploadPage: React.FC = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const activeTab = searchParams.get('tab') || 'word-exam-upload'; // Default to 'word-exam-upload'

  const renderContent = () => {
    switch (activeTab) {
      case 'word-exam-upload':
        return <WordExamUpload />;
      case 'question-bank':
        return <div className="p-4">Nội dung cho "Ngân hàng câu hỏi" sẽ ở đây.</div>;
      case 'create-template':
        return <div className="p-4">Nội dung cho "Tạo template đề thi" sẽ ở đây.</div>;
      default:
        return <WordExamUpload />;
    }
  };

  return (
    <Layout headerTitle="Đề thi file word">
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
            <h2 className="text-lg font-semibold">Đề thi file word</h2>
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