import React from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const EditExamFormCategory: React.FC = () => {
  const [parts, setParts] = React.useState<any[]>([]); // Giữ nguyên hoặc khai báo đúng kiểu
  const [deletedPart, setDeletedPart] = React.useState<any | null>(null);

  // ... các state và useEffect khác giữ nguyên

  const handleDeletePart = (id: string) => {
    setParts((currentParts) => {
      const partToDelete = currentParts.find(p => p.id === id);
      if (!partToDelete) {
        console.warn(`Không tìm thấy phần thi với id: ${id}`);
        return currentParts;
      }

      const confirmMessage = `Bạn có chắc chắn muốn xóa phần thi "${partToDelete?.name ?? ''}"?`;
      if (!window.confirm(confirmMessage)) {
        return currentParts;
      }

      // Xóa phần thi
      const updatedParts = currentParts.filter(p => p.id !== id);
      setDeletedPart(partToDelete);

      toast(
        (t) => (
          <div className="flex items-center justify-between gap-4">
            <span>Đã xóa phần thi "{partToDelete?.name ?? ''}".</span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setParts((prev) => [...prev, partToDelete]);
                setDeletedPart(null);
                toast.dismiss(t.id);
                toast.success('Đã khôi phục phần thi.');
              }}
            >
              Hoàn tác
            </Button>
          </div>
        ),
        { duration: 8000 }
      );

      return updatedParts;
    });
  };

  // ... phần còn lại giữ nguyên
};

export default EditExamFormCategory;