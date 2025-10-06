"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export type Violation = {
  id: string;
  reason: string;
  date: string;
  room?: string;
  snippet?: string;
};

interface ViolationHistoryProps {
  user?: { name: string; email?: string };
  violations: Violation[];
  onBlockUser: (email?: string) => void;
}

const ViolationCard: React.FC<{ v: Violation }> = ({ v }) => {
  return (
    <div className="border rounded-md p-3 bg-white dark:bg-gray-800">
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="text-sm font-medium">{v.reason}</div>
          <div className="text-xs text-muted-foreground mt-1">{v.date}</div>
        </div>
        {v.room && <div className="text-xs px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-muted-foreground">{`Phòng: ${v.room}`}</div>}
      </div>
      {v.snippet && <div className="mt-2 text-sm text-muted-foreground truncate">{v.snippet}</div>}
    </div>
  );
};

const ViolationHistory: React.FC<ViolationHistoryProps> = ({ user, violations, onBlockUser }) => {
  const violationCount = violations.length;
  return (
    <div className="sticky top-6 space-y-4">
      <div className="border rounded-md p-4 bg-white dark:bg-gray-800">
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold">Lịch sử vi phạm</div>
          <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={() => onBlockUser(user?.email)}>
            Chặn người dùng
          </Button>
        </div>

        <div className="mt-4">
          {user ? (
            <div className="border rounded-md p-3 bg-gray-50 dark:bg-gray-900">
              <div className="font-medium">{user.name}</div>
              {user.email && <div className="text-xs text-muted-foreground">{user.email}</div>}
              <div className="mt-2">
                <span className="inline-block text-xs px-2 py-1 rounded bg-red-100 text-red-700">{violationCount} vi phạm</span>
              </div>
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">Chưa chọn người dùng</div>
          )}
        </div>
      </div>

      <div className="border rounded-md p-4 bg-white dark:bg-gray-800">
        <div className="text-sm font-medium mb-3">Các vi phạm gần đây</div>
        <div className="space-y-3">
          {violations.length === 0 ? (
            <div className="text-sm text-muted-foreground">Không có vi phạm.</div>
          ) : (
            violations.map((v) => <ViolationCard key={v.id} v={v} />)
          )}
        </div>
      </div>
    </div>
  );
};

export default ViolationHistory;