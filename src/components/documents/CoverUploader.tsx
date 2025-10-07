"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ImagePlus } from "lucide-react";
import { toast } from "sonner";

interface CoverUploaderProps {
  coverPreview: string | null;
  setCoverPreview: (v: string | null) => void;
}

const CoverUploader: React.FC<CoverUploaderProps> = ({ coverPreview, setCoverPreview }) => {
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  const onPick = () => inputRef.current?.click();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    if (!f) return;
    const url = URL.createObjectURL(f);
    setCoverPreview(url);
    toast.success("Đã chọn ảnh bìa (preview).");
  };

  const handleClear = () => {
    setCoverPreview(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="bg-white dark:bg-gray-800 border rounded-lg p-4">
      <h4 className="text-sm font-medium mb-3">Ảnh bìa</h4>

      <div className="flex flex-col items-center gap-3">
        <div className="w-full">
          <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={onChange} />
          <div
            className="w-full h-40 rounded-md border-dashed border-2 border-gray-200 dark:border-gray-700 flex items-center justify-center bg-gray-50 dark:bg-gray-900 cursor-pointer"
            onClick={onPick}
            role="button"
            aria-label="Tải ảnh bìa lên"
          >
            {coverPreview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={coverPreview} alt="cover preview" className="max-h-full object-contain" />
            ) : (
              <div className="flex flex-col items-center text-sm text-muted-foreground">
                <ImagePlus className="h-6 w-6 mb-2" />
                <div>Tải ảnh bìa lên</div>
              </div>
            )}
          </div>
        </div>

        {coverPreview && (
          <div className="flex items-center gap-2 w-full">
            <Button variant="outline" onClick={handleClear}>Xóa</Button>
            <Button className="ml-auto bg-gray-800 text-white" onClick={() => toast.success("Lưu ảnh bìa (demo).")}>Lưu ảnh</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoverUploader;