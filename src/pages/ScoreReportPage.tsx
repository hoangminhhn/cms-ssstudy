import React from 'react';
import Layout from '@/components/Layout';
import { MadeWithDyad } from '@/components/made-with-dyad';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ScoreReportPage: React.FC = () => {
  const { examId } = useParams<{ examId: string }>();

  return (
    <Layout headerTitle={`Báo cáo điểm đề thi #${examId}`}>
      <div className="flex flex-col gap-6 w-full overflow-x-hidden">
        <Card>
          <CardHeader>
            <CardTitle>Chi tiết báo cáo điểm</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg">Đây là trang báo cáo điểm cho đề thi có mã: <span className="font-bold text-orange-600">{examId}</span></p>
            <p className="text-muted-foreground mt-2">Bạn có thể phát triển các biểu đồ, thống kê và chi tiết điểm số tại đây.</p>
          </CardContent>
        </Card>
      </div>
      <MadeWithDyad />
    </Layout>
  );
};

export default ScoreReportPage;