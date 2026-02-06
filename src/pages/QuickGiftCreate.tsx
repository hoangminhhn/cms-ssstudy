"use client";

import React from "react";
import Layout from "@/components/Layout";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tag, FileText, BookOpen } from "lucide-react";
import { toast } from "sonner";

const EXAM_PERIODS = [
  "Kỳ thi HSA",
  "Kỳ thi TSA",
  "Kỳ thi Tốt Nghiệp",
  "Kỳ thi V-ACT",
];

type IconKey = "Tag" | "FileText" | "BookOpen";

const ICON_OPTIONS: { key: IconKey; label: string; comp: React.ComponentType<any> }[] = [
  { key: "Tag", label: "Tag", comp: Tag },
  { key: "FileText", label: "File", comp: FileText },
  { key: "BookOpen", label: "Sách", comp: BookOpen },
];

const QuickGiftCreate: React.FC = () => {
  const [examPeriod, setExamPeriod] = React.useState<string>(EXAM_PERIODS[0]);
  const [ctaText, setCtaText] = React.useState<string>("Nhận lì xì");
  const [destinationUrl, setDestinationUrl] = React.useState<string>("");

  // Label fields
  const [hasLabel, setHasLabel] = React.useState<boolean>(false);
  const [selectedLabelIcon, setSelectedLabelIcon] = React.useState<IconKey>("Tag");
  const [labelContent, setLabelContent] = React.useState<string>("");

  // CTA icon
  const [selectedCtaIcon, setSelectedCtaIcon] = React.useState<IconKey>("Tag");

  // Dialog state for icon picker: target can be 'cta' or 'label'
  const [iconDialogOpen, setIconDialogOpen] = React.useState<boolean>(false);
  const [iconDialogTarget, setIconDialogTarget] = React.useState<"cta" | "label">("label");

  // Status switch in header
  const [statusEnabled, setStatusEnabled] = React.useState<boolean>(true);

  const handleOpenIconDialog = (target: "cta" | "label") => {
    setIconDialogTarget(target);
    setIconDialogOpen(true);
  };

  const handleSelectIcon = (key: IconKey) => {
    if (iconDialogTarget === "cta") {
      setSelectedCtaIcon(key);
      toast.success("Đã chọn icon cho CTA (demo).");
    } else {
      setSelectedLabelIcon(key);
      toast.success("Đã chọn icon cho nhãn (demo).");
    }
    setIconDialogOpen(false);
  };

  const handleSave = () => {
    // In real app you'd submit to API. Here just demo toast.
    const payload = {
      examPeriod,
      ctaText,
      destinationUrl,
      ctaIcon: selectedCtaIcon,
      hasLabel,
      labelIcon: selectedLabelIcon,
      labelContent,
      statusEnabled,
    };
    console.log("Saving quick gift (demo) payload:", payload);
    toast.success("Đã lưu (demo).");
  };

  return (
    <Layout headerTitle="Tạo quà tặng mới">
      <div className="max-w-5xl mx-auto w-full p-6">
        <Card>
          {/* Header: title left, Status Switch right */}
          <CardHeader>
            <div className="flex items-center justify-between w-full gap-4">
              <div>
                <CardTitle className="m-0 text-lg">Thông tin nhanh</CardTitle>
                <div className="text-sm text-muted-foreground">Điền thông tin cơ bản cho quà tặng</div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-sm">Trạng thái</span>
                <Switch checked={statusEnabled} onCheckedChange={(v) => setStatusEnabled(!!v)} />
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Top row with three columns: Kỳ thi / CTA / Url */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="exam-period" className="text-sm">Kỳ thi</Label>
                <Select value={examPeriod} onValueChange={(v) => setExamPeriod(v)}>
                  <SelectTrigger id="exam-period" className="w-full mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {EXAM_PERIODS.map((p) => (
                      <SelectItem key={p} value={p}>
                        {p}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="cta-text" className="text-sm">CTA (nút hiển thị)</Label>
                <div className="mt-2 flex items-center gap-2">
                  {/* ICON FIRST: before the input */}
                  <button
                    type="button"
                    onClick={() => handleOpenIconDialog("cta")}
                    className="h-10 w-10 rounded-md border bg-white dark:bg-gray-800 flex items-center justify-center hover:bg-gray-50"
                    aria-label="Chọn icon CTA"
                    title="Chọn icon CTA"
                  >
                    {React.createElement(ICON_OPTIONS.find((i) => i.key === selectedCtaIcon)!.comp, { className: "h-4 w-4" })}
                  </button>

                  <Input
                    id="cta-text"
                    value={ctaText}
                    onChange={(e) => setCtaText(e.target.value)}
                    placeholder="Nhận lì xì"
                    className="flex-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="destination-url" className="text-sm">Url đích</Label>
                <Input
                  id="destination-url"
                  value={destinationUrl}
                  onChange={(e) => setDestinationUrl(e.target.value)}
                  placeholder="https://"
                  className="mt-2"
                />
              </div>
            </div>

            {/* Second row: switch for label and conditional fields */}
            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center gap-3">
                <Switch checked={hasLabel} onCheckedChange={(v) => setHasLabel(!!v)} />
                <Label className="mb-0">Nhãn làm bài tập</Label>
              </div>

              {/* When enabled show icon selector + content input */}
              <div>
                {hasLabel ? (
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    {/* Icon selector */}
                    <div className="flex-shrink-0 w-full sm:w-48">
                      <Label className="text-sm block mb-1">Icon</Label>

                      <div className="mt-2">
                        <button
                          type="button"
                          onClick={() => handleOpenIconDialog("label")}
                          className="w-full h-10 flex items-center gap-3 px-3 border rounded-md bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700"
                          aria-label="Chọn icon cho nhãn"
                        >
                          <span className="flex items-center gap-2">
                            {React.createElement(ICON_OPTIONS.find((i) => i.key === selectedLabelIcon)!.comp, { className: "h-4 w-4" })}
                          </span>
                          <span className="text-sm truncate">{ICON_OPTIONS.find((i) => i.key === selectedLabelIcon)!.label}</span>
                        </button>
                      </div>
                    </div>

                    {/* Label content */}
                    <div className="flex-1">
                      <Label className="text-sm block mb-1">Nội dung nhãn</Label>
                      <Input
                        value={labelContent}
                        onChange={(e) => setLabelContent(e.target.value)}
                        placeholder="Nhập nội dung nhãn..."
                        className="mt-2 w-full"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">Bật để thêm nhãn hiển thị trên CTA.</div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer row with Save / Cancel */}
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={() => { toast.info("Hủy (demo)."); }}>
            Hủy
          </Button>
          <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={handleSave}>
            Lưu
          </Button>
        </div>
      </div>

      {/* Icon picker dialog */}
      <Dialog open={iconDialogOpen} onOpenChange={(open) => setIconDialogOpen(open)}>
        <DialogContent className="max-w-sm w-full">
          <DialogHeader>
            <DialogTitle>Chọn icon</DialogTitle>
          </DialogHeader>

          <div className="p-3">
            <div className="grid grid-cols-3 gap-3">
              {ICON_OPTIONS.map((opt) => (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => handleSelectIcon(opt.key)}
                  className="flex flex-col items-center gap-2 p-3 border rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                  aria-label={`Chọn icon ${opt.label}`}
                >
                  {React.createElement(opt.comp, { className: "h-6 w-6" })}
                  <span className="text-xs">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIconDialogOpen(false)}>Đóng</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <MadeWithDyad />
    </Layout>
  );
};

export default QuickGiftCreate;