import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const QuickGifts: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quà tặng nhanh</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="py-8 text-center text-sm text-muted-foreground">Chưa có nội dung. Sẽ bổ sung sau.</div>
      </CardContent>
    </Card>
  );
};

export default QuickGifts;
