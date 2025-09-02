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
 * Simple formula composer dialog with an insertion keypad:
 * - Tabs for groups (Basic, Operators, Functions, Symbols)
 * - Grid of buttons that insert LaTeX snippets at caret
 * - Live KaTeX preview (display mode)
 */
const BUTTON_GROUPS: {
  id: string;
  label: string;
  buttons: { title: string; latex: string; className?: string }[];
}[] = [
  {
    id: "basic",
    label: "123",
    buttons: [
      { title: "7", latex: "7" },
      { title: "8", latex: "8" },
      { title: "9", latex: "9" },
      { title: "÷", latex: "\\div" },

      { title: "4", latex: "4" },
      { title: "5", latex: "5" },
      { title: "6", latex: "6" },
      { title: "×", latex: "\\times" },

      { title: "1", latex: "1" },
      { title: "2", latex: "2" },
      { title: "3", latex: "3" },
      { title: "−", latex: "-" },

      { title: "○", latex: "\\circ" },
      { title: "0", latex: "0" },
      { title: ".", latex: "." },
      { title: "+", latex: "+" },
    ],
  },
  {
    id: "relations",
    label: "<>",
    buttons: [
      { title: "<", latex: "<" },
      { title: ">", latex: ">" },
      { title: "≤", latex: "\\le" },
      { title: "≥", latex: "\\ge" },
      { title: "=", latex: "=" },
      { title: "≠", latex: "\\ne" },
      { title: "≈", latex: "\\approx" },
      { title: "∈", latex: "\\in" },
    ],
  },
  {
    id: "functions",
    label: "f()",
    buttons: [
      { title: "√", latex: "\\sqrt{ }" },
      { title: "∫", latex: "\\int_{ }^{ }" },
      { title: "∑", latex: "\\sum_{ }^{ }" },
      { title: "lim", latex: "\\lim_{ }" },
      { title: "sin", latex: "\\sin" },
      { title: "cos", latex: "\\cos" },
      { title: "tan", latex: "\\tan" },
      { title: "log", latex: "\\log" },
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
      { title: "∞", latex: "\\infty" },
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
  const [activeGroup, setActiveGroup] = React.useState<string>(BUTTON_GROUPS[0].id);
  const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);

  React.useEffect(() => {
    if (isOpen) {
      setLatex(initialLatex);
      setActiveGroup(BUTTON_GROUPS[0].id);
      // focus textarea on open (small delay to ensure rendered)
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

  // Insert snippet at caret position of textarea
  const insertAtCaret = (snippet: string) => {
    const ta = textareaRef.current;
    if (!ta) {
      // fallback append
      setLatex((prev) => prev + snippet);
      return;
    }
    const start = ta.selectionStart ?? latex.length;
    const end = ta.selectionEnd ?? latex.length;
    const before = latex.substring(0, start);
    const after = latex.substring(end);
    const newValue = before + snippet + after;
    setLatex(newValue);
    // place caret after inserted snippet
    const newPos = start + snippet.length;
    // update textarea value and selection after state set
    // use setTimeout to ensure DOM updated
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
      // delete selection
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
      <DialogContent className="max-w-3xl w-full">
        <DialogHeader>
          <DialogTitle>Chèn công thức (LaTeX)</DialogTitle>
        </DialogHeader>

        <div className="p-2 space-y-4">
          <div>
            <Label className="mb-2">Bộ phím công thức</Label>

            {/* Tabs */}
            <div className="flex gap-2 mb-2">
              {BUTTON_GROUPS.map((g) => (
                <button
                  key={g.id}
                  onClick={() => setActiveGroup(g.id)}
                  className={cn(
                    "px-3 py-1 rounded-md text-sm",
                    activeGroup === g.id ? "bg-orange-500 text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
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
                  className="px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
                >
                  ⌫
                </button>
                <button
                  onClick={handleClear}
                  title="Clear"
                  className="px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
                >
                  Clear
                </button>
              </div>
            </div>

            {/* Buttons grid */}
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 bg-gray-50 p-3 rounded-md">
              {(BUTTON_GROUPS.find((b) => b.id === activeGroup)?.buttons || []).map((btn, idx) => (
                <button
                  key={idx}
                  onClick={() => insertAtCaret(btn.latex)}
                  className="rounded border bg-white hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 py-2 text-sm text-center"
                  title={btn.title}
                  aria-label={`Chèn ${btn.title}`}
                >
                  {btn.title}
                </button>
              ))}
            </div>
          </div>

          {/* Editor and preview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="mb-2">LaTeX (raw)</Label>
              <textarea
                ref={textareaRef}
                value={latex}
                onChange={(e) => setLatex(e.target.value)}
                className="w-full min-h-[160px] rounded-md border px-3 py-2 resize-vertical bg-white dark:bg-gray-800 dark:border-gray-700 text-sm"
                aria-label="LaTeX editor"
              />
              <div className="mt-2 text-sm text-muted-foreground">Bạn có thể chèn công thức từ bộ phím hoặc nhập thủ công.</div>
            </div>

            <div>
              <Label className="mb-2">Xem trước</Label>
              <div
                className="min-h-[160px] rounded-md border p-3 bg-white dark:bg-gray-800"
                aria-live="polite"
                dangerouslySetInnerHTML={{ __html: previewHtml }}
              />
            </div>
          </div>
        </div>

        <DialogFooter className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>Hủy</Button>
          <Button onClick={handleConfirm} className="bg-orange-500 hover:bg-orange-600 text-white">Chèn</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FormulaComposerDialog;