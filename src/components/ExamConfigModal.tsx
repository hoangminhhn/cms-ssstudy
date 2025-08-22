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
  parts.forEach((p) => {
    initialPerPartPoints[p.id] = 0;
    initialPerPartTimes[p.id] = 30;
  });

  const [perPartPoints, setPerPartPoints] = React.useState<Record<string, number>>(initialPerPartPoints);
  const [timeMode, setTimeMode] = React.useState<ExamConfig["timeMode"]>("total");
  const [totalTimeMinutes, setTotalTimeMinutes] = React.useState<number>(60);
  const [perPartTimes, setPerPartTimes] = React.useState<Record<string, number>>(initialPerPartTimes);
  const [enableQuestionNumbering, setEnableQuestionNumbering] = React.useState<boolean>(true);

  React.useEffect(() => {
    // Reset whenever modal opens to reflect current parts
    if (isOpen) {
      const freshPoints: Record<string, number> = {};
      const freshTimes: Record<string, number> = {};
      parts.forEach((p) => {
        freshPoints[p.id] = perPartPoints[p.id] ?? 0;
        freshTimes[p.id] = perPartTimes[p.id] ?? 30;
      });
      setPerPartPoints(freshPoints);
      setPerPartTimes(freshTimes);
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

  const handleSave = () => {
    const config = {
      perPartPoints,
      timeMode,
      totalTimeMinutes,
      perPartTimes,
      enableQuestionNumbering,
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
      <div key={p.id} className="grid grid-cols-1 md:grid-cols-4 gap-3 items-center border-b py-3">
        <div className="md:col-span-1">
          <div className="font-medium">{p.name}</div>
          <div className="text-sm text-muted-foreground">Số câu: {numQuestions}</div>
        </div>
        <div>
          <Label className="text-sm">Tổng điểm (admin)</Label>
          <Input
            type="number"
            min={0}
            value={String(totalPoints)}
            onChange={(e) => handlePerPartPointChange(p.id, e.target.value)}
            className="w-full"
          />
        </div>
        <div>
          <Label className="text-sm">Điểm / câu</Label>
          <div className="mt-1 text-sm font-medium">{Number.isFinite(pointPerQuestion) ? pointPerQuestion.toFixed(2) : "0.00"}</div>
        </div>
        <div>
          <Label className="text-sm">Thời gian (phút)</Label>
          <Input
            type="number"
            min={0}
            value={String(perPartTimes[p.id] ?? 30)}
            onChange={(e) => handlePerPartTimeChange(p.id, e.target.value)}
            className="w-full"
            disabled={timeMode === "total"}
          />
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
            <CardContent className="space-y-3">
              <div className="text-sm text-muted-foreground">Nhập tổng điểm cho mỗi phần, hệ thống sẽ tính điểm trên mỗi câu tự động dựa trên số câu đã có.</div>
              <div className="mt-2 space-y-2">
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
                        <Label className="text-sm">{p.name}</Label>
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
            <CardContent className="flex items-center justify-between">
              <div>
                <div className="font-medium">Bật đánh số câu hỏi</div>
                <div className="text-sm text-muted-foreground">Khi bật, hệ thống sẽ hiển thị đánh số cho mỗi câu.</div>
              </div>
              <div>
                <Switch checked={enableQuestionNumbering} onCheckedChange={(v) => setEnableQuestionNumbering(!!v)} />
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