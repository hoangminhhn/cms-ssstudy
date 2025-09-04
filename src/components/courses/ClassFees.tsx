"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const ClassFees: React.FC = () => {
  const [perDay, setPerDay] = React.useState("");
  const [oneMonth, setOneMonth] = React.useState("");
  const [threeMonths, setThreeMonths] = React.useState("");
  const [sixMonths, setSixMonths] = React.useState("");
  const [twelveMonths, setTwelveMonths] = React.useState("");
  const [capacity, setCapacity] = React.useState<number | "">(0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Học phí</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <div>
            <Label>Theo ngày</Label>
            <Input value={perDay} onChange={(e) => setPerDay(e.target.value)} />
          </div>
          <div>
            <Label>1 tháng</Label>
            <Input value={oneMonth} onChange={(e) => setOneMonth(e.target.value)} />
          </div>
          <div>
            <Label>3 tháng</Label>
            <Input value={threeMonths} onChange={(e) => setThreeMonths(e.target.value)} />
          </div>
          <div>
            <Label>6 tháng</Label>
            <Input value={sixMonths} onChange={(e) => setSixMonths(e.target.value)} />
          </div>
          <div>
            <Label>12 tháng</Label>
            <Input value={twelveMonths} onChange={(e) => setTwelveMonths(e.target.value)} />
          </div>
          <div>
            <Label>Số học sinh</Label>
            <Input type="number" value={String(capacity)} onChange={(e) => setCapacity(Number(e.target.value || 0))} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClassFees;