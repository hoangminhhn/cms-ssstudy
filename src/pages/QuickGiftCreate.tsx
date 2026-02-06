"use client";

import React from "react";
import Layout from "@/components/Layout";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

const EXAM_PERIODS = [
  "Kỳ thi HSA",
  "Kỳ thi TSA",
  "Kỳ thi Tốt Nghiệp",
  "Kỳ thi V-ACT",
];

const QuickGiftCreate: React.FC = () => {
  const [examPeriod, setExamPeriod] = React.useState<string>(EXAM_PERIODS[0]);
  const [ctaText, setCtaText] = React.useState<string>("Nhận lì xì");
  const [destinationUrl, setDestinationUrl] = React.useState<string>("");

  return (
    <Layout headerTitle="Tạo quà tặng mới">
      <div className="max-w-5xl mx-auto w-full p-6">
        <Card>
          <CardHeader>
            <CardTitle>Thông tin nhanh</CardTitle>
          </CardHeader>

          <CardContent>
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
                <Input
                  id="cta-text"
                  value={ctaText}
                  onChange={(e) => setCtaText(e.target.value)}
                  placeholder="Nhận lì xì"
                  className="mt-2"
                />
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
          </CardContent>
        </Card>

        {/* Placeholder area for the rest of the page — you can describe additional fields below */}
        <div className="mt-6 min-h-[240px] border-dashed border rounded-md flex items-center justify-center bg-white dark:bg-gray-800">
          <div className="text-center p-6">
            <h2 className="text-lg font-semibold mb-2">Trang trống</h2>
            <p className="text-sm text-muted-foreground">
              Hàng đầu tiên đã được tạo. Hãy mô tả phần nội dung tiếp theo bạn muốn thêm.
            </p>
          </div>
        </div>
      </div>

      <MadeWithDyad />
    </Layout>
  );
};

export default QuickGiftCreate;