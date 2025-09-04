"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const ClassContent: React.FC = () => {
  const [content, setContent] = React.useState<string>("");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nội dung</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="border rounded">
          <ReactQuill value={content} onChange={setContent} placeholder="Nhập nội dung chi tiết..." className="min-h-[320px]" />
        </div>
      </CardContent>
    </Card>
  );
};

export default ClassContent;