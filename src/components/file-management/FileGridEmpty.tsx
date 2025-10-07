"use client";

import React from "react";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const FileGridEmpty: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center text-muted-foreground">
      <div className="inline-flex items-center justify-center p-6 rounded-full bg-gray-50 dark:bg-gray-800 mb-6">
        <FileText className="h-10 w-10 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-700 dark:text-gray-100">Không tìm thấy tập tin nào</h3>
      <p className="mt-2 text-sm text-muted-foreground">Thử thay đổi bộ lọc hoặc tải lên tập tin mới</p>

      <div className="mt-6">
        <Button className="bg-gradient-to-r from-orange-500 to-pink-500 text-white" onClick={() => toast.success("Mở dialog tải lên (demo).")}>
          Tải lên
        </Button>
      </div>
    </div>
  );
};

export default FileGridEmpty;