"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, MessageSquare, AlertTriangle, Link as LinkIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface RoomCardProps {
  id: string;
  title: string;
  course?: string;
  date?: string;
  ccu: number;
  capacity?: number | null;
  messages: number;
  violations: number;
  visibility?: "Công khai" | "Riêng tư";
  status?: "running" | "idle" | "ended";
  onOpen?: (id: string) => void;
  onModeration?: (id: string) => void;
}

const StatusPill: React.FC<{ status?: RoomCardProps["status"] }> = ({ status }) => {
  if (!status) return null;
  const classes =
    status === "running"
      ? "bg-green-600 text-white"
      : status === "idle"
      ? "bg-yellow-500 text-white"
      : "bg-gray-400 text-white";
  return <span className={cn("inline-flex items-center px-3 py-1 rounded-full text-xs font-medium", classes)}>{status === "running" ? "Đang diễn ra" : status === "idle" ? "Tạm dừng" : "Kết thúc"}</span>;
};

const StatRow: React.FC<{ icon: React.ElementType; children: React.ReactNode }> = ({ icon: Icon, children }) => {
  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <Icon className="h-4 w-4 text-gray-400" />
      <div className="text-sm text-gray-700 dark:text-gray-200">{children}</div>
    </div>
  );
};

const RoomCard: React.FC<RoomCardProps> = ({
  id,
  title,
  course,
  date,
  ccu,
  capacity,
  messages,
  violations,
  visibility,
  status = "running",
  onOpen,
  onModeration,
}) => {
  return (
    <Card className="h-full">
      <CardContent className="p-4 flex flex-col justify-between h-full">
        <div>
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 leading-snug">{title}</h3>
              <div className="text-xs text-muted-foreground mt-1">
                {course ? `${course} • ` : ""}
                {date ?? ""}
              </div>
            </div>
            <div className="ml-2">
              <StatusPill status={status} />
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <StatRow icon={Users}>
              <span className="font-medium text-gray-800 dark:text-gray-100">CCU {ccu}{capacity ? ` / ${capacity}` : ""}</span>
            </StatRow>

            <StatRow icon={MessageSquare}>
              <span>{messages} tin nhắn</span>
            </StatRow>

            <div className="flex items-center justify-between gap-2">
              <div className="flex flex-col gap-2">
                <StatRow icon={AlertTriangle}>
                  <span>{violations} vi phạm</span>
                </StatRow>

                <StatRow icon={LinkIcon}>
                  <span>{visibility ?? "Công khai"}</span>
                </StatRow>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <Button variant="ghost" className="flex-1" onClick={() => onOpen?.(id)}>Mở phòng</Button>
          <Button variant="outline" onClick={() => onModeration?.(id)}>Moderation</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RoomCard;