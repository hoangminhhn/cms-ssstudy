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

interface SubSubject {
  id: string;
  name: string;
}

interface SubPart {
  id: string;
  name: string;
  subSubjects?: SubSubject[]; // optional nested subjects
}

interface ExamPart {
  id: string;
  name: string;
  questions: Question[];
  // optional shape for parts with nested structure
  subParts?: SubPart[]; // optional
}

interface ExamConfig {
  perPartPoints: Record<string, number>; // total points per part (admin input)
  timeMode: "total" | "per-part";
  totalTimeMinutes: number;
  perPartTimes: Record<string, number>;
  enableQuestionNumbering: boolean;
  updatedPartNames?: Record<string, string>; // part title edits
  numberingOptions?: {
    mode: "sequential" | "custom";
    format: "1" | "a" | "i";
    // when sequential:
    startFrom?: number;
    // when custom:
    perItemStart?: Record<string, number>; // keys = partId or subPartId or subSubjectId
    resetPerPart?: boolean;
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

  // numbering controls
  const [numberingFormat, setNumberingFormat] = React.useState<ExamConfig["numberingOptions"]["format"]>("1");
  const [numberingMode, setNumberingMode] = React.useState<"sequential" | "custom">("sequential");
  const [sequentialStartFrom, setSequentialStartFrom] = React.useState<number>(1);
  const [numberingResetPerPart, setNumberingResetPerPart] = React.useState<boolean>(false);

  // For custom mode: map of start numbers keyed by item id (part id, subpart id, or subsubject id)
  const [perItemStart, setPerItemStart] = React.useState<Record<string, number>>({});

  React.useEffect(() => {
    // Reset whenever modal opens to reflect current parts
    if (isOpen) {
      const freshPoints: Record<string, number> = {};
      const freshTimes: Record<string, number> = {};
      const freshNames: Record<string, string> = {};
      const freshStarts: Record<string, number> = {};

      parts.forEach((p) => {
        freshPoints[p.id] = perPartPoints[p.id] ?? 0;
        freshTimes[p.id] = perPartTimes[p.id] ?? 30;
        freshNames[p.id] = p.name || p.id;
        // default custom start for a part
        freshStarts[p.id] = perItemStart[p.id] ?? 1;

        // if the part has subParts, initialize each subPart and its subSubjects
        if ((p as any).subParts && Array.isArray((p as any).subParts)) {
          (p as any).subParts.forEach((sp: SubPart) => {
            freshStarts[sp.id] = perItemStart[sp.id] ?? 1;
            if (sp.subSubjects && Array.isArray(sp.subSubjects)) {
              sp.subSubjects.forEach((ss: SubSubject) => {
                freshStarts[ss.id] = perItemStart[ss.id] ?? 1;
              });
            }
          });
        }
      });

      setPerPartPoints(freshPoints);
      setPerPartTimes(freshTimes);
      setPartNames(freshNames);
      setPerItemStart(freshStarts);

      // reasonable defaults for numbering
      setNumberingFormat("1");
      setNumberingMode("sequential");
      setSequentialStartFrom(1);
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

  const handlePerItemStartChange = (id: string, value: string) => {
    const num = Math.max(0, Number(value || 0));
    setPerItemStart((prev) => ({ ...prev, [id]: num }));
  };

  const handleSave = () => {
    const config: ExamConfig = {
      perPartPoints,
      timeMode,
      totalTimeMinutes,
      perPartTimes,
      enableQuestionNumbering,
      updatedPartNames: partNames,
      numberingOptions: {
        mode: numberingMode,
        format: numberingFormat,
        resetPerPart: numberingResetPerPart,
        ...(numberingMode === "sequential" ? { startFrom: sequentialStartFrom } : { perItemStart }),
      },
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

  const renderCustomNumberingPanel = () => {
    return (
      <div className="space-y-3">
        <Label className="text-sm">Đánh số thứ tự câu hỏi bắt đầu</Label>

        <div className="grid grid-cols-1 gap-3">
          {parts.map((p) => (
            <div key={p.id} className="border rounded-md p-3 bg-white dark:bg-gray-800">
              <div className="flex items-center justify-between mb-3">
                <div className="font-medium">{partNames[p.id] ?? p.name}</div>
                {/* If part has no subParts, show single input */}
                {!((p as any).subParts && (p as any).subParts.length > 0) && (
                  <div className="w-32">
                    <Input
                      value={String(perItemStart[p.id] ?? 1)}
                      onChange={(e) => handlePerItemStartChange(p.id, e.target.value)}
                      aria-label={`Số bắt đầu cho ${p.name}`}
                    />
                  </div>
                )}
              </div>

              {/* If part has subParts, render each subPart and subSubjects */}
              {(p as any).subParts && Array.isArray((p as any).subParts) && (
                <div className="space-y-3">
                  {(p as any).subParts.map((sp: SubPart) => (
                    <div key={sp.id} className="border rounded-md p-3 bg-gray-50 dark:bg-gray-900">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-semibold text-sm">{sp.name}</div>
                        {/* if subPart has no subSubjects, show input next to title */}
                        {!(sp.subSubjects && sp.subSubjects.length > 0) && (
                          <div className="w-28">
                            <Input
                              value={String(perItemStart[sp.id] ?? 1)}
                              onChange={(e) => handlePerItemStartChange(sp.id, e.target.value)}
                              aria-label={`Số bắt đầu cho ${sp.name}`}
                            />
                          </div>
                        )}
                      </div>

                      {/* If there are subSubjects, show them in grid with inputs */}
                      {sp.subSubjects && sp.subSubjects.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                          {sp.subSubjects.map((ss) => (
                            <div key={ss.id} className="flex items-center justify-between gap-3">
                              <div className="text-sm">{ss.name}</div>
                              <div className="w-28">
                                <Input
                                  value={String(perItemStart[ss.id] ?? 1)}
                                  onChange={(e) => handlePerItemStartChange(ss.id, e.target.value)}
                                  aria-label={`Số bắt đầu cho ${ss.name}`}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
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
              <div>
                <div className="font-medium mb-2">Chế độ đánh số</div>
                <div className="flex items-center gap-4 mb-3">
                  <label className={`px-3 py-2 rounded border ${numberingMode === "sequential" ? "bg-orange-50 border-orange-300" : "bg-white dark:bg-gray-800"}`}>
                    <input
                      type="radio"
                      name="numberingMode"
                      checked={numberingMode === "sequential"}
                      onChange={() => setNumberingMode("sequential")}
                      className="mr-2"
                    />
                    Đánh số tuần tự lặp lại
                  </label>

                  <label className={`px-3 py-2 rounded border ${numberingMode === "custom" ? "bg-orange-50 border-orange-300" : "bg-white dark:bg-gray-800"}`}>
                    <input
                      type="radio"
                      name="numberingMode"
                      checked={numberingMode === "custom"}
                      onChange={() => setNumberingMode("custom")}
                      className="mr-2"
                    />
                    Tùy chỉnh
                  </label>
                </div>

                {/* Format & reset options (always useful) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
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
                    <Label className="text-xs mb-1">Đặt lại theo phần</Label>
                    <div className="mt-2">
                      <Switch checked={numberingResetPerPart} onCheckedChange={(v) => setNumberingResetPerPart(!!v)} />
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs mb-1">Bắt đầu (cho chế độ tuần tự)</Label>
                    <Input
                      type="number"
                      min={0}
                      value={String(sequentialStartFrom)}
                      onChange={(e) => setSequentialStartFrom(Math.max(0, Number(e.target.value || 0)))}
                      className="w-36"
                      disabled={numberingMode !== "sequential"}
                    />
                  </div>
                </div>

                {/* Custom panel */}
                {numberingMode === "custom" && renderCustomNumberingPanel()}
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