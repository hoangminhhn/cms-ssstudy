import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
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
  enableQuestionNumbering: boolean;
  updatedPartNames?: Record<string, string>;
  numberingOptions?: {
    mode: "sequential" | "custom";
    perItemStart?: Record<string, number>;
  };
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
  const [enableQuestionNumbering, setEnableQuestionNumbering] = React.useState<boolean>(false); // default off
  const [partNames, setPartNames] = React.useState<Record<string, string>>(initialPartNames);

  // numbering controls: mode + per-item starts for custom mode
  const [numberingMode, setNumberingMode] = React.useState<"sequential" | "custom">("sequential");
  const [perItemStart, setPerItemStart] = React.useState<Record<string, number>>({});

  React.useEffect(() => {
    if (isOpen) {
      const freshPoints: Record<string, number> = {};
      const freshTimes: Record<string, number> = {};
      const freshNames: Record<string, string> = {};
      const freshStarts: Record<string, number> = {};

      parts.forEach((p) => {
        freshPoints[p.id] = perPartPoints[p.id] ?? 0;
        freshTimes[p.id] = perPartTimes[p.id] ?? 30;
        freshNames[p.id] = p.name || p.id;
        freshStarts[p.id] = perItemStart[p.id] ?? 1;

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

      // sensible default
      setNumberingMode("sequential");
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
      numberingOptions: enableQuestionNumbering
        ? numberingMode === "custom"
          ? { mode: "custom", perItemStart }
          : { mode: "sequential" }
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

  // New custom layout: non-group parts displayed compact in a two-column grid,
  // grouped parts rendered as full-width cards with group headings and a two-column grid of subject + input pairs.
  const renderCustomNumberingPanel = () => {
    const nonGroupParts = parts.filter((p) => !p.subParts || p.subParts.length === 0);
    const groupParts = parts.filter((p) => p.subParts && p.subParts.length > 0);

    return (
      <div className="space-y-4">
        {/* Compact grid for simple parts (Part 1, Part 2 ...) */}
        {nonGroupParts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {nonGroupParts.map((p) => (
              <div key={p.id} className="border rounded-md p-3 bg-white dark:bg-gray-800 flex items-center justify-between">
                <div className="text-sm font-medium">{partNames[p.id] ?? p.name}</div>
                <div className="w-24">
                  <Input
                    value={String(perItemStart[p.id] ?? 1)}
                    onChange={(e) => handlePerItemStartChange(p.id, e.target.value)}
                    className="text-center"
                    aria-label={`Số bắt đầu cho ${p.name}`}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Full blocks for group parts */}
        {groupParts.map((p) => (
          <div key={p.id} className="border rounded-md bg-white dark:bg-gray-800 overflow-hidden">
            <div className="p-3 border-b bg-gray-50 dark:bg-gray-900">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">{partNames[p.id] ?? p.name}</div>
                <div className="text-sm text-muted-foreground"> </div>
              </div>
            </div>

            <div className="p-4 space-y-4">
              {(p.subParts || []).map((group) => (
                <div key={group.id} className="space-y-3">
                  {/* group header */}
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300">{group.name}</div>

                  {/* subjects in two columns */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {group.subSubjects && group.subSubjects.length > 0 ? (
                      group.subSubjects.map((ss) => (
                        <div key={ss.id} className="flex items-center justify-between border rounded-md p-3 bg-white dark:bg-gray-800">
                          <div className="text-sm">{ss.name}</div>
                          <div className="w-28">
                            <Input
                              value={String(perItemStart[ss.id] ?? 1)}
                              onChange={(e) => handlePerItemStartChange(ss.id, e.target.value)}
                              className="text-center"
                              aria-label={`Số bắt đầu cho ${ss.name}`}
                            />
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-sm text-muted-foreground">Chưa có môn học</div>
                    )}
                  </div>
                </div>
              ))}

              {/* separator and any top-level subSubjects directly under the part (if present) */}
              {(p as any).subSubjects && Array.isArray((p as any).subSubjects) && (p as any).subSubjects.length > 0 && (
                <div>
                  <div className="border-t mt-4 pt-4 text-sm font-medium text-gray-700 dark:text-gray-300">Khác</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                    {(p as any).subSubjects.map((ss: SubSubject) => (
                      <div key={ss.id} className="flex items-center justify-between border rounded-md p-3 bg-white dark:bg-gray-800">
                        <div className="text-sm">{ss.name}</div>
                        <div className="w-28">
                          <Input
                            value={String(perItemStart[ss.id] ?? 1)}
                            onChange={(e) => handlePerItemStartChange(ss.id, e.target.value)}
                            className="text-center"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
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
            {/* Use a simple flex container so title and switch stay on one line */}
            <CardHeader className="items-center">
              <div className="w-full flex items-center justify-between">
                <div className="text-sm font-medium">Cấu hình đánh số câu hỏi</div>
                <div>
                  <Switch checked={enableQuestionNumbering} onCheckedChange={(v) => setEnableQuestionNumbering(!!v)} />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Only render numbering controls when switch is enabled */}
              {enableQuestionNumbering ? (
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

                  {/* Show the redesigned custom panel only for custom mode */}
                  {numberingMode === "custom" && renderCustomNumberingPanel()}
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">Tắt: hệ thống sẽ không đánh số câu hỏi tự động.</div>
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