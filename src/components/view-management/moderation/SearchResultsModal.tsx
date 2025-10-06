"use client";

import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Download } from "lucide-react";

export type Report = {
  id: string;
  target: string;
  reason: string;
  reportedBy: string;
  time: string;
  type?: string;
};

interface SearchResultsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  results: Report[];
}

/**
 * Renders a dialog with a table of results and a CSV download action.
 */
const SearchResultsModal: React.FC<SearchResultsModalProps> = ({ open, onOpenChange, results }) => {
  const downloadCsv = () => {
    if (!results || results.length === 0) return;

    const headers = ["id", "target", "reason", "reportedBy", "time", "type"];
    const rows = results.map((r) =>
      headers.map((h) => {
        const v = (r as any)[h];
        // Escape quotes
        if (v === undefined || v === null) return "";
        const s = String(v).replace(/"/g, '""');
        return `"${s}"`;
      }).join(","),
    );

    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `moderation_search_results_${Date.now()}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => onOpenChange(o)}>
      <DialogContent className="max-w-4xl w-full">
        <DialogHeader>
          <DialogTitle>Kết quả tìm kiếm lịch sử chat</DialogTitle>
        </DialogHeader>

        <div className="max-h-[60vh] overflow-auto p-2">
          <div className="mb-3 flex items-center justify-end gap-2">
            <Button className="bg-sky-600 hover:bg-sky-700 text-white flex items-center gap-2" onClick={downloadCsv}>
              <Download className="h-4 w-4" /> Tải xuống CSV
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="text-left text-sm text-muted-foreground border-b">
                  <th className="p-2">Mã</th>
                  <th className="p-2">Đối tượng</th>
                  <th className="p-2">Lý do</th>
                  <th className="p-2">Người báo</th>
                  <th className="p-2">Thời gian</th>
                  <th className="p-2">Loại</th>
                </tr>
              </thead>
              <tbody>
                {results.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-muted-foreground">
                      Không có kết quả nào.
                    </td>
                  </tr>
                ) : (
                  results.map((r) => (
                    <tr key={r.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="p-2 align-top">{r.id}</td>
                      <td className="p-2 align-top">{r.target}</td>
                      <td className="p-2 align-top max-w-md truncate">{r.reason}</td>
                      <td className="p-2 align-top">{r.reportedBy}</td>
                      <td className="p-2 align-top">{r.time}</td>
                      <td className="p-2 align-top">{r.type ?? "-"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SearchResultsModal;