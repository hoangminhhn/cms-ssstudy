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

import ModerationTabs from "./moderation/ModerationTabs";
import ModerationList, { ModerationItem } from "./moderation/ModerationList";
import ViolationHistory, { Violation } from "./moderation/ViolationHistory";

/**
 * ModerationTab updated to render:
 * - stat tiles
 * - audit form + violation stats
 * - section 3 split into ModerationTabs + two-column layout:
 *    left = ModerationList (cards with actions)
 *    right = ViolationHistory (selected user)
 *
 * All actions are local/demo (toasts), components are separated for easier maintenance.
 */

const demoReports = [
  {
    id: "r1",
    name: "Trần Thị Y",
    email: "user123@example.com",
    time: "06/10/2025 19:23",
    reason: "Nội dung không phù hợp",
    message: "Ai có đáp án bài thi không? Inbox mình nhé",
    reportedBy: "user123@example.com",
  },
  {
    id: "r2",
    name: "Lê Văn Z",
    email: "baduser@example.com",
    time: "06/10/2025 19:23",
    reason: "Quấy rối, xúc phạm",
    message: "Thầy dạy kém quá, không hiểu gì cả!!!",
    reportedBy: "baduser@example.com",
  },
  {
    id: "r3",
    name: "Trần Thị Y",
    email: "user123@example.com",
    time: "07/10/2025 03:12",
    reason: "Spam",
    message: "Nội dung spam...",
    reportedBy: "user123@example.com",
  },
];

const ModerationTab: React.FC = () => {
  const [reports, setReports] = React.useState(demoReports);
  const [selectedStat, setSelectedStat] = React.useState<string | null>(null);

  // Section 3 specific state
  const [activeSection, setActiveSection] = React.useState<"flagged" | "violations">("flagged");
  const [selectedUserEmail, setSelectedUserEmail] = React.useState<string | undefined>(undefined);
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);

  // modal for audit results from the form
  const [resultsOpen, setResultsOpen] = React.useState(false);
  const [modalResults, setModalResults] = React.useState<Report[]>([]);

  // compute counts
  const flaggedCount = reports.length;
  const violationsCount = reports.length; // demo; could be different in real app

  const statItems: StatItem[] = [
    { id: "flagged", icon: AlertTriangle, count: flaggedCount, title: "Tin nhắn đánh dấu", subtitle: "Tin nhắn cần kiểm duyệt" },
    { id: "pending", icon: MessageSquare, count: 3, title: "Báo cáo chờ xử lý", subtitle: "Báo cáo cần xử lý" },
    { id: "banned", icon: Shield, count: 5, title: "Từ khóa cấm", subtitle: "Cảnh báo" },
    { id: "reviewed", icon: CheckCircle2, count: 0, title: "Đã xử lý", subtitle: "Đã duyệt / xóa" },
  ];

  // convert reports to ModerationItem for component
  const modItems: ModerationItem[] = reports.map((r) => ({
    id: r.id,
    name: r.name,
    email: r.email,
    time: r.time,
    reason: r.reason,
    message: r.message,
    reportedBy: r.reportedBy,
  }));

  const handleSelectStat = (id: string | null) => {
    setSelectedStat(id);
    toast.info(id ? `Bộ lọc: ${id}` : "Bỏ chọn bộ lọc");
  };

  const handleAuditSearch = (filters: { email?: string; room?: string }) => {
    const qEmail = filters.email?.toLowerCase() ?? "";
    const qRoom = filters.room?.toLowerCase() ?? "";

    const matched = reports.filter((r) => {
      if (qEmail) {
        if (!(r.reportedBy && r.reportedBy.toLowerCase().includes(qEmail))) return false;
      }
      if (qRoom) {
        if (!(r.message && r.message.toLowerCase().includes(qRoom))) return false;
      }
      return true;
    });

    const mapped: Report[] = matched.map((m) => ({
      id: m.id,
      target: m.name,
      reason: m.reason,
      reportedBy: m.reportedBy,
      time: m.time,
      type: undefined,
    }));

    setModalResults(mapped);
    setResultsOpen(true);
    toast.success(`Tìm thấy ${mapped.length} kết quả.`);
  };

  const handleToggleSelect = (id: string, checked: boolean) => {
    setSelectedIds((prev) => (checked ? [...prev, id] : prev.filter((p) => p !== id)));
  };

  const handleSelectUser = (reportedBy?: string) => {
    setSelectedUserEmail(reportedBy);
  };

  const handleApprove = (id: string) => {
    setReports((prev) => prev.filter((r) => r.id !== id));
    setSelectedIds((prev) => prev.filter((p) => p !== id));
    toast.success("Đã duyệt (demo).");
  };

  const handleHide = (id: string) => {
    setReports((prev) => prev.filter((r) => r.id !== id));
    setSelectedIds((prev) => prev.filter((p) => p !== id));
    toast.success("Đã ẩn (demo).");
  };

  const handleDelete = (id: string) => {
    setReports((prev) => prev.filter((r) => r.id !== id));
    setSelectedIds((prev) => prev.filter((p) => p !== id));
    toast.success("Đã xóa (demo).");
  };

  const handleBlockUser = (email?: string) => {
    if (!email) {
      toast.error("Chưa chọn người dùng.");
      return;
    }
    toast.success(`Đã chặn ${email} (demo).`);
  };

  // build violation list for selected user: for demo, collect reports where reportedBy equals selectedUserEmail
  const userViolations: Violation[] = React.useMemo(() => {
    if (!selectedUserEmail) return [];
    return reports
      .filter((r) => r.reportedBy === selectedUserEmail)
      .map((r) => ({
        id: r.id,
        reason: r.reason || "Vi phạm",
        date: r.time || "",
        room: r.name || "",
        snippet: r.message ? (r.message.length > 80 ? r.message.slice(0, 80) + "..." : r.message) : "",
      }));
  }, [reports, selectedUserEmail]);

  // derive selected user info
  const selectedUser = React.useMemo(() => {
    if (!selectedUserEmail) return undefined;
    const found = reports.find((r) => r.reportedBy === selectedUserEmail);
    return found ? { name: found.name, email: found.reportedBy } : { name: selectedUserEmail, email: selectedUserEmail };
  }, [reports, selectedUserEmail]);

  return (
    <div className="space-y-6">
      {/* Stat tiles */}
      <ModerationStats items={statItems} onSelect={handleSelectStat} selectedId={selectedStat} />

      {/* Audit form + Violation summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <AuditSearchForm onSearch={handleAuditSearch} showClear={false} />
        </div>
        <div className="lg:col-span-1">
          <ViolationStats />
        </div>
      </div>

      {/* Section 3: Tab strip + two-column layout */}
      <div>
        <ModerationTabs
          flaggedCount={flaggedCount}
          violationsCount={violationsCount}
          active={activeSection}
          onChange={(v) => setActiveSection(v)}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ModerationList
              items={modItems}
              selectedIds={selectedIds}
              onToggleSelect={handleToggleSelect}
              onSelectUser={handleSelectUser}
              onApprove={handleApprove}
              onHide={handleHide}
              onDelete={handleDelete}
            />
          </div>

          <div className="lg:col-span-1">
            <ViolationHistory user={selectedUser} violations={userViolations} onBlockUser={handleBlockUser} />
          </div>
        </div>
      </div>

      {/* Modal for search results */}
      <SearchResultsModal open={resultsOpen} onOpenChange={setResultsOpen} results={modalResults} />
    </div>
  );
};

export default ModerationTab;