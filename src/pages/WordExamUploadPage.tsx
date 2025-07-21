import React from 'react';
import Layout from '@/components/Layout';
import WordExamUpload from '@/components/WordExamUpload';
import { MadeWithDyad } from '@/components/made-with-dyad';

const WordExamUploadPage: React.FC = () => {
  return (
    <Layout headerTitle="Đề thi file word">
      <div className="flex flex-col gap-6 w-full overflow-x-hidden">
        <WordExamUpload />
      </div>
      <MadeWithDyad />
    </Layout>
  );
};

export default WordExamUploadPage;