import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';

const examPeriods = [
  'Tất cả kỳ thi',
  'Kỳ thi HSA',
  'Kỳ thi TSA',
  'Kỳ thi Tốt Nghiệp',
  'Kỳ thi V-ACT',
];

const statusOptions = [
  'Tất cả',
  'Đang hoạt động',
  'Đã tắt',
];

const QuickGifts: React.FC = () => {
  const [q, setQ] = React.useState('');
  const [period, setPeriod] = React.useState(examPeriods[0]);
  const [status, setStatus] = React.useState(statusOptions[0]);

  const handleSearch = () => {
    // Placeholder: wire to API or filtering logic later
    console.log('Search quick gifts', { q, period, status });
  };

  const handleCreate = () => {
    // Placeholder for create action
    alert('Tạo lì xì mới — chức năng sẽ được triển khai sau');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quà tặng nhanh</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Filter row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
          <div className="md:col-span-5">
            <Label className="text-sm mb-1">Từ khóa</Label>
            <Input placeholder="Nhập từ khóa tìm kiếm..." value={q} onChange={(e) => setQ(e.target.value)} />
          </div>

          <div className="md:col-span-3">
            <Label className="text-sm mb-1">Kỳ thi</Label>
            <Select value={period} onValueChange={(v) => setPeriod(v)}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {examPeriods.map((p) => (
                  <SelectItem key={p} value={p}>{p}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="md:col-span-2">
            <Label className="text-sm mb-1">Trạng thái</Label>
            <Select value={status} onValueChange={(v) => setStatus(v)}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="md:col-span-2 flex items-center gap-2 justify-end">
            <Button variant="outline" onClick={handleSearch}>Tìm kiếm</Button>
            <Button className="bg-orange-500 hover:bg-orange-600 text-white flex items-center gap-2" onClick={handleCreate}>
              <Plus className="h-4 w-4" /> Tạo lì xì mới
            </Button>
          </div>
        </div>

        {/* Placeholder area for results / table */}
        <div className="mt-6">
          <div className="w-full border rounded-md p-6 text-center text-sm text-muted-foreground">Kết quả sẽ hiển thị ở đây — trang đang ở dạng placeholder.</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickGifts;
