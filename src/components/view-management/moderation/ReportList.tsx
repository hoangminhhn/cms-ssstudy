"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export type ReportListItem = {
  id: string;
  reporterEmail: string;
  targetEmail?: string;
  reporterName?: string;
  time?: string;
  severity?: string; // e.g. Cao / Trung bình / Khẩn cấp
  category?: string; // e.g. Spam / Quấy rối / Nội dung không phù hợp
  message?: string;
};

interface ReportListProps {
  items: ReportListItem[];
  onWarn: (id: string) => void;
  onMute: (id: string) => void;
  onBlock: (id: string) => void;
  onIgnore: (id: string) => void;
  onSelectReporter?: (email?: string) => void;
}

const Badge: React.FC<{ children: React.ReactNode; color?: string }> = ({ children, color = "bg-amber-100 text-amber-700" }) => {
  return <span className={`inline-block text-xs px-2 py-0.5 rounded-full ${color}`}>{children}</span>;
};

const ReportList: React.FC<ReportListProps> = ({ items, onWarn, onMute, onBlock, onIgnore, onSelectReporter }) => {
  return (
    <div className="space-y-4">
      {items.map((it) => (
        <div key={it.id} className="rounded-md border border-amber-200 bg-amber-50/60 p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="text-sm font-semibold">
                Báo cáo từ:{" "}
                <button
                  className="text-sm font-medium text-orange-600 hover:underline"
                  onClick={() => onSelectReporter?.(it.reporterEmail)}
                >
                  {it.reporterEmail}
                </button>
              </div>
              {it.severity && (
                <Badge color="bg-orange-100 text-orange-700">
                  {it.severity}
                </Badge>
              )}
              {it.category && (
                <Badge color="bg-amber-200 text-amber-800">
                  {it.category}
                </Badge>
              )}
            </div>
            <div className="text-xs text-muted-foreground">{it.time}</div>
          </div>

          {it.targetEmail && (
            <div className="text-sm text-muted-foreground mb-3">Đối tượng: {it.targetEmail}</div>
          )}

          <div className="bg-white dark:bg-gray-800 rounded p-3 mb-3 text-sm">
            {it.message ?? <span className="text-muted-foreground">Không có nội dung</span>}
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => onWarn(it.id)}>
              Cảnh cáo
            </Button>

            <Button variant="outline" onClick={() => onMute(it.id)}>
              Tắt tiếng
            </Button>

            <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={() => onBlock(it.id)}>
              Chặn người dùng
            </Button>

            <Button variant="ghost" onClick={() => onIgnore(it.id)}>
              Bỏ qua
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReportList;