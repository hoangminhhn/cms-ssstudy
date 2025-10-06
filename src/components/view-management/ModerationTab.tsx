"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import ModerationStats, { StatItem } from "./moderation/ModerationStats";
import AuditSearchForm from "./moderation/AuditSearchForm";
import ViolationStats from "./moderation/ViolationStats";
import SearchResultsModal, { Report } from "./moderation/SearchResultsModal";

import ModerationTabs from "./moderation/ModerationTabs";
import ModerationList, { ModerationItem } from "./moderation/ModerationList";
import ViolationHistory, { Violation } from "./moderation/ViolationHistory";
import ReportList, { ReportListItem } from "./moderation/ReportList";

/**
 * ModerationTab orchestrates three sections:
 *  - top stat tiles
 *  - audit search form + small violation chart
 *  - section 3 with tabs:
 *      * "flagged" -> ModerationList (tin nhắn đánh dấu)
 *      * "violations" -> ReportList (báo cáo vi phạm as in screenshot)
 *
 * Actions are demo-only (toasts and local state).
 */

/* Demo source data: includes separate shapes for flagged messages and violation reports */
const demoFlagged: ModerationItem[] = [
  {
    id: "f1",
    name: "User A",
    email: "usera@example.com",
    time: "06/10/2025 19:23",
    reason: "spam",
    message: "Gửi nhiều link quảng cáo trong phòng",
    reportedBy: "reporter1@example.com",
  },
  {
    id: "f2",
    name: "User B",
    email: "userb@example.com",
    time: "06/10/2025 18:12",
    reason: "abuse",
    message: "Sử dụng lời lẽ xúc phạm",
    reportedBy: "reporter2@example.com",
  },
];

const demoViolations: ReportListItem[] = [
  {
    id: "v1",
    reporterEmail: "student1@example.com",
    targetEmail: "spam@example.com",
    reporterName: "student1",
    time: "06/10/2025 19:23",
    severity: "Cao",
    category: "Spam",
    message: "Người này liên tục gửi link quảng cáo trong phòng học",
  },
  {
    id: "v2",
    reporterEmail: "student2@example.com",
    targetEmail: "baduser@example.com",
    reporterName: "student2",
    time: "06/10/2025 19:23",
    severity: "Khẩn cấp",
    category: "Quấy rối",
    message: "Có hành vi xúc phạm giáo viên và các bạn trong phòng",
  },
  {
    id: "v3",
    reporterEmail: "student3@example.com",
    targetEmail: "user123@example.com",
    reporterName: "student3",
    time: "06/10/2025 19:23",
    severity: "Trung bình",
    category: "Nội dung không phù hợp",
    message: "Yêu cầu chia sẻ đáp án bài thi",
  },
];

const ModerationTab: React.FC = () => {
  // State
  const [flaggedItems, setFlaggedItems] = React.useState<ModerationItem[]>(demoFlagged);
  const [violationItems, setViolationItems] = React.useState<ReportListItem[]>(demoViolations);

  const [selectedStat, setSelectedStat] = React.useState<string | null>(null);
  const [activeSection, setActiveSection] = React.useState<"flagged" | "violations">("flagged");

  // selection for flagged list (checkboxes)
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
  // selected user email for right column
  const [selectedUserEmail, setSelectedUserEmail] = React.useState<string | undefined>(undefined);

  // modal for search results
  const [resultsOpen, setResultsOpen] = React.useState(false);
  const [modalResults, setModalResults] = React.useState<Report[]>([]);

  const statItems: StatItem[] = [
    { id: "flagged", icon: AlertTriangle, count: flaggedItems.length, title: "Tin nhắn đánh dấu", subtitle: "Tin nhắn cần kiểm duyệt" },
    { id: "pending", icon: MessageSquare, count: violationItems.length, title: "Báo cáo vi phạm", subtitle: "Báo cáo cần xử lý" },
    { id: "banned", icon: Shield, count: 5, title: "Từ khóa cấm", subtitle: "Cảnh báo" },
    { id: "reviewed", icon: CheckCircle2, count: 0, title: "Đã xử lý", subtitle: "Đã duyệt / xóa" },
  ];

  // Handlers for search: open modal with matched results and allow CSV download
  const handleAuditSearch = (filters: { email?: string; room?: string }) => {
    const qEmail = filters.email?.toLowerCase() ?? "";
    const qRoom = filters.room?.toLowerCase() ?? "";

    // Search both datasets and show combined results in modal for convenience
    const matchedFlagged = flaggedItems.filter((r) => {
      if (qEmail && !(r.reportedBy && r.reportedBy.toLowerCase().includes(qEmail))) return false;
      if (qRoom && !(r.message && r.message.toLowerCase().includes(qRoom))) return false;
      return true;
    }).map<Report>((r) => ({
      id: r.id,
      target: r.name,
      reason: r.reason ?? "",
      reportedBy: r.reportedBy ?? "",
      time: r.time ?? "",
      type: "flagged",
    }));

    const matchedViolations = violationItems.filter((v) => {
      if (qEmail && !(v.reporterEmail && v.reporterEmail.toLowerCase().includes(qEmail))) return false;
      if (qRoom && !(v.message && v.message.toLowerCase().includes(qRoom))) return false;
      return true;
    }).map<Report>((v) => ({
      id: v.id,
      target: v.targetEmail ?? "",
      reason: `${v.category ?? ""} - ${v.severity ?? ""}`,
      reportedBy: v.reporterEmail,
      time: v.time ?? "",
      type: "violation",
    }));

    const combined = [...matchedFlagged, ...matchedViolations];
    setModalResults(combined);
    setResultsOpen(true);
    toast.success(`Tìm thấy ${combined.length} kết quả.`);
  };

  // ModerationList callbacks (flagged)
  const handleToggleSelect = (id: string, checked: boolean) => {
    setSelectedIds((prev) => (checked ? [...prev, id] : prev.filter((p) => p !== id)));
  };
  const handleSelectUser = (reportedBy?: string) => {
    setSelectedUserEmail(reportedBy);
  };
  const handleApprove = (id: string) => {
    setFlaggedItems((prev) => prev.filter((p) => p.id !== id));
    setSelectedIds((prev) => prev.filter((p) => p !== id));
    toast.success("Đã duyệt (demo).");
  };
  const handleHide = (id: string) => {
    setFlaggedItems((prev) => prev.filter((p) => p.id !== id));
    setSelectedIds((prev) => prev.filter((p) => p !== id));
    toast.success("Đã ẩn (demo).");
  };
  const handleDelete = (id: string) => {
    setFlaggedItems((prev) => prev.filter((p) => p.id !== id));
    setSelectedIds((prev) => prev.filter((p) => p !== id));
    toast.success("Đã xóa (demo).");
  };

  // ReportList callbacks (violations)
  const handleWarn = (id: string) => {
    toast.success(`Cảnh cáo: ${id} (demo)`);
  };
  const handleMute = (id: string) => {
    toast.success(`Tắt tiếng: ${id} (demo)`);
  };
  const handleBlock = (id: string) => {
    setViolationItems((prev) => prev.filter((v) => v.id !== id));
    toast.success(`Đã chặn người dùng: ${id} (demo)`);
  };
  const handleIgnore = (id: string) => {
    setViolationItems((prev) => prev.filter((v) => v.id !== id));
    toast.success(`Bỏ qua báo cáo: ${id} (demo)`);
  };

  // Build user violations (right column)
  const userViolations = React.useMemo<Violation[]>(() => {
    if (!selectedUserEmail) return [];
    // from both flagged and violation arrays pick matching reportedBy or reporterEmail
    const list: Violation[] = [];
    flaggedItems.forEach((r) => {
      if (r.reportedBy === selectedUserEmail) {
        list.push({
          id: r.id,
          reason: r.reason ?? "Vi phạm",
          date: r.time ?? "",
          room: r.name ?? "",
          snippet: r.message ? (r.message.length > 120 ? r.message.slice(0, 120) + "..." : r.message) : "",
        });
      }
    });
    violationItems.forEach((v) => {
      if (v.reporterEmail === selectedUserEmail) {
        list.push({
          id: v.id,
          reason: `${v.category ?? ""} / ${v.severity ?? ""}`,
          date: v.time ?? "",
          room: v.targetEmail ?? "",
          snippet: v.message ? (v.message.length > 120 ? v.message.slice(0, 120) + "..." : v.message) : "",
        });
      }
    });
    return list;
  }, [flaggedItems, violationItems, selectedUserEmail]);

  const selectedUser = React.useMemo(() => {
    if (!selectedUserEmail) return undefined;
    const found = [...flaggedItems, ...violationItems].find((x: any) => (x.reportedBy === selectedUserEmail) || (x.reporterEmail === selectedUserEmail));
    return found ? { name: (found.reporterName ?? found.name ?? selectedUserEmail), email: selectedUserEmail } : { name: selectedUserEmail, email: selectedUserEmail };
  }, [selectedUserEmail, flaggedItems, violationItems]);

  const handleBlockUser = (email?: string) => {
    if (!email) {
      toast.error("Chưa chọn người dùng.");
      return;
    }
    toast.success(`Đã chặn ${email} (demo).`);
  };

  return (
    <div className="space-y-6">
      <ModerationStats items={statItems} onSelect={(id) => setSelectedStat(id)} selectedId={selectedStat} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <AuditSearchForm onSearch={handleAuditSearch} showClear={false} />
        </div>
        <div className="lg:col-span-1">
          <ViolationStats />
        </div>
      </div>

      <div>
        <ModerationTabs flaggedCount={flaggedItems.length} violationsCount={violationItems.length} active={activeSection} onChange={setActiveSection} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {activeSection === "flagged" ? (
              <ModerationList
                items={modItems}
                selectedIds={selectedIds}
                onToggleSelect={handleToggleSelect}
                onSelectUser={handleSelectUser}
                onApprove={handleApprove}
                onHide={handleHide}
                onDelete={handleDelete}
              />
            ) : (
              <ReportList
                items={violationItems}
                onWarn={handleWarn}
                onMute={handleMute}
                onBlock={handleBlock}
                onIgnore={handleIgnore}
                onSelectReporter={(email) => setSelectedUserEmail(email)}
              />
            )}
          </div>

          <div className="lg:col-span-1">
            <ViolationHistory user={selectedUser} violations={userViolations} onBlockUser={handleBlockUser} />
          </div>
        </div>
      </div>

      <SearchResultsModal open={resultsOpen} onOpenChange={setResultsOpen} results={modalResults} />
    </div>
  );
};

export default ModerationTab;