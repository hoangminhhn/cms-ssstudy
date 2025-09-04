"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";

const ClassGeneralInfo: React.FC = () => {
  const [code, setCode] = React.useState("");
  const [name, setName] = React.useState("");
  const [startDate, setStartDate] = React.useState<string>("");
  const [endDate, setEndDate] = React.useState<string>("");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Thông tin chung</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
          <div className="lg:col-span-2">
            <Label htmlFor="code">Mã khóa học</Label>
            <Input id="code" value={code} onChange={(e) => setCode(e.target.value)} />
          </div>

          <div className="lg:col-span-6">
            <Label htmlFor="name">Tên khóa học</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div className="lg:col-span-2">
            <Label htmlFor="start">Ngày khai giảng</Label>
            <div className="relative">
              <Input id="start" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
              <Calendar className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
            </div>
          </div>

          <div className="lg:col-span-2">
            <Label htmlFor="end">Ngày bế giảng</Label>
            <div className="relative">
              <Input id="end" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
              <Calendar className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
            </div>
          </div>

          <div className="lg:col-span-12 flex items-center justify-end mt-4">
            <Button variant="outline">Reset</Button>
            <Button className="bg-orange-500 hover:bg-orange-600 text-white ml-2">Update</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClassGeneralInfo;