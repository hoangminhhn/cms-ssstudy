"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2, Check, MessageSquare, AlertTriangle, Shield, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import ModerationStats, { StatItem } from "./moderation/ModerationStats";
import AuditSearchForm from "./moderation/AuditSearchForm";
import ViolationStats from "./moderation/ViolationStats";
import SearchResultsModal, { Report } from "./moderation/SearchResultsModal";

/**
 * ModerationTab: shows top stat tiles (implemented with ModerationStats + StatTile),
 * Section 2: Audit search form (left) + Violation stats (right)
 * Section 3: reports table
 *
 * Updated: when AuditSearchForm triggers onSearch, open a modal with results and allow CSV download.
 */

type ReportInternal = {
  id: string;
  target: string;
  reason: string;
  reportedBy: string;
  time: string;
  type?: string;
};

const demoReports: ReportInternal[] = [
  { id: "rep1", target: "Phòng Toán 10A1", reason: "Nội dung không phù hợp", reportedBy: "hn_user", time: "11:02", type: "flagged" },
  { id: "rep2", target: "Bình luận #234", reason: "Spam", reportedBy: "admin", time: "10:21", type: "pending" },
  { id: "rep3", target: "User xyz", reason: "Từ khóa cấm", reportedBy: "mod1", time: "09:12", type: "banned" },
  { id: "rep4", target: "Bài đăng #55", reason: "Đã được chọn", reportedBy: "mod2", time: "08:02", type: "reviewed" },
];

const ModerationTab: React.FC = () => {
  const [reports, setReports] = React.useState<ReportInternal[]>(demoReports);
  const [selectedStat, setSelectedStat] = React.useState<string | null>(null);
  const [filterCriteria, setFilterCriteria] = React.useState<{ email?: string; room?: string }>({});

  // Modal state for search results
  const [resultsOpen, setResultsOpen] = React.useState(false);
  const [modalResults, setModalResults] = React.useState<Report[]>([]);

  // compute counts for the tiles (demo logic)
  const counts = {
    flagged: reports.filter((r) => r.type === "flagged").length || 2,
    pending: reports.filter((r) => r.type === "pending").length || 3,
    banned: reports.filter((r) => r.type === "banned").length || 5,
    reviewed: reports.filter((r) => r.type === "reviewed").length || 0,
  };

  const statItems: StatItem[] = [
    { id: "flagged", icon: AlertTriangle, count: counts.flagged, title: "Tin nhắn đánh dấu", subtitle: "Tin nhắn đánh dấu" },
    { id: "pending", icon: MessageSquare, count: counts.pending, title: "Báo cáo chờ xử lý", subtitle: "Báo cáo chờ xử lý" },
    { id: "banned", icon: Shield, count: counts.banned, title: "Từ khóa cấm", subtitle: "Từ khóa cấm" },
    { id: "reviewed", icon: CheckCircle2, count: counts.reviewed, title: "Đã chọn", subtitle: "Đã chọn" },
  ];

  const handleResolve = (id: string) => {
    setReports((prev) => prev.filter((r) => r.id !== id));
    toast.success("Đã xử lý báo cáo (demo).");
  };

  const handleRemove = (id: string) => {
    setReports((prev) => prev.filter((r) => r.id !== id));
    toast.success("Đã xóa mục vi phạm (demo).");
  };

  const handleSelectStat = (id: string | null) => {
    setSelectedStat(id);
    toast.info(id ? `Bộ lọc: ${id}` : "Bỏ chọn bộ lọc");
  };

  // Called by AuditSearchForm when user clicks "Tìm kiếm"
  const handleAuditSearch = (filters: { email?: string; room?: string }) => {
    setFilterCriteria(filters);

    // compute matching results based on current reports and filters
    const qEmail = filters.email?.toLowerCase() ?? "";
    const qRoom = filters.room?.toLowerCase() ?? "";

    const matched = reports.filter((r) => {
      if (qEmail) {
        if (!(r.reportedBy && r.reportedBy.toLowerCase().includes(qEmail))) return false;
      }
      if (qRoom) {
        if (!(r.target && r.target.toLowerCase().includes(qRoom))) return false;
      }
      // if both empty, show nothing (but AuditSearchForm prevents this)
      return true;
    });

    // Map to Report type used by modal
    const mapped: Report[] = matched.map((m) => ({
      id: m.id,
      target: m.target,
      reason: m.reason,
      reportedBy: m.reportedBy,
      time: m.time,
      type: m.type,
    }));

    setModalResults(mapped);
    setResultsOpen(true);
    toast.success(`Tìm thấy ${mapped.length} kết quả.`);
  };

  const filteredReports = React.useMemo(() => {
    let list = reports.slice();
    if (selectedStat) list = list.filter((r) => r.type === selectedStat);
    if (filterCriteria.email) {
      const q = filterCriteria.email.toLowerCase();
      list = list.filter((r) => r.reportedBy.toLowerCase().includes(q));
    }
    if (filterCriteria.room) {
      const q = filterCriteria.room.toLowerCase();
      list = list.filter((r) => r.target.toLowerCase().includes(q));
    }
    return list;
  }, [reports, selectedStat, filterCriteria]);

  return (
    <div className="space-y-6">
      {/* Section 1: Tiles */}
      <ModerationStats items={statItems} onSelect={handleSelectStat} selectedId={selectedStat} />

      {/* Section 2: Audit form (left) + Violation stats (right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          {/* Pass showClear={false} to remove the 'Hủy' button in this context */}
          <AuditSearchForm onSearch={handleAuditSearch} showClear={false} />
        </div>

        <div className="lg:col-span-1">
          <ViolationStats />
        </div>
      </div>

      {/* Section 3: Reports table */}
      <Card>
        <CardHeader>
          <CardTitle>Kiểm duyệt</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Đối tượng</TableHead>
                  <TableHead>Lý do</TableHead>
                  <TableHead>Người báo</TableHead>
                  <TableHead>Thời gian</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredReports.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell>{r.target}</TableCell>
                    <TableCell className="max-w-xs truncate">{r.reason}</TableCell>
                    <TableCell>{r.reportedBy}</TableCell>
                    <TableCell>{r.time}</TableCell>
                    <TableCell className="text-right">
                      <div className="inline-flex items-center gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleResolve(r.id)} title="Đánh dấu đã xử lý">
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleRemove(r.id)} className="text-red-600" title="Xóa nội dung">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => toast.info('Mở trang chat (demo)')}>
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}

                {filteredReports.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="p-8 text-center text-muted-foreground">
                      Không có báo cáo nào.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Search results modal */}
      <SearchResultsModal open={resultsOpen} onOpenChange={setResultsOpen} results={modalResults} />
    </div>
  );
};

export default ModerationTab;