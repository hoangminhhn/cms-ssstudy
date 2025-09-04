"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const ClassPricing: React.FC = () => {
  const [price, setPrice] = React.useState("");
  const [promoPrice, setPromoPrice] = React.useState("");
  const [promoMode, setPromoMode] = React.useState<"specific" | "always">("specific");
  const [promoFrom, setPromoFrom] = React.useState("");
  const [promoTo, setPromoTo] = React.useState("");
  const [promoQty, setPromoQty] = React.useState<number>(0);
  const [note, setNote] = React.useState("");

  const diffPercent = React.useMemo(() => {
    const p = Number(price || 0);
    const pp = Number(promoPrice || 0);
    if (!p || p <= 0) return 0;
    const diff = Math.round(((p - pp) / p) * 100);
    return isFinite(diff) ? Math.max(0, diff) : 0;
  }, [price, promoPrice]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Giá và khuyến mãi</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-8 gap-4 items-center">
          <div className="md:col-span-1">
            <Label>Giá</Label>
            <Input value={price} onChange={(e) => setPrice(e.target.value)} />
          </div>

          <div className="md:col-span-1">
            <Label>Giá KM</Label>
            <Input value={promoPrice} onChange={(e) => setPromoPrice(e.target.value)} />
          </div>

          <div className="md:col-span-1">
            <Label>Chênh lệch</Label>
            <div className="mt-1 px-3 py-2 bg-gray-100 rounded text-center">{diffPercent}%</div>
          </div>

          <div className="md:col-span-2">
            <Label>Thời gian KM</Label>
            <Select value={promoMode} onValueChange={(v) => setPromoMode(v as any)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="specific">Khoảng thời gian cụ thể</SelectItem>
                <SelectItem value="always">Luôn luôn</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="md:col-span-2 grid grid-cols-2 gap-2">
            <div>
              <Label>Từ ngày</Label>
              <Input type="date" value={promoFrom} onChange={(e) => setPromoFrom(e.target.value)} disabled={promoMode !== "specific"} />
            </div>
            <div>
              <Label>Đến ngày</Label>
              <Input type="date" value={promoTo} onChange={(e) => setPromoTo(e.target.value)} disabled={promoMode !== "specific"} />
            </div>
          </div>

          <div className="md:col-span-1">
            <Label>Số lượng</Label>
            <Input type="number" value={String(promoQty)} onChange={(e) => setPromoQty(Number(e.target.value || 0))} />
          </div>

          <div className="md:col-span-8">
            <Label>Ghi chú khuyến mãi</Label>
            <Textarea value={note} onChange={(e) => setNote(e.target.value)} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClassPricing;