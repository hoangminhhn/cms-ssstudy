import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const WordExamUpload: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Thêm đề thi từ file Word</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="text-center py-10 text-muted-foreground">
            <p>Chức năng của trang này đã được xóa trắng.</p>
            <p>Bạn có thể bắt đầu xây dựng lại chức năng tại đây.</p>
          </div>
        </CardContent>
      </Card>
      <div className="flex justify-end gap-2 p-4 border-t bg-gray-50 dark:bg-gray-800">
        <Button variant="outline">HỦY</Button>
        <Button className="bg-orange-500 hover:bg-orange-600 text-white">LƯU</Button>
      </div>
    </div>
  );
};

export default WordExamUpload;