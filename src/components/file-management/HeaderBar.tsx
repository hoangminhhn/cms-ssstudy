"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, Grid } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const HeaderBar: React.FC = () => {
  const navigate = useNavigate();

  return (
    <header className="flex items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold text-orange-600">Quản lý Tập tin</h1>
        <p className="text-sm text-muted-foreground">Quản lý video bài giảng và tất cả tài nguyên học liệu</p>

        <div className="mt-4">
          <Tabs defaultValue="all" className="text-sm">
            <TabsList className="rounded-md bg-white shadow-sm">
              <TabsTrigger value="all" className="px-3 py-2">Tất cả (11)</TabsTrigger>
              <TabsTrigger value="images" className="px-3 py-2">Ảnh (3)</TabsTrigger>
              <TabsTrigger value="video" className="px-3 py-2">Video (5)</TabsTrigger>
              <TabsTrigger value="docs" className="px-3 py-2">Tài liệu (2)</TabsTrigger>
              <TabsTrigger value="icons" className="px-3 py-2">Icon (1)</TabsTrigger>
              <TabsTrigger value="other" className="px-3 py-2">Khác (0)</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="outline" onClick={() => toast.info("Chuyển đổi hiển thị (demo).")}>
          <Grid className="h-4 w-4" />
        </Button>

        <Button className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white flex items-center gap-2" onClick={() => toast.success("Mở dialog tải lên (demo).")}>
          <Plus className="h-4 w-4" /> Tải lên
        </Button>
      </div>
    </header>
  );
};

export default HeaderBar;