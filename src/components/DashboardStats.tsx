import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarIcon, Filter, LineChart } from 'lucide-react';
import DateRangePicker from './DateRangePicker';
import { Button } from '@/components/ui/button';

interface StatCardProps {
  title: string;
  value: string;
  description: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, description }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <LineChart className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
);

const DashboardStats: React.FC = () => {
  const [date, setDate] = React.useState<{ from?: Date; to?: Date } | undefined>({
    from: new Date(2025, 0, 1),
    to: new Date(2025, 0, 31),
  });

  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Số liệu thống kê</h2>
        <div className="flex items-center gap-2">
          <DateRangePicker date={date} setDate={setDate} />
          <Button className="bg-orange-500 hover:bg-orange-600 text-white">
            <Filter className="mr-2 h-4 w-4" /> Lọc kết quả
          </Button>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <StatCard title="Thành viên" value="1.094" description="Tăng 20.1% so với tháng trước" />
        <StatCard title="Khóa học đã bán" value="39" description="Tăng 15% so với tháng trước" />
        <StatCard title="Sách đã bán" value="3" description="Tăng 5% so với tháng trước" />
        <StatCard title="Đơn hàng" value="34" description="Tăng 10% so với tháng trước" />
        <StatCard title="Tổng doanh thu" value="3.590.000đ" description="Tăng 25% so với tháng trước" />
      </div>
    </div>
  );
};

export default DashboardStats;