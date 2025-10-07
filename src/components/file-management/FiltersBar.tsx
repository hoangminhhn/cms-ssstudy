"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { toast } from "sonner";

const FiltersBar: React.FC = () => {
  const [keyword, setKeyword] = React.useState("");
  const [type, setType] = React.useState("all");
  const [folder, setFolder] = React.useState("all");
  const [sort, setSort] = React.useState("newest");

  const handleReset = () => {
    setKeyword("");
    setType("all");
    setFolder("all");
    setSort("newest");
    toast.info("Đặt lại bộ lọc (demo).");
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 bg-white dark:bg-gray-800 rounded-md p-3 border">
      <div className="relative flex-1 max-w-lg">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input className="pl-10" placeholder="Tìm kiếm theo tên, mô tả, tags." value={keyword} onChange={(e) => setKeyword(e.target.value)} />
      </div>

      <div className="flex items-center gap-2 w-full sm:w-auto">
        <Select value={type} onValueChange={setType}>
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="image">Ảnh</SelectItem>
            <SelectItem value="video">Video</SelectItem>
            <SelectItem value="doc">Tài liệu</SelectItem>
          </SelectContent>
        </Select>

        <Select value={folder} onValueChange={setFolder}>
          <SelectTrigger className="w-[160px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả thư mục</SelectItem>
            <SelectItem value="test">Test thêm thư mục</SelectItem>
            <SelectItem value="highschool">Trung học phổ thông</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Mới nhất</SelectItem>
            <SelectItem value="oldest">Cũ nhất</SelectItem>
            <SelectItem value="name">Tên A-Z</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline" onClick={handleReset}>Đặt lại</Button>
      </div>
    </div>
  );
};

export default FiltersBar;