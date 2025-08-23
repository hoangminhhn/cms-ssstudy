import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { toast } from "sonner";

interface Question {
  id: string;
  // other fields omitted
}

interface ExamPart {
  id: string;
  name: string;
  questions: Question[];
  // optional uploadedFileName?: string;
}

interface ExamConfig {
  perPartPoints: Record<string, number>; // total points per part (admin input)
  timeMode: "total" | "per-part";
  totalTimeMinutes: number;
  perPartTimes: Record<string, number>;
  enableQuestionNumbering: boolean;
  updatedPartNames?: Record<string, string>; // newly added: part title edits
  numberingOptions?: {
    format: "1" | "a" | "i";
    startFrom: number;
    resetPerPart: boolean;
  };
}

interface ExamConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  parts: ExamPart[];
  onSave?: (config: ExamConfig) => void;
}

const ExamConfigModal: React.FC<ExamConfigModalProps> = ({ isOpen, onClose, parts, onSave }) => {
  // initialize per-part points & times
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
  const [enableQuestionNumbering, setEnableQuestionNumbering] = React.useState<boolean>(true);
  const [partNames, setPartNames] = React.useState<Record<string, string>>(initialPartNames);

  // New numbering options state
  const [numberingFormat, setNumberingFormat] = React.useState<ExamConfig["numberingOptions"]["format"]>("1");
  const [numberingStartFrom, setNumberingStartFrom] = React.useState<number>(1);
  const [numberingResetPerPart, setNumberingResetPerPart] = React.useState<boolean>(false);

  React.useEffect(() => {
    // Reset whenever modal opens to reflect current parts
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
      // reset numbering options to sensible defaults (retain current UI state if desired)
      setNumberingFormat("1");
      setNumberingStartFrom(1);
      setNumberingResetPerPart(false);
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
      enableQuestionNumbering,
      updatedPartNames: partNames,
      numberingOptions: enableQuestionNumbering
        ? {
            format: numberingFormat,
            startFrom: Math.max(0, numberingStartFrom),
            resetPerPart: numberingResetPerPart,
          }
        : undefined,
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
          {/* Tổng điểm */}
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

          {/* Tổng số câu (read-only) */}
          <div className="flex flex-col">
            <Label className="text-xs mb-1 uppercase text-[11px] tracking-wide">TỔNG SỐ CÂU</Label>
            <Input
              value={String(numQuestions)}
              readOnly
              className="w-36 text-center bg-gray-50 dark:bg-gray-700"
            />
          </div>

          {/* Điểm mỗi câu (computed) */}
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

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Cấu hình đánh số câu hỏi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Bật đánh số câu hỏi</div>
                  <div className="text-sm text-muted-foreground">Khi bật, hệ thống sẽ hiển thị đánh số cho mỗi câu.</div>
                </div>
                <div>
                  <Switch checked={enableQuestionNumbering} onCheckedChange={(v) => setEnableQuestionNumbering(!!v)} />
                </div>
              </div>

              {/* Additional numbering options shown when enabled */}
              {enableQuestionNumbering && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                  <div>
                    <Label className="text-xs mb-1">Kiểu đánh số</Label>
                    <Select value={numberingFormat} onValueChange={(v) => setNumberingFormat(v as any)}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Chọn kiểu" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1, 2, 3 ...</SelectItem>
                        <SelectItem value="a">a, b, c ...</SelectItem>
                        <SelectItem value="i">i, ii, iii ...</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-xs mb-1">Bắt đầu từ</Label>
                    <Input
                      type="number"
                      min={0}
                      value={String(numberingStartFrom)}
                      onChange={(e) => setNumberingStartFrom(Math.max(0, Number(e.target.value || 0)))}
                      className="w-36"
                    />
                  </div>

                  <div>
                    <Label className="text-xs mb-1">Tuỳ chọn</Label>
                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={numberingResetPerPart}
                          onChange={(e) => setNumberingResetPerPart(e.target.checked)}
                          className="h-4 w-4 rounded border border-gray-300 bg-white"
                        />
                        <span className="text-sm">Đặt lại theo phần</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}
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