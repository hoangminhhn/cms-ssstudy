"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { List, Plus } from "lucide-react";

const CourseIncludes: React.FC = () => {
  // This component renders the included-items area.
  // Kept intentionally simple to avoid changing existing behavior.
  const items = [
    { id: 1, name: "Khóa A" },
    { id: 2, name: "Khóa B" },
    { id: 3, name: "Khóa C" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sách bao gồm</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {items.map((it) => (
            <div
              key={it.id}
              className="flex items-center justify-between rounded-md p-2 bg-gray-50 dark:bg-gray-800"
            >
              <div className="flex items-center space-x-2">
                <List className="h-4 w-4 text-gray-500" />
                <span className="text-sm">{it.name}</span>
              </div>
              <div className="text-sm text-gray-500">1</div>
            </div>
          ))}

          <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white" size="sm">
            <Plus className="mr-2 h-4 w-4" /> Thêm mục
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseIncludes;