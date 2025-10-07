"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FolderPlus, Search } from "lucide-react";
import { toast } from "sonner";

type Folder = {
  id: string;
  name: string;
  count?: number;
  color?: string;
  children?: Folder[];
};

const DEMO_FOLDERS: Folder[] = [
  { id: "all", name: "Tất cả tập tin", count: 11 },
  { id: "uncat", name: "Chưa phân loại", count: 11 },
  {
    id: "root",
    name: "Cây thư mục",
    children: [
      { id: "test", name: "Test thêm thư mục", count: 0 },
      { id: "highschool", name: "Trung học phổ thông", count: 0 },
      { id: "middleschool", name: "Trung học cơ sở", count: 0 },
      { id: "university", name: "Đại học", count: 0 },
      { id: "primary", name: "Tiểu học", count: 0 },
    ],
  },
];

const FolderSidebar: React.FC = () => {
  const [query, setQuery] = React.useState("");
  const [selected, setSelected] = React.useState<string>("all");

  const handleCreateRoot = () => {
    toast.success("Tạo thư mục gốc (demo).");
  };

  const renderFolder = (f: Folder, depth = 0) => {
    const isActive = selected === f.id;
    return (
      <div key={f.id} className="flex flex-col">
        <button
          onClick={() => setSelected(f.id)}
          className={`w-full text-left px-3 py-2 rounded-md flex items-center justify-between gap-2 ${isActive ? "bg-orange-50 text-orange-600" : "hover:bg-gray-100 dark:hover:bg-gray-800"}`}
        >
          <div className="flex items-center gap-3">
            <span className="inline-block h-3 w-3 rounded-full" style={{ background: f.color || "#cbd5e1" }} />
            <span className="truncate">{f.name}</span>
          </div>
          {typeof f.count === "number" && <span className="text-xs text-muted-foreground ml-2">{f.count}</span>}
        </button>

        {f.children && (
          <div className="ml-4 mt-1 space-y-1">
            {f.children.map((c) => renderFolder(c, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <aside className="w-72 bg-white dark:bg-gray-800 border-r border-gray-100 dark:border-gray-700 p-4 flex flex-col gap-4">
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="font-medium">Cây thư mục</div>
          <button
            onClick={() => {
              setQuery("");
              toast.info("Mở rộng/Thu gọn (demo).");
            }}
            className="text-xs text-muted-foreground"
            aria-label="toggle"
          >
            Mở rộng tất cả
          </button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Tìm thư mục..." className="pl-10" />
        </div>

        <div className="mt-3">
          <Button className="w-full bg-gradient-to-r from-orange-400 to-pink-500 hover:from-orange-500 hover:to-pink-600 text-white flex items-center gap-2 justify-center" onClick={handleCreateRoot}>
            <FolderPlus className="h-4 w-4" /> Tạo thư mục gốc
          </Button>
        </div>
      </div>

      <nav className="flex-1 overflow-auto mt-2">
        <div className="space-y-2">
          {DEMO_FOLDERS.map((f) => renderFolder(f))}
        </div>
      </nav>

      <div className="text-xs text-muted-foreground">
        <div> Mở rộng tất cả · Thu gọn tất cả </div>
      </div>
    </aside>
  );
};

export default FolderSidebar;