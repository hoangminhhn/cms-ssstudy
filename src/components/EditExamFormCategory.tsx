import React from 'react';
// ... các import khác giữ nguyên

const EditExamFormCategory: React.FC = () => {
  // ... các state và useEffect giữ nguyên

  const handleDeletePart = (id: string) => {
    console.log('handleDeletePart called with id:', id);
    console.log('Current parts:', parts);

    const partToDelete = parts.find(p => p.id === id);
    if (!partToDelete) {
      console.warn(`Không tìm thấy phần thi với id: ${id}`);
      return;
    }

    const confirmMessage = `Bạn có chắc chắn muốn xóa phần thi "${partToDelete.name ?? ''}"?`;
    if (!window.confirm(confirmMessage)) {
      return;
    }

    setParts(prev => prev.filter(p => p.id !== id));
    setDeletedPart(partToDelete);

    toast(
      (t) => (
        <div className="flex items-center justify-between gap-4">
          <span>Đã xóa phần thi "{partToDelete.name ?? ''}".</span>
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
  };

  // ... phần còn lại giữ nguyên
};

export default EditExamFormCategory;