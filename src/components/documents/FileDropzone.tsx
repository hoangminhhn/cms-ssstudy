"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { UploadCloud, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface FileDropzoneProps {
  files: File[];
  setFiles: (f: File[]) => void;
}

const FileDropzone: React.FC<FileDropzoneProps> = ({ files, setFiles }) => {
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const onPick = () => inputRef.current?.click();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const list = Array.from(e.target.files || []);
    if (list.length === 0) return;
    setFiles((prev) => [...prev, ...list]);
    toast.success(`${list.length} file được thêm.`);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const dtFiles = Array.from(e.dataTransfer.files || []).filter((f) => f.size > 0);
    if (dtFiles.length === 0) return;
    setFiles((prev) => [...prev, ...dtFiles]);
    toast.success(`${dtFiles.length} file được kéo thả.`);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <div className="bg-white dark:bg-gray-800 border rounded-lg p-4">
        <h4 className="text-sm font-medium mb-3">File đính kèm</h4>

        <div
          className={cn(
            "rounded-md border-dashed border-2 border-gray-200 dark:border-gray-700 p-6 flex items-center justify-center cursor-pointer",
            "hover:bg-gray-50 dark:hover:bg-gray-900"
          )}
          onDragOver={(e) => e.preventDefault()}
          onDrop={onDrop}
          role="button"
          onClick={onPick}
        >
          <div className="flex flex-col items-center text-muted-foreground">
            <UploadCloud className="h-6 w-6 mb-2" />
            <div className="text-sm">Nhấp để tải file lên hoặc kéo thả (PDF, hình ảnh, video)</div>
          </div>
          <input ref={inputRef} type="file" accept="application/pdf,image/*,video/*" className="hidden" onChange={onChange} multiple />
        </div>

        {files.length > 0 && (
          <div className="mt-4 space-y-2">
            {files.map((f, idx) => (
              <div key={idx} className="flex items-center justify-between gap-3 border rounded p-2">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="text-sm font-medium truncate">{f.name}</div>
                  <div className="text-xs text-muted-foreground">{(f.size / 1024 / 1024).toFixed(2)} MB</div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="text-red-600" onClick={() => removeFile(idx)} aria-label={`Xóa ${f.name}`}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FileDropzone;