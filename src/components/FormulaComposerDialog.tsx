"use client";

import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import katex from "katex";
import "katex/dist/katex.min.css";
import { cn } from "@/lib/utils";

interface FormulaComposerDialogProps {
  isOpen: boolean;
  initialLatex?: string;
  onClose: () => void;
  onConfirm: (latex: string) => void;
}

/**
 * Larger keypad layout placed below the editor/preview.
 * Expanded "123" group contains many keys (~32) to match screenshot needs.
 */
const BUTTON_GROUPS: {
  id: string;
  label: string;
  buttons: { title: string; latex: string; className?: string }[];
}[] = [
  {
    id: "vars",
    label: "x n",
    buttons: [
      { title: "x", latex: "x" },
      { title: "n", latex: "n" },
      { title: "a", latex: "a" },
      { title: "b", latex: "b" },
      { title: "c", latex: "c" },
      { title: "y", latex: "y" },
      { title: "z", latex: "z" },
      { title: "t", latex: "t" },
    ],
  },
  {
    id: "basic",
    label: "123",
    // expanded set (~32 keys) - digits, parentheses, dots, equals, arithmetic, common composites
    buttons: [
      { title: "7", latex: "7" }, { title: "8", latex: "8" }, { title: "9", latex: "9" }, { title: "÷", latex: "\\div" },
      { title: "4", latex: "4" }, { title: "5", latex: "5" }, { title: "6", latex: "6" }, { title: "×", latex: "\\times" },
      { title: "1", latex: "1" }, { title: "2", latex: "2" }, { title: "3", latex: "3" }, { title: "−", latex: "-" },
      { title: "0", latex: "0" }, { title: ".", latex: "." }, { title: "=", latex: "=" }, { title: "+", latex: "+" },

      { title: "(", latex: "(" }, { title: ")", latex: ")" }, { title: "[", latex: "[" }, { title: "]", latex: "]" },
      { title: "{", latex: "\\{" }, { title: "}", latex: "\\}" }, { title: "|", latex: "\\mid" }, { title: ":", latex: ":" },

      { title: "∘", latex: "\\circ" }, { title: "°", latex: "^{\\circ}" }, { title: "•", latex: "\\bullet" }, { title: "·", latex: "\\cdot" },
      { title: "…", latex: "\\dots" }, { title: "‰", latex: "\\permil" }, { title: "∗", latex: "\\ast" }, { title: "±", latex: "\\pm" },
    ],
  },
  {
    id: "functions",
    label: "f()",
    buttons: [
      { title: "√", latex: "\\sqrt{ }" },
      { title: "x^2", latex: "x^{2}" },
      { title: "x^n", latex: "x^{n}" },
      { title: "n√x", latex: "\\sqrt[n]{ }" },
      { title: "∫", latex: "\\int_{ }^{ }" },
      { title: "∑", latex: "\\sum_{ }^{ }" },
      { title: "lim", latex: "\\lim_{ }" },
      { title: "∞", latex: "\\infty" },
    ],
  },
  {
    id: "symbols",
    label: "ABC",
    buttons: [
      { title: "π", latex: "\\pi" },
      { title: "e", latex: "e" },
      { title: "i", latex: "i" },
      { title: "α", latex: "\\alpha" },
      { title: "β", latex: "\\beta" },
      { title: "γ", latex: "\\gamma" },
      { title: "θ", latex: "\\theta" },
      { title: "∈", latex: "\\in" },
    ],
  },
];

const FormulaComposerDialog: React.FC<FormulaComposerDialogProps> = ({
  isOpen,
  initialLatex = "",
  onClose,
  onConfirm,
}) => {
  const [latex, setLatex] = React.useState<string>(initialLatex);
  const [activeGroup, setActiveGroup] = React.useState<string>(BUTTON_GROUPS[1].id); // default to '123'
  const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);

  React.useEffect(() => {
    if (isOpen) {
      setLatex(initialLatex);
      setActiveGroup(BUTTON_GROUPS[1].id);
      setTimeout(() => textareaRef.current?.focus(), 50);
    }
  }, [isOpen, initialLatex]);

  const previewHtml = React.useMemo(() => {
    try {
      return katex.renderToString(latex || "\\;", { throwOnError: false, displayMode: true });
    } catch (e) {
      return `<span style="color:#c2410c">Invalid LaTeX</span>`;
    }
  }, [latex]);

  const insertAtCaret = (snippet: string) => {
    const ta = textareaRef.current;
    if (!ta) {
      setLatex((prev) => prev + snippet);
      return;
    }
    const start = ta.selectionStart ?? latex.length;
    const end = ta.selectionEnd ?? latex.length;
    const before = latex.substring(0, start);
    const after = latex.substring(end);
    const newValue = before + snippet + after;
    setLatex(newValue);
    const newPos = start + snippet.length;
    setTimeout(() => {
      ta.focus();
      ta.setSelectionRange(newPos, newPos);
    }, 0);
  };

  const handleBackspace = () => {
    const ta = textareaRef.current;
    if (!ta) {
      setLatex((prev) => prev.slice(0, -1));
      return;
    }
    const start = ta.selectionStart ?? latex.length;
    const end = ta.selectionEnd ?? latex.length;
    if (start === end && start > 0) {
      const before = latex.substring(0, start - 1);
      const after = latex.substring(end);
      const newValue = before + after;
      setLatex(newValue);
      setTimeout(() => {
        const pos = start - 1;
        ta.focus();
        ta.setSelectionRange(pos, pos);
      }, 0);
    } else if (start !== end) {
      const before = latex.substring(0, start);
      const after = latex.substring(end);
      const newValue = before + after;
      setLatex(newValue);
      setTimeout(() => {
        ta.focus();
        ta.setSelectionRange(start, start);
      }, 0);
    }
  };

  const handleClear = () => {
    setLatex("");
    setTimeout(() => textareaRef.current?.focus(), 0);
  };

  const handleConfirm = () => {
    onConfirm(latex);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-w-4xl w-full">
        <div className="flex flex-col">
          <DialogHeader>
            <DialogTitle>Chèn công thức (LaTeX)</DialogTitle>
          </DialogHeader>

          {/* Scrollable content area (editor + preview). Keypad below remains fixed. */}
          <div className="max-h-[56vh] overflow-auto p-3">
            <div className="p-0 space-y-4">
              {/* Editor + Preview top section with slightly reduced heights */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="mb-2">LaTeX (raw)</Label>
                  <textarea
                    ref={textareaRef}
                    value={latex}
                    onChange={(e) => setLatex(e.target.value)}
                    className="w-full min-h-[140px] rounded-md border px-3 py-2 resize-vertical bg-white dark:bg-gray-800 dark:border-gray-700 text-sm"
                    aria-label="LaTeX editor"
                  />
                  <div className="mt-2 text-sm text-muted-foreground">Bạn có thể nhập thủ công hoặc dùng bộ phím bên dưới.</div>
                </div>

                <div>
                  <Label className="mb-2">Xem trước</Label>
                  <div
                    className="min-h-[140px] rounded-md border p-3 bg-white dark:bg-gray-800"
                    aria-live="polite"
                    dangerouslySetInnerHTML={{ __html: previewHtml }}
                  />
                </div>
              </div>

              {/* Extra spacing so content scrolls nicely above keypad */}
              <div className="h-2" />
            </div>
          </div>

          {/* Keypad area pinned below (not in scrollable container) */}
          <div className="border-t bg-gray-50 dark:bg-gray-900 p-3">
            <div className="flex items-center gap-2 mb-3">
              {/* Tabs */}
              {BUTTON_GROUPS.map((g) => (
                <button
                  key={g.id}
                  onClick={() => setActiveGroup(g.id)}
                  className={cn(
                    "px-3 py-1 rounded-md text-sm",
                    activeGroup === g.id ? "bg-orange-500 text-white" : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border"
                  )}
                  aria-pressed={activeGroup === g.id}
                >
                  {g.label}
                </button>
              ))}

              <div className="ml-auto flex items-center gap-2">
                <button
                  onClick={handleBackspace}
                  title="Backspace"
                  className="px-3 py-1 rounded-md bg-white hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 border"
                >
                  ⌫
                </button>
                <button
                  onClick={handleClear}
                  title="Clear"
                  className="px-3 py-1 rounded-md bg-white hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 border"
                >
                  Clear
                </button>
              </div>
            </div>

            {/* Expanded keypad grid; using responsive columns */}
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
              {(BUTTON_GROUPS.find((b) => b.id === activeGroup)?.buttons || []).map((btn, idx) => (
                <button
                  key={idx}
                  onClick={() => insertAtCaret(btn.latex)}
                  className="rounded border bg-white hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 py-3 text-sm text-center"
                  title={btn.title}
                  aria-label={`Chèn ${btn.title}`}
                >
                  {btn.title}
                </button>
              ))}
            </div>
          </div>

          <DialogFooter className="flex justify-end gap-2 mt-2">
            <Button variant="outline" onClick={onClose}>Hủy</Button>
            <Button onClick={handleConfirm} className="bg-orange-500 hover:bg-orange-600 text-white">Chèn</Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FormulaComposerDialog;