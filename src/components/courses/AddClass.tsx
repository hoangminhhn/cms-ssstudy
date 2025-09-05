"use client";

import React, { useRef, useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "lucide-react";
import { toast } from "sonner";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import CourseIncludes from "./CourseIncludes";
import Highlights from "./Highlights";
import OtherInfo from "./OtherInfo"; // NEW

const AddClass: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Thông tin chung
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const [classification, setClassification] = useState("Cả");
  const [room, setRoom] = useState("");
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState("");
  const [teacher, setTeacher] = useState("");
  const [featured, setFeatured] = useState(false);
  const [visible, setVisible] = useState(true);

  // Giá và khuyến mãi (mới)
  const [price, setPrice] = useState<string>("");
  const [promoPrice, setPromoPrice] = useState<string>("");
  const [differencePercent, setDifferencePercent] = useState<number>(0);
  const [promoTimeMode, setPromoTimeMode] = useState<string>("specific"); // 'specific' | 'always'
  const [promoFrom, setPromoFrom] = useState<string>("");
  const [promoTo, setPromoTo] = useState<string>("");
  const [promoQuantity, setPromoQuantity] = useState<number>(0);
  const [promoNote, setPromoNote] = useState<string>(""); // promo note

  // Học phí (other fields)
  const [feePerDay, setFeePerDay] = useState<string>("");
  const [fee1Month, setFee1Month] = useState<string>("");
  const [fee3Months, setFee3Months] = useState<string>("");
  const [fee6Months, setFee6Months] = useState<string>("");
  const [fee12Months, setFee12Months] = useState<string>("");
  const [expandedStudents, setExpandedStudents] = useState<number>(0);

  // Thông tin khác (moved to OtherInfo component)

  useEffect(() => {
    const p = Number(price || 0);
    const pp = Number(promoPrice || 0);
    if (!p || p <= 0) {
      setDifferencePercent(0);
      return;
    }
    const diff = Math.round(((p - pp) / p) * 100);
    setDifferencePercent(isFinite(diff) ? Math.max(0, diff) : 0);
  }, [price, promoPrice]);

  const onPickImage = () => {
    fileInputRef.current?.click();
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImagePreview(String(reader.result));
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    // For now just show a toast confirmation
    toast.success("Đã lưu thông tin lớp.");
    console.log({
      code,
      name,
      startDate,
      endDate,
      classification,
      room,
      subject,
      category,
      teacher,
      featured,
      visible,
      price,
      promoPrice,
    });
  };

  const handleCancel = () => {
    // Reset form (preserve other behaviors)
    setCode("");
    setName("");
    setStartDate("");
    setEndDate("");
    setClassification("Cả");
    setRoom("");
    setSubject("");
    setCategory("");
    setTeacher("");
    setFeatured(false);
    setVisible(true);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    toast.info("Đã hủy thay đổi.");
  };

  // short/full content states
  const [shortDescription, setShortDescription] = useState<string>("");
  const [fullContent, setFullContent] = useState<string>("");

  const quillModules = {
    toolbar: [
      [{ font: [] }, { size: [] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ align: [] }],
      ["link", "image", "video"],
      ["clean"],
    ],
  };

  const contentModules = {
    toolbar: [
      [{ font: [] }, { size: [] }],
      [{ header: [1, 2, 3, false] }],
      ["bold", "underline", "italic", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ align: [] }],
      ["link", "image", "video"],
      ["clean"],
    ],
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Thông tin chung</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
            <div className="col-span-1">
              <div className="border-2 border-dashed border-orange-300 rounded-md p-6 h-full flex flex-col items-center justify-center">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="max-h-44 object-contain rounded" />
                ) : (
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-40 h-28 border border-dashed border-orange-200 rounded flex items-center justify-center text-orange-400">
                      <span>Ảnh lớp</span>
                    </div>
                    <Button variant="outline" onClick={onPickImage} className="bg-white text-orange-600 border-orange-300 hover:bg-orange-50">
                      Thêm hình
                    </Button>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={onFileChange}
                  aria-label="Upload class image"
                />
              </div>
            </div>

            <div className="col-span-1 md:col-span-3">
              <div className="space-y-4">
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
                      <Input
                        id="start"
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                      />
                      <Calendar className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>

                  <div className="lg:col-span-2">
                    <Label htmlFor="end">Ngày bế giảng</Label>
                    <div className="relative">
                      <Input
                        id="end"
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                      />
                      <Calendar className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                  <div className="lg:col-span-2">
                    <Label htmlFor="classification">Phân loại</Label>
                    <Select value={classification} onValueChange={(val) => setClassification(val)}>
                      <SelectTrigger id="classification">
                        <SelectValue placeholder="Cả" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Cả">Cả</SelectItem>
                        <SelectItem value="Trực tuyến">Trực tuyến</SelectItem>
                        <SelectItem value="Trực tiếp">Trực tiếp</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="lg:col-span-2">
                    <Label htmlFor="room">Phòng học</Label>
                    <Input id="room" value={room} onChange={(e) => setRoom(e.target.value)} />
                  </div>

                  <div className="lg:col-span-3">
                    <Label htmlFor="subject">Môn học</Label>
                    <Select value={subject} onValueChange={setSubject}>
                      <SelectTrigger id="subject">
                        <SelectValue placeholder="-- Chọn môn học --" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Toán">Toán</SelectItem>
                        <SelectItem value="Văn">Văn</SelectItem>
                        <SelectItem value="Tiếng Anh">Tiếng Anh</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="lg:col-span-2">
                    <Label htmlFor="category">Danh mục</Label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger id="category">
                        <SelectValue placeholder="-- Chọn danh mục --" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Category A">Category A</SelectItem>
                        <SelectItem value="Category B">Category B</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="lg:col-span-2">
                    <Label htmlFor="teacher">Giáo viên</Label>
                    <Select value={teacher} onValueChange={setTeacher}>
                      <SelectTrigger id="teacher">
                        <SelectValue placeholder="-- Chọn giáo viên --" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="GV1">Giáo viên A</SelectItem>
                        <SelectItem value="GV2">Giáo viên B</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="lg:col-span-1 flex items-center gap-3">
                    <div>
                      <Label>Nổi bật</Label>
                      <div className="pt-2">
                        <Switch checked={featured} onCheckedChange={(v) => setFeatured(!!v)} />
                      </div>
                    </div>
                    <div>
                      <Label>Hiển thị</Label>
                      <div className="pt-2">
                        <Switch checked={visible} onCheckedChange={(v) => setVisible(!!v)} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Giá và khuyến mãi */}
      <Card>
        <CardHeader>
          <CardTitle>Giá và khuyến mãi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-8 gap-4 items-center">
            <div className="md:col-span-1">
              <Label htmlFor="price">Giá khóa học</Label>
              <Input
                id="price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Nhập giá"
              />
            </div>

            <div className="md:col-span-1">
              <Label htmlFor="promoPrice">Giá khuyến mãi</Label>
              <Input
                id="promoPrice"
                value={promoPrice}
                onChange={(e) => setPromoPrice(e.target.value)}
                placeholder="Nhập giá khuyến mãi"
              />
            </div>

            <div className="md:col-span-1">
              <Label>Chênh lệch</Label>
              <div className="mt-1">
                <div className="px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded text-center text-sm font-medium">
                  {differencePercent}% 
                </div>
              </div>
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="promoTimeMode">Chọn thời gian khuyến mãi</Label>
              <Select value={promoTimeMode} onValueChange={(v) => setPromoTimeMode(v)}>
                <SelectTrigger id="promoTimeMode">
                  <SelectValue placeholder="Khoảng thời gian" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="specific">Khoảng thời gian cụ thể</SelectItem>
                  <SelectItem value="always">Luôn luôn</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="md:col-span-2 grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="promoFrom">Từ ngày</Label>
                <Input
                  id="promoFrom"
                  type="date"
                  value={promoFrom}
                  onChange={(e) => setPromoFrom(e.target.value)}
                  disabled={promoTimeMode !== "specific"}
                />
              </div>
              <div>
                <Label htmlFor="promoTo">Đến ngày</Label>
                <Input
                  id="promoTo"
                  type="date"
                  value={promoTo}
                  onChange={(e) => setPromoTo(e.target.value)}
                  disabled={promoTimeMode !== "specific"}
                />
              </div>
            </div>

            <div className="md:col-span-1">
              <Label htmlFor="promoQuantity">Số lượng khuyến mãi</Label>
              <Input
                id="promoQuantity"
                type="number"
                value={String(promoQuantity)}
                onChange={(e) => setPromoQuantity(Number(e.target.value || 0))}
                min={0}
              />
            </div>

            <div className="md:col-span-3">
              <Label htmlFor="promoNote">Ghi chú khuyến mãi</Label>
              <Textarea
                id="promoNote"
                value={promoNote}
                onChange={(e) => setPromoNote(e.target.value)}
                placeholder="Nhập ghi chú cho khuyến mãi"
                className="mt-2 min-h-[80px]"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Học phí */}
      <Card>
        <CardHeader>
          <CardTitle>Học phí</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-6 items-center">
            <div className="md:col-span-1">
              <Label className="text-xs">THEO NGÀY</Label>
              <Input
                placeholder="Nhập theo ngày"
                value={feePerDay}
                onChange={(e) => setFeePerDay(e.target.value)}
                className="mt-2"
              />
            </div>

            <div>
              <Label className="text-xs">1 NGÀY/1 THÁNG</Label>
              <Input
                placeholder=""
                value={fee1Month}
                onChange={(e) => setFee1Month(e.target.value)}
                className="mt-2"
              />
            </div>

            <div>
              <Label className="text-xs">1 NGÀY/3 THÁNG</Label>
              <Input
                placeholder=""
                value={fee3Months}
                onChange={(e) => setFee3Months(e.target.value)}
                className="mt-2"
              />
            </div>

            <div>
              <Label className="text-xs">1 NGÀY/6 THÁNG</Label>
              <Input
                placeholder=""
                value={fee6Months}
                onChange={(e) => setFee6Months(e.target.value)}
                className="mt-2"
              />
            </div>

            <div>
              <Label className="text-xs">1 NGÀY/12 THÁNG</Label>
              <Input
                placeholder=""
                value={fee12Months}
                onChange={(e) => setFee12Months(e.target.value)}
                className="mt-2"
              />
            </div>

            <div className="md:col-span-1">
              <Label className="text-xs">SỐ HỌC SINH (MỞ RỘNG)</Label>
              <Input
                type="number"
                value={String(expandedStudents)}
                onChange={(e) => setExpandedStudents(Number(e.target.value || 0))}
                className="mt-2"
                min={0}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Short / Full descriptions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-orange-600">Mô tả ngắn</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md overflow-hidden">
            <ReactQuill
              value={shortDescription}
              onChange={setShortDescription}
              modules={{ toolbar: [["bold", "italic"], ["link", "image"]] }}
              placeholder="Nhập mô tả ngắn..."
              className="min-h-[220px] bg-white text-sm"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-orange-600">Nội dung chi tiết</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md overflow-hidden">
            <ReactQuill
              value={fullContent}
              onChange={setFullContent}
              modules={contentModules}
              placeholder="Nội dung chi tiết..."
              className="min-h-[420px] bg-white text-sm"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-orange-600">Thông tin nổi bật</CardTitle>
          </CardHeader>
          <CardContent>
            <Highlights />
          </CardContent>
        </Card>

        <div>
          <CourseIncludes />
        </div>
      </div>

      {/* NEW: OtherInfo is a separate component so editing it won't affect other cards */}
      <div>
        <OtherInfo />
      </div>

      <div className="flex justify-end gap-2 p-4 border-t bg-gray-50 dark:bg-gray-800">
        <Button variant="outline" onClick={handleCancel}>HỦY</Button>
        <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={handleSave}>LƯU</Button>
      </div>
    </div>
  );
};

export default AddClass;