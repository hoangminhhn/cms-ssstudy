"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const ClassShortDescription: React.FC = () => {
  const [value, setValue] = React.useState<string>("");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mô tả ngắn</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="border rounded">
          <ReactQuill value={value} onChange={setValue} placeholder="Nhập mô tả ngắn..." className="min-h-[140px]" />
        </div>
      </CardContent>
    </Card>
  );
};

export default ClassShortDescription;