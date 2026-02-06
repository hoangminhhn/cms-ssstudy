"use client";

import React from "react";
import Layout from "@/components/Layout";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const examPeriods = [
  "Kỳ thi HSA",
  "Kỳ thi TSA",
  "Kỳ thi Tốt Nghiệp",
  "Kỳ thi V-ACT",
];

const QuickGiftCreate: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = React.useState("");
  const [period, setPeriod] = React.useState<string>(examPeriods[0]);
  const [active, setActive] = React.useState<boolean>(true);

  const handleSave = () => {
    const trimmed = name.trim();
    if (!trimmed) {
      toast.error("Vui lòng nhập tên quà tặng.");
      return;
    }

    // Demo payload - in a real app you'd POST to API
    const payload = {
      id: `G-${Date.now()}`,
      name: trimmed,
      period,
      status: active ? "Đang hoạt động" : "Đã tắt",
      createdAt: new Date().toLocaleDateString(),
    };

    console.log("Create quick gift (demo):", payload);
    toast.success("Đã tạo quà tặng (demo).");
    // go back to list view under WordExamUpload module where QuickGifts lives
    navigate("/word-exam-upload?tab=quick-gifts");
  };

  return (
    <Layout headerTitle="Tạo quà tặng mới">
      <div className="max-w-3xl mx-auto w-full">
        <Card>
          <CardHeader>
            <CardTitle>Thông tin quà tặng</CardTitle>
          </CardHeader>

          <CardContent className="grid gap-4">
            <div>
              <Label htmlFor="gift-name">Tên quà tặng</Label>
              <Input id="gift-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ví dụ: Voucher 50%" />
            </div>

            <div>
              <Label htmlFor="gift-period">Kỳ thi áp dụng</Label>
              <Select value={period} onValueChange={(v) => setPeriod(v)}>
                <SelectTrigger id="gift-period">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {examPeriods.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-4">
              <div>
                <Label>Trạng thái</Label>
                <div className="mt-2">
                  <Switch checked={active} onCheckedChange={(v) => setActive(!!v)} />
                </div>
              </div>
              <div className="text-sm text-muted-foreground">Bật = Đang hoạt động, Tắt = Đã tắt</div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => navigate(-1)}>Hủy</Button>
              <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={handleSave}>Lưu</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <MadeWithDyad />
    </Layout>
  );
};

export default QuickGiftCreate;