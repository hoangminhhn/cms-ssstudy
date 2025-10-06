"use client";

import React from "react";
import { Check, EyeOff, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type ModerationItem = {
  id: string;
  name: string;
  email?: string;
  time?: string;
  reason?: string;
  message?: string;
  reportedBy?: string;
};

interface ModerationListProps {
  items: ModerationItem[];
  selectedIds: string[];
  onToggleSelect: (id: string, checked: boolean) => void;
  onSelectUser: (reportedBy?: string | undefined) => void;
  onApprove: (id: string) => void;
  onHide: (id: string) => void;
  onDelete: (id: string) => void;
}

const ReasonPill: React.FC<{ text?: string }> = ({ text }) => {
  if (!text) return null;
  return <span className="inline-block text-xs px-3 py-1 rounded-full bg-red-100 text-red-700">{text}</span>;
};

const ModerationList: React.FC<ModerationListProps> = ({ items, selectedIds, onToggleSelect, onSelectUser, onApprove, onHide, onDelete }) => {
  return (
    <div className="space-y-4">
      {items.map((it) => (
        <div key={it.id} className="border rounded-md bg-red-50 dark:bg-red-900/30 p-4">
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              checked={selectedIds.includes(it.id)}
              onChange={(e) => onToggleSelect(it.id, e.target.checked)}
              className="mt-1"
              aria-label={`Select ${it.name}`}
            />

            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <button
                    onClick={() => onSelectUser(it.reportedBy)}
                    className="text-sm font-medium text-gray-900 hover:underline"
                  >
                    {it.name}
                  </button>
                  {it.email && <div className="text-xs text-blue-600">{it.email}</div>}
                  {it.time && <div className="text-xs text-muted-foreground mt-1">{it.time}</div>}
                </div>

                <div className="ml-2">
                  <ReasonPill text={it.reason} />
                </div>
              </div>

              <div className="mt-3">
                <div className="rounded-md bg-white dark:bg-gray-800 p-3 text-sm text-gray-700 dark:text-gray-100">
                  {it.message ?? ""}
                </div>
              </div>

              <div className="mt-3 flex items-center gap-3">
                <Button variant="ghost" className="flex items-center gap-2" onClick={() => onApprove(it.id)}>
                  <Check className="h-4 w-4" /> <span className="text-sm">Duyệt</span>
                </Button>

                <Button variant="ghost" className="flex items-center gap-2" onClick={() => onHide(it.id)}>
                  <EyeOff className="h-4 w-4" /> <span className="text-sm">Ẩn</span>
                </Button>

                <Button className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-2" onClick={() => onDelete(it.id)}>
                  <Trash2 className="h-4 w-4" /> <span className="text-sm">Xóa</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ModerationList;