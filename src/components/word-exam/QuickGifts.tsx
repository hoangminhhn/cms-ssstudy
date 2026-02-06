"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { Switch } from '@/components/ui/switch';
import { useNavigate } from 'react-router-dom';

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

type QuickGift = {
  id: string;
  name: string;
  period: string;
  status: string;
  createdAt: string;
};

const SAMPLE_GIFTS: QuickGift[] = [
  { id: 'G-001', name: 'Voucher 50%', period: 'Kỳ thi HSA', status: 'Đang hoạt động', createdAt: '01/08/2025' },
  { id: 'G-002', name: 'Miễn phí xem 1 buổi', period: 'Kỳ thi TSA', status: 'Đang hoạt động', createdAt: '20/07/2025' },
  { id: 'G-003', name: 'Giảm 20k', period: 'Kỳ thi Tốt Nghiệp', status: 'Đã tắt', createdAt: '15/06/2025' },
  { id: 'G-004', name: 'Combo sách miễn phí', period: 'Kỳ thi V-ACT', status: 'Đang hoạt động', createdAt: '03/05/2025' },
  { id: 'G-005', name: 'Quà tặng khuyến mãi', period: 'Kỳ thi HSA', status: 'Đã tắt', createdAt: '12/04/2025' },
  { id: 'G-006', name: 'Voucher 10%', period: 'Kỳ thi TSA', status: 'Đang hoạt động', createdAt: '08/03/2025' },
  { id: 'G-007', name: 'Miễn phí tư vấn 30 phút', period: 'Kỳ thi HSA', status: 'Đang hoạt động', createdAt: '28/02/2025' },
  { id: 'G-008', name: 'Tặng đề + đáp án', period: 'Kỳ thi Tốt Nghiệp', status: 'Đang hoạt động', createdAt: '19/01/2025' },
  { id: 'G-009', name: 'Miễn phí vận chuyển', period: 'Kỳ thi V-ACT', status: 'Đã tắt', createdAt: '10/12/2024' },
  { id: 'G-010', name: 'Ưu đãi nhóm', period: 'Kỳ thi HSA', status: 'Đang hoạt động', createdAt: '02/11/2024' },
];

const QuickGifts: React.FC = () => {
  const navigate = useNavigate();
  const [q, setQ] = React.useState('');
  const [period, setPeriod] = React.useState(examPeriods[0]);
  const [status, setStatus] = React.useState(statusOptions[0]);
  const [gifts, setGifts] = React.useState<QuickGift[]>(SAMPLE_GIFTS);

  // pagination
  const [page, setPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState(5);

  const filtered = React.useMemo(() => {
    const qq = q.trim().toLowerCase();
    return gifts.filter((g) => {
      if (period !== examPeriods[0] && g.period !== period) return false;
      if (status !== statusOptions[0] && g.status !== status) return false;
      if (!qq) return true;
      return g.name.toLowerCase().includes(qq);
    });
  }, [gifts, q, period, status]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const startIndex = (page - 1) * perPage;
  const endIndex = Math.min(startIndex + perPage, filtered.length);
  const pageItems = filtered.slice(startIndex, endIndex);

  React.useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [totalPages, page]);

  const handleDelete = (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa quà tặng này?')) return;
    setGifts((prev) => prev.filter((g) => g.id !== id));
    toast.success('Đã xóa quà tặng.');
  };

  const handleEdit = (id: string) => {
    toast.info(`Chỉnh sửa ${id} (demo).`);
  };

  const handleToggleStatus = (id: string, on: boolean) => {
    setGifts((prev) => prev.map((g) => (g.id === id ? { ...g, status: on ? 'Đang hoạt động' : 'Đã tắt' } : g)));
    toast.success(`Đã ${on ? 'bật' : 'tắt'} trạng thái (demo).`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quà tặng nhanh</CardTitle>
      </CardHeader>

      <CardContent>
        {/* Filter row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end mb-4">
          <div className="md:col-span-4">
            <Label className="text-sm mb-1">Từ khóa</Label>
            <Input placeholder="Tìm kiếm..." value={q} onChange={(e) => setQ(e.target.value)} />
          </div>

          <div className="md:col-span-3">
            <Label className="text-sm mb-1">Kỳ thi</Label>
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {examPeriods.map((p) => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="md:col-span-2">
            <Label className="text-sm mb-1">Trạng thái</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="md:col-span-3 flex items-center gap-2 justify-end">
            <Button variant="outline" onClick={() => { setPage(1); }}>
              Tìm kiếm
            </Button>
            <Button className="bg-orange-500 hover:bg-orange-600 text-white flex items-center gap-2" onClick={() => navigate('/quick-gifts/new')}>
              <Plus className="h-4 w-4" /> Tạo quà tặng mới
            </Button>
          </div>
        </div>

        {/* Results table */}
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="text-left text-sm text-orange-600 border-b">
                <th className="p-3">Tên quà tặng</th>
                <th className="p-3">Kỳ thi</th>
                <th className="p-3">Trạng thái</th>
                <th className="p-3">Ngày tạo</th>
                <th className="p-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {pageItems.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-muted-foreground">Không có bản ghi.</td>
                </tr>
              ) : (
                pageItems.map((g) => (
                  <tr key={g.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-3">{g.name}</td>
                    <td className="p-3">{g.period}</td>
                    <td className="p-3">
                      <div className="flex items-center">
                        <Switch
                          checked={g.status === 'Đang hoạt động'}
                          onCheckedChange={(v) => handleToggleStatus(g.id, !!v)}
                          aria-label={`Trạng thái ${g.name}`}
                        />
                      </div>
                    </td>
                    <td className="p-3">{g.createdAt}</td>
                    <td className="p-3 text-right">
                      <div className="inline-flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(g.id)}>Sửa</Button>
                        <Button variant="ghost" size="sm" className="text-red-600" onClick={() => handleDelete(g.id)}>Xóa</Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-muted-foreground">
            Hiển thị {filtered.length === 0 ? 0 : startIndex + 1} đến {endIndex} trong tổng số {filtered.length}
          </div>

          <div className="flex items-center gap-2">
            <button
              className="px-3 py-1 border rounded disabled:opacity-50"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              «
            </button>
            <div className="px-3 py-1 bg-white border rounded text-sm">{page}</div>
            <button
              className="px-3 py-1 border rounded disabled:opacity-50"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              »
            </button>
            <select
              className="border rounded px-2 py-1"
              value={perPage}
              onChange={(e) => { setPerPage(Number(e.target.value)); setPage(1); }}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickGifts;