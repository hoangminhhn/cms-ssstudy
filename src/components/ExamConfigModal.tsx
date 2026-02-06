"use client";

import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

interface Question {
  id: string;
}

interface SubSubject {
  id: string;
  name: string;
}

interface SubPart {
  id: string;
  name: string;
  subSubjects?: SubSubject[];
}

interface ExamPart {
  id: string;
  name: string;
  questions: Question[];
  subParts?: SubPart[];
}

interface ExamConfig {
  perPartPoints: Record<string, number>;
  timeMode: "total" | "per-part";
  totalTimeMinutes: number;
  perPartTimes: Record<string, number>;
  enableQuestionNumbering?: boolean;
  updatedPartNames?: Record<string, string>;
  numberingOptions?: {
    mode: "sequential" | "custom";
    perItemStart?: Record<string, number>;
  };
  // New: gift config
  giftEnabled?: boolean;
  selectedGiftId?: string | null;
}

interface ExamConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  parts: ExamPart[];
  onSave?: (config: ExamConfig) => void;
}

const ExamConfigModal: React.FC<ExamConfigModalProps> = ({ isOpen, onClose, parts, onSave }) => {
  const initialPerPartPoints: Record<string, number> = {};
  const initialPerPartTimes: Record<string, number> = {};
  const initialPartNames: Record<string, string> = {};
  parts.forEach((p) => {
    initialPerPartPoints[p.id] = 0;
    initialPerPartTimes[p.id] = 30;
    initialPartNames[p.id] = p.name || p.id;
  });

  const [perPartPoints, setPerPartPoints] = React.useState<Record<string, number>>(initialPerPartPoints);
  const [timeMode, setTimeMode] = React.useState<ExamConfig["timeMode"]>("total");
  const [totalTimeMinutes, setTotalTimeMinutes] = React.useState<number>(60);
  const [perPartTimes, setPerPartTimes] = React.useState<Record<string, number>>(initialPerPartTimes);
  const [partNames, setPartNames] = React.useState<Record<string, string>>(initialPartNames);

  // New: gift state & demo data
  const [giftEnabled, setGiftEnabled] = React.useState<boolean>(false);
  const demoGifts = React.useMemo(
    () => [
      { id: "gift-1", label: "Lì xì đề ngắn" },
      { id: "gift-2", label: "Lì xì đề dài" },
    ],
    [],
  );
  const [selectedGiftId, setSelectedGiftId] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (isOpen) {
      const freshPoints: Record<string, number> = {};
      const freshTimes: Record<string, number> = {};
      const freshNames: Record<string, string> = {};

      parts.forEach((p) => {
        freshPoints[p.id] = perPartPoints[p.id] ?? 0;
        freshTimes[p.id] = perPartTimes[p.id] ?? 30;
        freshNames[p.id] = p.name || p.id;
      });

      setPerPartPoints(freshPoints);
      setPerPartTimes(freshTimes);
      setPartNames(freshNames);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, parts]);

  const handlePerPartPointChange = (partId: string, value: string) => {
    const num = Math.max(0, Number(value || 0));
    setPerPartPoints((prev) => ({ ...prev, [partId]: num }));
  };

  const handlePerPartTimeChange = (partId: string, value: string) => {
    const num = Math.max(0, Number(value || 0));
    setPerPartTimes((prev) => ({ ...prev, [partId]: num }));
  };

  const handlePartNameChange = (partId: string, value: string) => {
    setPartNames((prev) => ({ ...prev, [partId]: value }));
  };

  const handleSave = () => {
    const config: ExamConfig = {
      perPartPoints,
      timeMode,
      totalTimeMinutes,
      perPartTimes,
      updatedPartNames: partNames,
      giftEnabled: giftEnabled,
      selectedGiftId: giftEnabled ? selectedGiftId : null,
    };
    if (onSave) onSave(config);
    console.log("Exam config saved:", config);
    toast.success("Cấu hình đề thi đã được lưu.");
    onClose();
  };

  const renderPartRow = (p: ExamPart) => {
    const numQuestions = p.questions?.length ?? 0;
    const totalPoints = perPartPoints[p.id] ?? 0;
    const pointPerQuestion = numQuestions > 0 ? totalPoints / numQuestions : 0;

    return (
      <div key={p.id} className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 py-3 border-b">
        <div className="min-w-0 flex-1">
          <Label className="text-sm mb-1">Tiêu đề phần</Label>
          <Input
            value={partNames[p.id] ?? p.name}
            onChange={(e) => handlePartNameChange(p.id, e.target.value)}
            className="mb-2"
            aria-label={`Tiêu đề cho ${p.name}`}
          />
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-2 md:mt-0">
          <div className="flex flex-col">
            <Label className="text-xs mb-1">Tổng điểm</Label>
            <Input
              type="number"
              min={0}
              value={String(totalPoints)}
              onChange={(e) => handlePerPartPointChange(p.id, e.target.value)}
              className="w-36 text-center"
            />
          </div>

          <div className="flex flex-col">
            <Label className="text-xs mb-1 uppercase text-[11px] tracking-wide">TỔNG SỐ CÂU</Label>
            <Input
              value={String(numQuestions)}
              readOnly
              className="w-36 text-center bg-gray-50 dark:bg-gray-700"
            />
          </div>

          <div className="flex flex-col">
            <Label className="text-xs mb-1">Điểm mỗi câu</Label>
            <Input
              value={Number.isFinite(pointPerQuestion) ? pointPerQuestion.toFixed(2) : "0.00"}
              readOnly
              className="w-36 text-center bg-gray-50 dark:bg-gray-700"
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Cấu hình đề thi</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Chia điểm theo từng phần thi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-sm text-muted-foreground">Nhập tổng điểm cho mỗi phần; hệ thống sẽ tính Điểm mỗi câu dựa trên số câu đã có.</div>
              <div className="mt-2 divide-y">
                {parts.map((p) => renderPartRow(p))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Thời gian thi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <Label className="text-sm">Chế độ thời gian:</Label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setTimeMode("total")}
                    className={`px-3 py-1 rounded ${timeMode === "total" ? "bg-orange-500 text-white" : "bg-gray-200 dark:bg-gray-700"}`}
                  >
                    Tổng
                  </button>
                  <button
                    type="button"
                    onClick={() => setTimeMode("per-part")}
                    className={`px-3 py-1 rounded ${timeMode === "per-part" ? "bg-orange-500 text-white" : "bg-gray-200 dark:bg-gray-700"}`}
                  >
                    Theo phần
                  </button>
                </div>
              </div>

              {timeMode === "total" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-center">
                  <Label>Tổng thời gian (phút)</Label>
                  <Input type="number" min={0} value={String(totalTimeMinutes)} onChange={(e) => setTotalTimeMinutes(Math.max(0, Number(e.target.value || 0)))} className="w-40" />
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Nhập số phút cho mỗi phần:</div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {parts.map((p) => (
                      <div key={p.id}>
                        <Label className="text-sm">{partNames[p.id] ?? p.name}</Label>
                        <Input type="number" min={0} value={String(perPartTimes[p.id] ?? 30)} onChange={(e) => handlePerPartTimeChange(p.id, e.target.value)} className="w-full" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* New: Gift switch + selectable demo gifts */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Quà tặng</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Kích hoạt quà tặng</div>
                  <div className="text-sm text-muted-foreground">Bật để cho phép gán quà tặng cho đề thi</div>
                </div>
                <div>
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={giftEnabled}
                      onChange={(e) => {
                        setGiftEnabled(!!e.target.checked);
                        if (!e.target.checked) setSelectedGiftId(null);
                      }}
                      className="sr-only"
                      aria-label="Kích hoạt quà tặng"
                    />
                    <span className={`w-11 h-6 relative inline-block rounded-full ${giftEnabled ? "bg-green-400" : "bg-gray-200"}`}>
                      <span
                        className={`absolute left-0 top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${giftEnabled ? "translate-x-5" : "translate-x-0"}`}
                      />
                    </span>
                  </label>
                </div>
              </div>

              <div className="mt-4">
                {giftEnabled ? (
                  <div>
                    <div className="text-sm font-medium mb-2">Danh sách quà tặng (demo)</div>
                    <div className="grid gap-2">
                      {[
                        { id: "gift-1", label: "Lì xì đề ngắn" },
                        { id: "gift-2", label: "Lì xì đề dài" },
                      ].map((g) => (
                        <label key={g.id} className="flex items-center gap-3 p-2 border rounded hover:bg-gray-50 cursor-pointer">
                          <input
                            type="radio"
                            name="exam-gift"
                            checked={selectedGiftId === g.id}
                            onChange={() => setSelectedGiftId(g.id)}
                            className="h-4 w-4"
                          />
                          <div className="flex-1">
                            <div className="font-medium">{g.label}</div>
                            <div className="text-xs text-muted-foreground">Mô tả ngắn cho {g.label}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                    <div className="mt-2 text-xs text-muted-foreground">Chọn một quà tặng để gán cho đề thi khi kích hoạt.</div>
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">Quà tặng chưa được kích hoạt.</div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter className="flex justify-end gap-3 mt-4">
          <Button variant="outline" onClick={onClose}>Hủy</Button>
          <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={handleSave}>Lưu cấu hình</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ExamConfigModal;