"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Props {
  initialQuery?: string;
  onSearch?: (q: string) => void;
}

const BookIdToolbar: React.FC<Props> = ({ initialQuery = "", onSearch }) => {
  const [q, setQ] = React.useState(initialQuery);
  const navigate = useNavigate();

  const handleSearch = () => {
    onSearch?.(q);
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          className="pl-10"
          placeholder="Tìm kiếm sách ID theo tên, tác giả, mã..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          aria-label="Tìm kiếm sách ID"
        />
      </div>

      <div className="flex gap-2">
        <Button variant="outline" onClick={() => { setQ(""); onSearch?.(""); }}>
          Đặt lại
        </Button>

        <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={handleSearch}>
          Tìm
        </Button>

        <Button
          className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
          onClick={() => navigate("/books-id?tab=add-book-id")}
        >
          <Plus className="h-4 w-4" /> Thêm Sách ID
        </Button>
      </div>
    </div>
  );
};

export default BookIdToolbar;