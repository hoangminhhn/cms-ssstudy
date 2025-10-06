"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Trash2, Check } from "lucide-react";

type FlaggedMessage = {
  id: string;
  roomId: string;
  author: string;
  content: string;
  time: string;
  reason?: string;
};

interface Props {
  items: FlaggedMessage[];
  onResolve?: (id: string, action: "approve" | "hide" | "delete") => void;
}

const ModerationQueue: React.FC<Props> = ({ items, onResolve }) => {
  const handle = (id: string, action: "approve" | "hide" | "delete") => {
    onResolve?.(id, action);
    toast.success(`Đã ${action} tin (mô phỏng).`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Moderation Queue</CardTitle>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <div className="text-sm text-muted-foreground p-4">Không có tin bị cờ.</div>
        ) : (
          <div className="space-y-3">
            {items.map(it => (
              <div key={it.id} className="border rounded p-3 bg-white dark:bg-gray-800">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-sm font-medium">{it.author} <span className="text-xs text-muted-foreground">• {it.time}</span></div>
                    <div className="text-sm mt-2">{it.content}</div>
                    {it.reason && <div className="text-xs text-muted-foreground mt-2">Reason: {it.reason}</div>}
                    <div className="text-xs text-muted-foreground mt-2">Room: {it.roomId}</div>
                  </div>
                  <div className="flex flex-col gap-2 ml-4">
                    <Button variant="ghost" size="sm" onClick={() => handle(it.id, "approve")}><Check className="h-4 w-4 mr-1" />Approve</Button>
                    <Button variant="outline" size="sm" onClick={() => handle(it.id, "hide")}><Trash2 className="h-4 w-4 mr-1" />Hide</Button>
                    <Button variant="destructive" size="sm" onClick={() => handle(it.id, "delete")}><Trash2 className="h-4 w-4 mr-1" />Delete</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ModerationQueue;