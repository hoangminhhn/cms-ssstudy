"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye, Trash2, Edit3 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface RoomRowData {
  id: string;
  code?: string;
  title: string;
  datetime?: string;
  course?: string;
  courseSub?: string;
  owner?: string;
  status?: "running" | "idle" | "ended";
  ccu?: number;
  participants?: number;
  messages?: number;
}

interface RoomRowProps {
  room: RoomRowData;
  onOpen: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const StatusPill: React.FC<{ status?: RoomRowData["status"] }> = ({ status }) => {
  if (!status) return null;
  const classes =
    status === "running"
      ? "bg-green-600 text-white"
      : status === "idle"
      ? "bg-yellow-500 text-white"
      : "bg-gray-400 text-white";
  return <span className={cn("inline-flex items-center px-3 py-1 rounded-full text-xs font-medium", classes)}>{status === "running" ? "Đang diễn ra" : status === "idle" ? "Tạm dừng" : "Kết thúc"}</span>;
};

const RoomRow: React.FC<RoomRowProps> = ({ room, onOpen, onEdit, onDelete }) => {
  return (
    <tr className="border-b last:border-b-0">
      <td className="p-4 align-top text-xs text-muted-foreground w-[96px]">{room.code ?? "RM" + room.id}</td>

      <td className="p-4 align-top">
        <div className="font-medium">{room.title}</div>
        {room.datetime && <div className="text-xs text-muted-foreground mt-1">{room.datetime}</div>}
      </td>

      <td className="p-4 align-top">
        <div className="font-medium">{room.course}</div>
        {room.courseSub && <div className="text-xs text-muted-foreground mt-1">{room.courseSub}</div>}
      </td>

      <td className="p-4 align-top">{room.owner ?? "-"}</td>

      <td className="p-4 align-top">
        <StatusPill status={room.status} />
      </td>

      <td className="p-4 align-top">{room.ccu ?? 0} / {room.participants ?? 0}</td>

      <td className="p-4 align-top">{room.messages ?? 0}</td>

      <td className="p-4 align-top text-right">
        <div className="inline-flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => onOpen(room.id)} title="Mở phòng">
            <Eye className="h-4 w-4" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(room.id)}>
                <Edit3 className="h-4 w-4 mr-2" /> Chỉnh sửa
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(room.id)} className="text-red-600">
                <Trash2 className="h-4 w-4 mr-2" /> Xóa
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </td>
    </tr>
  );
};

export default RoomRow;