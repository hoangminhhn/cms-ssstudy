"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

const ClassOtherInfo: React.FC = () => {
  const [mode, setMode] = React.useState<"Offline" | "Online">("Offline");
  const [shift, setShift] = React.useState<"Ca đơn" | "Ca đúp">("Ca đơn");
  const [autoDeduct, setAutoDeduct] = React.useState<"Tự động" | "Thủ công">("Thủ công");
  const [fbPage, setFbPage] = React.useState("");
  const [fbGroup, setFbGroup] = React.useState("");
  const [introVideo, setIntroVideo] = React.useState("");
  const [order, setOrder] = React.useState<number>(0);
  const [note, setNote] = React.useState("");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Thông tin khác</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-8 gap-4 items-center">
          <div className="md:col-span-2">
            <Label>Hình thức học</Label>
            <RadioGroup value={mode} onValueChange={(v) => setMode(v as any)} className="flex gap-3 mt-2">
              <label className="flex items-center gap-2">
                <RadioGroupItem value="Offline" /> Offline
              </label>
              <label className="flex items-center gap-2">
                <RadioGroupItem value="Online" /> Online
              </label>
            </RadioGroup>
          </div>

          <div className="md:col-span-2">
            <Label>Loại ca</Label>
            <RadioGroup value={shift} onValueChange={(v) => setShift(v as any)} className="flex gap-3 mt-2">
              <label className="flex items-center gap-2">
                <RadioGroupItem value="Ca đơn" /> Ca đơn
              </label>
              <label className="flex items-center gap-2">
                <RadioGroupItem value="Ca đúp" /> Ca đúp
              </label>
            </RadioGroup>
          </div>

          <div className="md:col-span-2">
            <Label>Tự động trừ buổi</Label>
            <RadioGroup value={autoDeduct} onValueChange={(v) => setAutoDeduct(v as any)} className="flex gap-3 mt-2">
              <label className="flex items-center gap-2">
                <RadioGroupItem value="Tự động" /> Tự động
              </label>
              <label className="flex items-center gap-2">
                <RadioGroupItem value="Thủ công" /> Thủ công
              </label>
            </RadioGroup>
          </div>

          <div className="md:col-span-2">
            <Label>Link FB Page</Label>
            <Input value={fbPage} onChange={(e) => setFbPage(e.target.value)} />
          </div>

          <div className="md:col-span-2">
            <Label>Link FB Group</Label>
            <Input value={fbGroup} onChange={(e) => setFbGroup(e.target.value)} />
          </div>

          <div className="md:col-span-4">
            <Label>Video giới thiệu</Label>
            <Input value={introVideo} onChange={(e) => setIntroVideo(e.target.value)} />
          </div>

          <div className="md:col-span-2">
            <Label>Thứ tự</Label>
            <Input type="number" value={String(order)} onChange={(e) => setOrder(Number(e.target.value || 0))} />
          </div>

          <div className="md:col-span-8">
            <Label>Ghi chú</Label>
            <Textarea value={note} onChange={(e) => setNote(e.target.value)} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClassOtherInfo;