"use client";

import React from "react";
import SortableJS from "sortablejs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { X, Edit2, Plus, Check } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * SubPart management component
 *
 * Props:
 * - partId: id of the parent part
 * - partName
 * - questions: list of questions in the part (each has id & summary fields)
 * - subParts: array of { id, name, questionIds: string[] }
 * - onAddSubPart(name)
 * - onEditSubPart(subPartId, name)
 * - onDeleteSubPart(subPartId)
 * - onReorderSubParts(newOrderIds[])
 * - onAssignQuestions(subPartId, questionIds[])
 *
 * This component is intentionally lightweight: sub-parts do NOT carry scoring config.
 */

export type QuestionBrief = { id: string; title?: string; uploadDate?: string };

export type SubPart = {
  id: string;
  name: string;
  questionIds: string[];
};

interface Props {
  partId: string;
  partName?: string;
  questions: QuestionBrief[];
  subParts: SubPart[];
  onAddSubPart: (partId: string, name: string) => void;
  onEditSubPart: (partId: string, subPartId: string, name: string) => void;
  onDeleteSubPart: (partId: string, subPartId: string) => void;
  onReorderSubParts: (partId: string, newOrder: string[]) => void;
  onAssignQuestions: (partId: string, subPartId: string, questionIds: string[]) => void;
}

const WordExamSubPart: React.FC<Props> = ({
  partId,
  partName,
  questions,
  subParts,
  onAddSubPart,
  onEditSubPart,
  onDeleteSubPart,
  onReorderSubParts,
  onAssignQuestions,
}) => {
  const [creating, setCreating] = React.useState(false);
  const [newName, setNewName] = React.useState("");
  const listRef = React.useRef<HTMLDivElement | null>(null);
  const sortableRef = React.useRef<any>(null);

  // edit state
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [editingName, setEditingName] = React.useState("");

  // assign modal
  const [assignOpenFor, setAssignOpenFor] = React.useState<string | null>(null);
  const [assignSelection, setAssignSelection] = React.useState<Record<string, boolean>>({});

  // init Sortable for subParts list
  React.useEffect(() => {
    const el = listRef.current;
    if (!el) return;

    try {
      if (sortableRef.current && typeof sortableRef.current.destroy === "function") {
        sortableRef.current.destroy();
        sortableRef.current = null;
      }

      const sortable = SortableJS.create(el, {
        animation: 150,
        handle: ".sp-drag",
        onEnd: (evt: any) => {
          if (evt.oldIndex == null || evt.newIndex == null) return;
          const nodes = Array.from(el.children);
          const ids = nodes.map((n) => String((n as HTMLElement).dataset.id));
          onReorderSubParts(partId, ids.filter(Boolean));
        },
      });

      sortableRef.current = sortable;
    } catch (err) {
      // avoid crashing the page if Sortable fails
      // eslint-disable-next-line no-console
      console.error("Sortable init error (WordExamSubPart):", err);
    }

    return () => {
      try {
        if (sortableRef.current && typeof sortableRef.current.destroy === "function") {
          sortableRef.current.destroy();
        }
      } catch {
        // ignore
      } finally {
        sortableRef.current = null;
      }
    };
  }, [listRef.current, subParts, onReorderSubParts, partId]);

  const openCreate = () => {
    setNewName(`${partName ?? "Phần"}.1`);
    setCreating(true);
    setTimeout(() => {
      const el = document.getElementById(`sp-create-${partId}`);
      if (el) (el as HTMLInputElement).focus();
    }, 50);
  };

  const handleCreate = () => {
    const v = newName.trim();
    if (!v) return;
    onAddSubPart(partId, v);
    setCreating(false);
    setNewName("");
  };

  const handleStartEdit = (sp: SubPart) => {
    setEditingId(sp.id);
    setEditingName(sp.name);
    setTimeout(() => {
      const el = document.getElementById(`sp-edit-${sp.id}`);
      if (el) (el as HTMLInputElement).focus();
    }, 50);
  };

  const handleSaveEdit = (spId: string) => {
    const v = editingName.trim();
    if (!v) return;
    onEditSubPart(partId, spId, v);
    setEditingId(null);
    setEditingName("");
  };

  const handleDelete = (spId: string) => {
    if (!confirm("Bạn có chắc muốn xóa phần thi con này?")) return;
    onDeleteSubPart(partId, spId);
  };

  const openAssign = (sp: SubPart) => {
    const map: Record<string, boolean> = {};
    (sp.questionIds || []).forEach((id) => (map[id] = true));
    setAssignSelection(map);
    setAssignOpenFor(sp.id);
  };

  const toggleAssign = (qid: string) => {
    setAssignSelection((prev) => ({ ...prev, [qid]: !prev[qid] }));
  };

  const saveAssign = () => {
    if (!assignOpenFor) return;
    const selectedIds = Object.keys(assignSelection).filter((k) => assignSelection[k]);
    onAssignQuestions(partId, assignOpenFor, selectedIds);
    setAssignOpenFor(null);
    setAssignSelection({});
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Label className="text-sm font-medium">Phần con cho {partName ?? "Phần"}</Label>
          <div className="text-xs text-muted-foreground"> (groups to organize questions)</div>
        </div>
        <div className="flex items-center gap-2">
          {!creating ? (
            <Button size="sm" onClick={openCreate} className="flex items-center gap-2">
              <Plus className="h-4 w-4" /> Thêm phần thi con
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <Input
                id={`sp-create-${partId}`}
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleCreate();
                  if (e.key === "Escape") {
                    setCreating(false);
                    setNewName("");
                  }
                }}
                className="h-8"
              />
              <Button size="sm" onClick={handleCreate} className="bg-green-600 text-white">
                <Check className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline" onClick={() => { setCreating(false); setNewName(""); }}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      <div ref={listRef} className="space-y-2">
        {subParts.length === 0 ? (
          <div className="text-sm text-muted-foreground p-3 border rounded">Chưa có phần thi con.</div>
        ) : (
          subParts.map((sp) => {
            const assignedCount = (sp.questionIds || []).length;
            return (
              <div
                key={sp.id}
                data-id={sp.id}
                className="p-3 border rounded bg-white dark:bg-gray-800 flex items-center justify-between"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="sp-drag cursor-move text-gray-400 select-none">≡</div>

                  <div className="min-w-0">
                    {editingId === sp.id ? (
                      <input
                        id={`sp-edit-${sp.id}`}
                        className="text-sm w-full bg-transparent border-b border-dashed px-1 py-0.5"
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleSaveEdit(sp.id);
                          if (e.key === "Escape") setEditingId(null);
                        }}
                      />
                    ) : (
                      <div className="text-sm font-medium truncate" title={sp.name}>{sp.name}</div>
                    )}

                    <div className="text-xs text-muted-foreground">
                      {assignedCount} câu đã gán
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {editingId === sp.id ? (
                    <>
                      <Button size="sm" className="bg-green-600 text-white" onClick={() => handleSaveEdit(sp.id)}>
                        Lưu
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>Hủy</Button>
                    </>
                  ) : (
                    <>
                      <Button size="sm" variant="ghost" onClick={() => handleStartEdit(sp)} title="Sửa tên">
                        <Edit2 className="h-4 w-4" />
                      </Button>

                      <Button size="sm" variant="ghost" onClick={() => openAssign(sp)} title="Gán câu hỏi">
                        Gán
                      </Button>

                      <Button size="sm" variant="ghost" className="text-red-600" onClick={() => handleDelete(sp.id)} title="Xóa phần con">
                        <X className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Assign Modal */}
      <Dialog open={assignOpenFor !== null} onOpenChange={(open) => { if (!open) setAssignOpenFor(null); }}>
        <DialogContent className="max-w-2xl w-full">
          <DialogHeader>
            <DialogTitle>Gán câu hỏi vào phần</DialogTitle>
          </DialogHeader>

          <div className="p-2">
            <div className="text-sm text-muted-foreground mb-2">Chọn các câu hỏi thuộc phần này để gán vào phần con.</div>

            <div className="space-y-2 max-h-[48vh] overflow-auto">
              {questions.length === 0 ? (
                <div className="text-sm text-muted-foreground p-3">Chưa có câu hỏi trong phần này.</div>
              ) : (
                questions.map((q, idx) => {
                  const checked = !!assignSelection[q.id];
                  return (
                    <label key={q.id} className="flex items-center gap-3 p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-900 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleAssign(q.id)}
                        className="h-4 w-4"
                      />
                      <div className="flex-1 min-w-0 text-sm">
                        <div className="font-medium truncate">{q.title ?? `Câu ${idx + 1}`}</div>
                        {q.uploadDate && <div className="text-xs text-muted-foreground">{q.uploadDate}</div>}
                      </div>
                    </label>
                  );
                })
              )}
            </div>
          </div>

          <DialogFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setAssignOpenFor(null)}>Hủy</Button>
            <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={saveAssign}>Lưu phân nhóm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WordExamSubPart;