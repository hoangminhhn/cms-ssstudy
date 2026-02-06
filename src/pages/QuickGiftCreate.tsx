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
import { Tag, FileText, BookOpen, ImagePlus, Trash2 } from "lucide-react";
import { toast } from "sonner";

const EXAM_PERIODS = [
  "Kỳ thi HSA",
  "Kỳ thi TSA",
  "Kỳ thi Tốt Nghiệp",
  "Kỳ thi V-ACT",
];

// Small component shown when 'Không' is selected
const NoneIcon: React.FC = () => <span className="text-xs text-muted-foreground">Không</span>;

type IconKey = "None" | "Tag" | "FileText" | "BookOpen";

const ICON_OPTIONS: { key: IconKey; label: string; comp: React.ComponentType<any> }[] = [
  { key: "None", label: "Không", comp: NoneIcon },
  { key: "Tag", label: "Tag", comp: Tag },
  { key: "FileText", label: "File", comp: FileText },
  { key: "BookOpen", label: "Sách", comp: BookOpen },
];

type RewardRule = {
  id: string;
  min: number;
  max: number;
  reward: string;
  active: boolean;
  banner?: string | null; // data URL preview for the rule banner
};

const QuickGiftCreate: React.FC = () => {
  const [examPeriod, setExamPeriod] = React.useState<string>(EXAM_PERIODS[0]);
  const [ctaText, setCtaText] = React.useState<string>("Nhận lì xì");
  const [destinationUrl, setDestinationUrl] = React.useState<string>("");

  // Banner for whole gift (page-level)
  const bannerRef = React.useRef<HTMLInputElement | null>(null);
  const [bannerPreview, setBannerPreview] = React.useState<string | null>(null);

  // Label fields
  const [hasLabel, setHasLabel] = React.useState<boolean>(false);
  const [selectedLabelIcon, setSelectedLabelIcon] = React.useState<IconKey>("None");
  const [labelContent, setLabelContent] = React.useState<string>("");

  // CTA icon
  const [selectedCtaIcon, setSelectedCtaIcon] = React.useState<IconKey>("None");

  // Dialog state for icon picker: target can be 'cta' or 'label'
  const [iconDialogOpen, setIconDialogOpen] = React.useState<boolean>(false);
  const [iconDialogTarget, setIconDialogTarget] = React.useState<"cta" | "label">("label");

  // Status switch in header
  const [statusEnabled, setStatusEnabled] = React.useState<boolean>(true);

  // Reward rules
  const [rules, setRules] = React.useState<RewardRule[]>([]);
  const [minInput, setMinInput] = React.useState<string>("");
  const [maxInput, setMaxInput] = React.useState<string>("");
  const [rewardInput, setRewardInput] = React.useState<string>("");
  const [editingId, setEditingId] = React.useState<string | null>(null);

  // Per-rule banner temp storage for add/edit row
  const ruleBannerRef = React.useRef<HTMLInputElement | null>(null);
  const [ruleBannerPreview, setRuleBannerPreview] = React.useState<string | null>(null);

  const resetRuleInputs = () => {
    setMinInput("");
    setMaxInput("");
    setRewardInput("");
    setEditingId(null);
    setRuleBannerPreview(null);
    if (ruleBannerRef.current) ruleBannerRef.current.value = "";
  };

  const handleOpenIconDialog = (target: "cta" | "label") => {
    setIconDialogTarget(target);
    setIconDialogOpen(true);
  };

  const handleSelectIcon = (key: IconKey) => {
    if (iconDialogTarget === "cta") {
      setSelectedCtaIcon(key);
      toast.success(key === "None" ? "Đã chọn: Không dùng icon cho CTA" : "Đã chọn icon cho CTA (demo).");
    } else {
      setSelectedLabelIcon(key);
      toast.success(key === "None" ? "Đã chọn: Không dùng icon cho nhãn" : "Đã chọn icon cho nhãn (demo).");
    }
    setIconDialogOpen(false);
  };

  // Banner handlers (page-level)
  const onPickBanner = () => bannerRef.current?.click();
  const onBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => setBannerPreview(String(reader.result));
    reader.readAsDataURL(f);
  };
  const removeBanner = () => {
    setBannerPreview(null);
    if (bannerRef.current) bannerRef.current.value = "";
  };

  // Per-rule banner handlers
  const onPickRuleBanner = () => ruleBannerRef.current?.click();
  const onRuleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => setRuleBannerPreview(String(reader.result));
    reader.readAsDataURL(f);
  };
  const removeRuleBannerTemp = () => {
    setRuleBannerPreview(null);
    if (ruleBannerRef.current) ruleBannerRef.current.value = "";
  };

  const handleAddOrUpdateRule = () => {
    const min = Number(minInput);
    const max = Number(maxInput);
    const reward = rewardInput.trim();

    if (!Number.isFinite(min) || !Number.isFinite(max)) {
      toast.error("Từ và Đến phải là số hợp lệ.");
      return;
    }
    if (min < 0 || max < 0) {
      toast.error("Giá trị phải >= 0.");
      return;
    }
    if (min > max) {
      toast.error("Từ không được lớn hơn Đến.");
      return;
    }
    if (!reward) {
      toast.error("Vui lòng nhập phần thưởng.");
      return;
    }

    if (editingId) {
      setRules((prev) =>
        prev.map((r) =>
          r.id === editingId ? { ...r, min, max, reward, banner: ruleBannerPreview ?? r.banner ?? null } : r,
        ),
      );
      toast.success("Đã cập nhật quy tắc.");
    } else {
      const overlap = rules.some((r) => !(max < r.min || min > r.max));
      if (overlap) {
        toast.info("Lưu quy tắc; lưu ý có trùng khoảng điểm với quy tắc khác.");
      }
      const newRule: RewardRule = {
        id: `rule-${Date.now()}`,
        min,
        max,
        reward,
        active: true,
        banner: ruleBannerPreview ?? null,
      };
      setRules((prev) => [...prev, newRule].sort((a, b) => a.min - b.min));
      toast.success("Đã thêm quy tắc.");
    }

    resetRuleInputs();
  };

  const handleEditRule = (id: string) => {
    const r = rules.find((x) => x.id === id);
    if (!r) return;
    setEditingId(id);
    setMinInput(String(r.min));
    setMaxInput(String(r.max));
    setRewardInput(r.reward);
    setRuleBannerPreview(r.banner ?? null);
  };

  const handleDeleteRule = (id: string) => {
    if (!confirm("Bạn có chắc muốn xóa quy tắc này?")) return;
    setRules((prev) => prev.filter((r) => r.id !== id));
    toast.success("Đã xóa quy tắc.");
  };

  const toggleRuleActive = (id: string) => {
    setRules((prev) => prev.map((r) => (r.id === id ? { ...r, active: !r.active } : r)));
  };

  // Remove banner attached to an existing rule
  const removeRuleBanner = (id: string) => {
    setRules((prev) => prev.map((r) => (r.id === id ? { ...r, banner: null } : r)));
    toast.success("Đã xóa banner của quy tắc.");
  };

  const handleSave = () => {
    const payload = {
      examPeriod,
      ctaText,
      destinationUrl,
      banner: !!bannerPreview,
      ctaIcon: selectedCtaIcon === "None" ? null : selectedCtaIcon,
      hasLabel,
      labelIcon: selectedLabelIcon === "None" ? null : selectedLabelIcon,
      labelContent,
      statusEnabled,
      rules,
    };
    console.log("Saving quick gift (demo) payload:", payload);
    toast.success("Đã lưu (demo).");
  };

  return (
    <Layout headerTitle="Tạo quà tặng mới">
      <div className="max-w-5xl mx-auto w-full p-6 space-y-6">
        <Card>
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

            {/* Banner upload (page-level) */}
            <div>
              <Label className="text-sm">Banner (toàn quà tặng)</Label>
              <div className="mt-2 flex items-center gap-3">
                <input ref={bannerRef} type="file" accept="image/*" className="hidden" onChange={onBannerChange} />
                <div
                  className="h-24 w-64 rounded border-dashed border-2 border-gray-200 dark:border-gray-700 flex items-center justify-center cursor-pointer bg-gray-50 dark:bg-gray-900"
                  onClick={onPickBanner}
                  role="button"
                >
                  {bannerPreview ? (
                    // eslint-disable-next-line jsx-a11y/img-redundant-alt
                    <img src={bannerPreview} alt="banner preview" className="h-full object-contain" />
                  ) : (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <ImagePlus className="h-5 w-5" /> Chọn banner
                    </div>
                  )}
                </div>

                {bannerPreview && (
                  <div className="flex flex-col gap-2">
                    <Button variant="outline" onClick={() => removeBanner()} className="flex items-center gap-2">
                      <Trash2 className="h-4 w-4" /> Xóa
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center gap-3">
                <Switch checked={hasLabel} onCheckedChange={(v) => setHasLabel(!!v)} />
                <Label className="mb-0">Nhãn làm bài tập</Label>
              </div>

              {/* When enabled show icon selector + content input */}
              <div>
                {hasLabel ? (
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
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

        {/* Reward rules with per-rule banner */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between w-full">
              <div>
                <CardTitle className="m-0 text-lg">Quy tắc thưởng theo điểm</CardTitle>
                <div className="text-sm text-muted-foreground">Định nghĩa phần thưởng theo khoảng điểm</div>
              </div>
              <div className="text-sm text-muted-foreground">Quản lý quy tắc</div>
            </div>
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 items-end">
              {/* Reward first */}
              <div className="sm:col-span-2">
                <Label className="text-xs">Phần thưởng</Label>
                <Input value={rewardInput} onChange={(e) => setRewardInput(e.target.value)} placeholder="Ví dụ: Voucher 50k" />
              </div>

              <div>
                <Label className="text-xs">Từ</Label>
                <Input value={minInput} onChange={(e) => setMinInput(e.target.value)} placeholder="0" />
              </div>

              <div>
                <Label className="text-xs">Đến</Label>
                <Input value={maxInput} onChange={(e) => setMaxInput(e.target.value)} placeholder="100" />
              </div>

              {/* rule banner upload in inputs row */}
              <div>
                <Label className="text-xs">Banner quy tắc</Label>
                <div className="mt-2 flex items-center gap-2">
                  <input ref={ruleBannerRef} type="file" accept="image/*" className="hidden" onChange={onRuleBannerChange} />
                  <button
                    type="button"
                    onClick={onPickRuleBanner}
                    className="h-10 w-10 rounded-md border bg-white dark:bg-gray-800 flex items-center justify-center hover:bg-gray-50"
                    title="Chọn banner cho quy tắc"
                    aria-label="Chọn banner cho quy tắc"
                  >
                    <ImagePlus className="h-4 w-4" />
                  </button>
                  {ruleBannerPreview && (
                    <div className="h-10 w-20 border rounded overflow-hidden">
                      {/* eslint-disable-next-line jsx-a11y/img-redundant-alt */}
                      <img src={ruleBannerPreview} alt="rule banner preview" className="h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>

              <div className="sm:col-span-5 flex gap-2 mt-2">
                <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={handleAddOrUpdateRule}>
                  {editingId ? "Cập nhật" : "Thêm quy tắc"}
                </Button>
              </div>
            </div>

            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="text-sm text-orange-600 border-b">
                    <th className="p-3">Phần thưởng</th>
                    <th className="p-3">Banner</th>
                    <th className="p-3 w-[140px]">Khoảng điểm</th>
                    <th className="p-3 text-center w-[90px]">Kích hoạt</th>
                    <th className="p-3 text-right w-[160px]">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {rules.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-muted-foreground">Chưa có quy tắc nào.</td>
                    </tr>
                  ) : (
                    rules.map((r) => (
                      <tr key={r.id} className="hover:bg-gray-50">
                        <td className="p-3 font-medium">{r.reward}</td>

                        <td className="p-3">
                          {r.banner ? (
                            <div className="flex items-center gap-2">
                              <div className="h-10 w-24 overflow-hidden rounded border">
                                {/* eslint-disable-next-line jsx-a11y/img-redundant-alt */}
                                <img src={r.banner} alt="rule banner" className="h-full object-cover" />
                              </div>
                              <div className="flex flex-col gap-1">
                                <button
                                  className="text-xs text-muted-foreground hover:underline"
                                  onClick={() => {
                                    // set this rule into edit mode with its banner loaded
                                    handleEditRule(r.id);
                                    setRuleBannerPreview(r.banner ?? null);
                                  }}
                                >
                                  Thay đổi
                                </button>
                                <button className="text-xs text-red-600" onClick={() => removeRuleBanner(r.id)}>
                                  Xóa banner
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="text-xs text-muted-foreground">Chưa có</div>
                          )}
                        </td>

                        <td className="p-3">{r.min} - {r.max}</td>
                        <td className="p-3 text-center">
                          <Switch checked={r.active} onCheckedChange={() => toggleRuleActive(r.id)} />
                        </td>
                        <td className="p-3 text-right">
                          <div className="inline-flex gap-2">
                            <Button variant="ghost" onClick={() => handleEditRule(r.id)}>Sửa</Button>
                            <Button variant="ghost" className="text-red-600" onClick={() => handleDeleteRule(r.id)}>Xóa</Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
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
    </Layout>
  );
};

export default QuickGiftCreate;