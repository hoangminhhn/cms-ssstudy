"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const OtherInfo: React.FC = () => {
  const [studyMode, setStudyMode] = React.useState<"Offline" | "Online">("Offline");
  const [shiftType, setShiftType] = React.useState<"Ca đơn" | "Ca đúp">("Ca đơn");
  const [autoDeduct, setAutoDeduct] = React.useState<"Tự động" | "Thủ công">("Thủ công");
  const [fbPage, setFbPage] = React.useState<string>("");
  const [fbGroup, setFbGroup] = React.useState<string>("");
  const [introVideo, setIntroVideo] = React.useState<string>("");
  const [order, setOrder] = React.useState<number>(0);
  const [note, setNote] = React.useState<string>("");

  const handleSave = () => {
    // Demo save (local state only)
    console.log("OtherInfo saved", {
      studyMode,
      shiftType,
      autoDeduct,
      fbPage,
      fbGroup,
      introVideo,
      order,
      note,
    });
    toast.success("Đã lưu Thông tin khác (mô phỏng).");
  };

  const handleCancel = () => {
    // optional: reset fields
    setStudyMode("Offline");
    setShiftType("Ca đơn");
    setAutoDeduct("Thủ công");
    setFbPage("");
    setFbGroup("");
    setIntroVideo("");
    setOrder(0);
    setNote("");
    toast.info("Đã hủy thay đổi Thông tin khác.");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Thông tin khác</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-8 gap-4 items-center">
          <div className="md:col-span-1">
            <Label>Hình thức học</Label>
            <div className="mt-2">
              <RadioGroup value={studyMode} onValueChange={(v) => setStudyMode(v as "Offline" | "Online")}>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <RadioGroupItem value="Offline" id="mode-offline" />
                    <span>Offline</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <RadioGroupItem value="Online" id="mode-online" />
                    <span>Online</span>
                  </label>
                </div>
              </RadioGroup>
            </div>
          </div>

          <div className="md:col-span-1">
            <Label>Loại ca</Label>
            <div className="mt-2">
              <RadioGroup value={shiftType} onValueChange={(v) => setShiftType(v as "Ca đơn" | "Ca đúp")}>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <RadioGroupItem value="Ca đơn" id="shift-single" />
                    <span>Ca đơn</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <RadioGroupItem value="Ca đúp" id="shift-double" />
                    <span>Ca đúp</span>
                  </label>
                </div>
              </RadioGroup>
            </div>
          </div>

          <div className="md:col-span-1">
            <Label>Tự động trừ buổi</Label>
            <div className="mt-2">
              <RadioGroup value={autoDeduct} onValueChange={(v) => setAutoDeduct(v as "Tự động" | "Thủ công")}>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <RadioGroupItem value="Tự động" id="deduct-auto" />
                    <span>Tự động</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <RadioGroupItem value="Thủ công" id="deduct-manual" />
                    <span>Thủ công</span>
                  </label>
                </div>
              </RadioGroup>
            </div>
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="fbPage">Link Facebook Page</Label>
            <Input id="fbPage" value={fbPage} onChange={(e) => setFbPage(e.target.value)} placeholder="https://facebook.com/..." />
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="fbGroup">Link Facebook Group</Label>
            <Input id="fbGroup" value={fbGroup} onChange={(e) => setFbGroup(e.target.value)} placeholder="https://facebook.com/groups/..." />
          </div>

          <div className="md:col-span-1">
            <Label htmlFor="introVideo">Video giới thiệu khóa học</Label>
            <Input id="introVideo" value={introVideo} onChange={(e) => setIntroVideo(e.target.value)} placeholder="URL video (youtube/...)" />
          </div>

          <div className="md:col-span-1">
            <Label htmlFor="order">Thứ tự</Label>
            <Input id="order" type="number" value={String(order)} onChange={(e) => setOrder(Number(e.target.value || 0))} />
          </div>

          <div className="md:col-span-8 mt-2">
            <Label htmlFor="note">Ghi chú</Label>
            <Textarea id="note" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Nhập nội dung ghi chú" className="mt-2" />
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={handleCancel}>HỦY</Button>
          <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={handleSave}>LƯU</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default OtherInfo;