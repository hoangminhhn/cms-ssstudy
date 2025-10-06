"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatTileProps {
  icon: React.ElementType;
  count: number;
  title: string;
  subtitle?: string;
  active?: boolean;
  onClick?: () => void;
}

const StatTile: React.FC<StatTileProps> = ({ icon: Icon, count, title, subtitle, active = false, onClick }) => {
  return (
    <Card
      className={cn(
        "cursor-pointer transition-shadow hover:shadow-lg",
        active ? "ring-2 ring-orange-300" : ""
      )}
      onClick={onClick}
    >
      <CardContent className="flex items-center gap-4 p-4">
        <div
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-lg",
            active ? "bg-orange-50" : "bg-gray-50 dark:bg-gray-700"
          )}
          aria-hidden
        >
          <Icon className="h-6 w-6 text-gray-700" />
        </div>

        <div className="flex-1">
          <div className="text-xl font-semibold leading-none text-gray-900">{count}</div>
          <div className="text-sm text-gray-600">{title}</div>
          {subtitle && <div className="text-xs text-muted-foreground mt-1">{subtitle}</div>}
        </div>
      </CardContent>
    </Card>
  );
};

export default StatTile;