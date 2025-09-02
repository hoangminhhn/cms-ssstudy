"use client";

import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import katex from "katex";
import "katex/dist/katex.min.css";

interface FormulaComposerDialogProps {
  isOpen: boolean;
  initialLatex?: string;
  onClose: () => void;
  onConfirm: (latex: string) => void;
}

/**
 * Simple formula composer dialog
 * - initialLatex: prefill input
 * - renders KaTeX preview (display mode)
 * - returns raw latex string on confirm
 */
const FormulaComposerDialog: React.FC<FormulaComposerDialogProps> = ({
  isOpen,
  initialLatex = "",
  onClose,
  onConfirm,
}) => {
  const [latex, setLatex] = React.useState<string>(initialLatex);

  React.useEffect(() => {
    if (isOpen) {
      setLatex(initialLatex);
    }
  }, [isOpen, initialLatex]);

  const previewHtml = React.useMemo(() => {
    // Use throwOnError: false so invalid markup doesn't throw at runtime
    return katex.renderToString(latex || "\\; ", { throwOnError: false, displayMode: true });
  }, [latex]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-w-2xl w-full">
        <DialogHeader>
          <DialogTitle>Chèn công thức (LaTeX)</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 p-2">
          <div>
            <Label className="mb-2">LaTeX</Label>
            <Input
              value={latex}
              onChange={(e) => setLatex(e.target.value)}
              placeholder="Nhập LaTeX ở đây, ví dụ: \frac{a}{b}"
              className="w-full"
            />
          </div>

          <div>
            <Label className="mb-2">Xem trước</Label>
            <div
              className="min-h-[64px] rounded border p-3 bg-white dark:bg-gray-800"
              aria-live="polite"
              dangerouslySetInnerHTML={{ __html: previewHtml }}
            />
            <p className="text-sm text-muted-foreground mt-2">Xem trước áp dụng chế độ hiển thị (display mode). Bạn có thể chỉnh sửa LaTeX và nhấn "Chèn".</p>
          </div>
        </div>

        <DialogFooter className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>Hủy</Button>
          <Button onClick={() => { onConfirm(latex); onClose(); }} className="bg-orange-500 hover:bg-orange-600 text-white">Chèn</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FormulaComposerDialog;