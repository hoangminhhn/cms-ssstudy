"use client";

import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import ExamPartManager from "@/components/ExamPartManager";

/**
 * EditExamFormCategory
 *
 * This component edits an exam category. It intentionally keeps all behavior
 * intact per requirements; only the options text for the "Cách hiển thị câu hỏi"
 * (questionDisplay) Select have been updated to Vietnamese:
 *  - "Lần lượt từng câu hỏi"
 *  - "Tất cả câu hỏi"
 *
 * All other functionality (loading mock data, save/cancel, scoring config,
 * exam part manager, navigation, toasts) remains unchanged.
 */

type Category = {
  id: string;
  name: string;
  displayMode: "all" | "per-part";
  questionDisplay: "one-per-screen" | "list";
  timeSetting: "per-part" | "total";
  useScoringConfig: boolean;
  percent1?: number;
  percent2?: number;
  percent3?: number;
  percent4?: number;
};

const mockCategoriesData: Category[] = [
  {
    id: "c1",
    name: "Kỳ thi thử cấp 1",
    displayMode: "all",
    questionDisplay: "one-per-screen",
    timeSetting: "total",
    useScoringConfig: false,
  },
  {
    id: "c2",
    name: "Kỳ thi chính thức",
    displayMode: "per-part",
    questionDisplay: "list",
    timeSetting: "per-part",
    useScoringConfig: true,
    percent1: 10,
    percent2: 20,
    percent3: 30,
    percent4: 40,
  },
];

const EditExamFormCategory: React.FC = () => {
  const navigate = useNavigate();
  const params = useParams();
  const location = useLocation();

  // load categoryId from params.id or ?categoryId=...
  const query = React.useMemo(() => new URLSearchParams(location.search), [location.search]);
  const categoryIdFromQuery = query.get("categoryId") ?? undefined;
  const categoryId = params?.id ?? categoryIdFromQuery;

  const [loading, setLoading] = useState<boolean>(true);
  const [category, setCategory] = useState<Category | null>(null);

  // form fields
  const [name, setName] = useState<string>("");
  const [displayMode, setDisplayMode] = useState<Category["displayMode"]>("all");
  const [questionDisplay, setQuestionDisplay] = useState<Category["questionDisplay"]>("one-per-screen");
  const [timeSetting, setTimeSetting] = useState<Category["timeSetting"]>("total");
  const [useScoringConfig, setUseScoringConfig] = useState<boolean>(false);
  const [percent1, setPercent1] = useState<number | "">("");
  const [percent2, setPercent2] = useState<number | "">("");
  const [percent3, setPercent3] = useState<number | "">("");
  const [percent4, setPercent4] = useState<number | "">("");

  useEffect(() => {
    // simulate load
    setLoading(true);
    const id = categoryId;
    if (!id) {
      toast.error("categoryId không được cung cấp.");
      navigate("/word-exam-upload?tab=exam-categories");
      return;
    }

    const found = mockCategoriesData.find((c) => c.id === id);
    if (!found) {
      toast.error("Không tìm thấy danh mục kỳ thi.");
      navigate("/word-exam-upload?tab=exam-categories");
      return;
    }

    setCategory(found);
    setName(found.name);
    setDisplayMode(found.displayMode);
    setQuestionDisplay(found.questionDisplay);
    setTimeSetting(found.timeSetting);
    setUseScoringConfig(Boolean(found.useScoringConfig));
    setPercent1(found.percent1 ?? "");
    setPercent2(found.percent2 ?? "");
    setPercent3(found.percent3 ?? "");
    setPercent4(found.percent4 ?? "");
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryId]);

  const handleSave = () => {
    // For now we mock saving: log + toast + navigate back.
    const payload = {
      id: category?.id,
      name,
      displayMode,
      questionDisplay,
      timeSetting,
      useScoringConfig,
      percent1: useScoringConfig ? percent1 : undefined,
      percent2: useScoringConfig ? percent2 : undefined,
      percent3: useScoringConfig ? percent3 : undefined,
      percent4: useScoringConfig ? percent4 : undefined,
    };
    // eslint-disable-next-line no-console
    console.log("Saving category:", payload);
    toast.success("Đã lưu danh mục kỳ thi.");
    navigate("/word-exam-upload?tab=exam-categories");
  };

  const handleCancel = () => {
    navigate("/word-exam-upload?tab=exam-categories");
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-muted-foreground">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Chỉnh sửa danh mục kỳ thi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Tên kỳ thi</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nhập tên kỳ thi" />
              </div>

              <div>
                <Label>Hình thức hiển thị phần thi</Label>
                <Select value={displayMode} onValueChange={(v) => setDisplayMode(v as Category["displayMode"])}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn hình thức" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Hiển thị toàn bộ</SelectItem>
                    <SelectItem value="per-part">Theo từng phần</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Cách hiển thị câu hỏi</Label>
                <Select value={questionDisplay} onValueChange={(v) => setQuestionDisplay(v as Category["questionDisplay"])}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn cách hiển thị" />
                  </SelectTrigger>
                  <SelectContent>
                    {/* Updated labels per request; values kept as before to preserve behavior */}
                    <SelectItem value="one-per-screen">Lần lượt từng câu hỏi</SelectItem>
                    <SelectItem value="list">Tất cả câu hỏi</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Cài đặt thời gian</Label>
                <Select value={timeSetting} onValueChange={(v) => setTimeSetting(v as Category["timeSetting"])}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn cài đặt thời gian" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="per-part">Theo từng phần</SelectItem>
                    <SelectItem value="total">Tổng thời gian</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-3">
                <Switch checked={useScoringConfig} onCheckedChange={(v) => setUseScoringConfig(Boolean(v))} />
                <Label>Sử dụng cấu hình thang điểm</Label>
              </div>

              {useScoringConfig && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <Label>Percent 1</Label>
                    <Input
                      type="number"
                      value={percent1 === "" ? "" : String(percent1)}
                      onChange={(e) => setPercent1(e.target.value === "" ? "" : Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label>Percent 2</Label>
                    <Input
                      type="number"
                      value={percent2 === "" ? "" : String(percent2)}
                      onChange={(e) => setPercent2(e.target.value === "" ? "" : Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label>Percent 3</Label>
                    <Input
                      type="number"
                      value={percent3 === "" ? "" : String(percent3)}
                      onChange={(e) => setPercent3(e.target.value === "" ? "" : Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label>Percent 4</Label>
                    <Input
                      type="number"
                      value={percent4 === "" ? "" : String(percent4)}
                      onChange={(e) => setPercent4(e.target.value === "" ? "" : Number(e.target.value))}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={handleCancel}>
              HỦY
            </Button>
            <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={handleSave}>
              LƯU
            </Button>
          </div>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Quản lý phần thi</CardTitle>
            </CardHeader>
            <CardContent>
              {/* ExamPartManager is kept as-is to preserve functionality */}
              <ExamPartManager />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EditExamFormCategory;