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

  // Giá và khuyến mãi
  const [price, setPrice] = useState<string>("");
  const [promoPrice, setPromoPrice] = useState<string>("");
  const [differencePercent, setDifferencePercent] = useState<number>(0);
  const [promoTimeMode, setPromoTimeMode] = useState<string>("specific"); // 'specific' | 'always'
  const [promoFrom, setPromoFrom] = useState<string>("");
  const [promoTo, setPromoTo] = useState<string>("");
  const [promoQuantity, setPromoQuantity] = useState<number>(0);

  // Học phí
  const [feePerDay, setFeePerDay] = useState<string>("");
  const [fee1Month, setFee1Month] = useState<string>("");
  const [fee3Months, setFee3Months] = useState<string>("");
  const [fee6Months, setFee6Months] = useState<string>("");
  const [fee12Months, setFee12Months] = useState<string>("");
  const [expandedStudents, setExpandedStudents] = useState<number>(0);

  // Thông tin khác
  const [studyMode, setStudyMode] = useState<"Offline" | "Online">("Offline");
  const [shiftType, setShiftType] = useState<"Ca đơn" | "Ca đúp">("Ca đơn");
  const [autoDeduct, setAutoDeduct] = useState<"Tự động" | "Thủ công">("Thủ công");
  const [fbPage, setFbPage] = useState<string>("");
  const [fbGroup, setFbGroup] = useState<string>("");
  const [introVideo, setIntroVideo] = useState<string>("");
  const [order, setOrder] = useState<number>(0);
  const [note, setNote] = useState<string>("");

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
      promoTimeMode,
      promoFrom,
      promoTo,
      promoQuantity,
      feePerDay,
      fee1Month,
      fee3Months,
      fee6Months,
      fee12Months,
      expandedStudents,
      studyMode,
      shiftType,
      autoDeduct,
      fbPage,
      fbGroup,
      introVideo,
      order,
      note,
    });
  };

  const handleCancel = () => {
    // Reset form
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

    // Reset promotion fields
    setPrice("");
    setPromoPrice("");
    setPromoFrom("");
    setPromoTo("");
    setPromoQuantity(0);
    setPromoTimeMode("specific");

    // Reset fees
    setFeePerDay("");
    setFee1Month("");
    setFee3Months("");
    setFee6Months("");
    setFee12Months("");
    setExpandedStudents(0);

    // Reset other info
    setStudyMode("Offline");
    setShiftType("Ca đơn");
    setAutoDeduct("Thủ công");
    setFbPage("");
    setFbGroup("");
    setIntroVideo("");
    setOrder(0);
    setNote("");

    if (fileInputRef.current) fileInputRef.current.value = "";
    toast.info("Đã hủy thay đổi.");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Thông tin chung</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Use 4 cols at md so image is narrower (1/4) and fields take 3/4 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
            {/* Column 1 - Image upload (1/4 width on md+) */}
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

            {/* Column 2 - Fields (3/4 width on md+) */}
            <div className="col-span-1 md:col-span-3">
              <div className="space-y-4">
                {/* Row 1 */}
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

                {/* Row 2 */}
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
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            <div className="md:col-span-2">
              <Label htmlFor="price" className="text-xs">GIÁ KHÓA HỌC</Label>
              <Input
                id="price"
                type="number"
                placeholder="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="mt-1"
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="promoPrice" className="text-xs">GIÁ KHUYẾN MÃI</Label>
              <Input
                id="promoPrice"
                type="number"
                placeholder="0"
                value={promoPrice}
                onChange={(e) => setPromoPrice(e.target.value)}
                className="mt-1"
              />
            </div>

            <div className="md:col-span-1 flex items-end">
              <div className="w-full">
                <Label className="text-xs">CHÊNH LỆCH</Label>
                <div className="mt-1 rounded-md bg-gray-50 text-orange-600 border border-gray-200 px-3 py-2 text-sm text-center">
                  {differencePercent}% 
                </div>
              </div>
            </div>

            <div className="md:col-span-2">
              <Label className="text-xs">CHỌN THỜI GIAN KHUYẾN MÃI</Label>
              <Select value={promoTimeMode} onValueChange={(val) => setPromoTimeMode(val)}>
                <SelectTrigger className="w-full h-9 mt-1">
                  <SelectValue placeholder="Khoảng thời" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="specific">Khoảng thời gian</SelectItem>
                  <SelectItem value="always">Luôn luôn</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Date range inputs: show only when specific */}
            {promoTimeMode === "specific" && (
              <>
                <div className="md:col-span-2">
                  <Label className="text-xs">Từ ngày</Label>
                  <div className="relative mt-1">
                    <Input type="date" value={promoFrom} onChange={(e) => setPromoFrom(e.target.value)} />
                    <Calendar className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
                <div className="md:col-span-2">
                  <Label className="text-xs">Đến ngày</Label>
                  <div className="relative mt-1">
                    <Input type="date" value={promoTo} onChange={(e) => setPromoTo(e.target.value)} />
                    <Calendar className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              </>
            )}

            <div className={`md:col-span-${promoTimeMode === "specific" ? "1" : "2"}`}>
              <Label className="text-xs">SỐ LƯỢNG KHUYẾN MÃI</Label>
              <Input
                type="number"
                value={String(promoQuantity)}
                onChange={(e) => setPromoQuantity(Number(e.target.value || 0))}
                className="mt-1"
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
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
            <div className="col-span-1">
              <Label className="text-xs">THEO NGÀY</Label>
              <Input
                type="number"
                placeholder=""
                value={feePerDay}
                onChange={(e) => setFeePerDay(e.target.value)}
                className="mt-1"
                aria-label="Học phí theo ngày"
              />
            </div>
            <div className="col-span-1">
              <Label className="text-xs">1 NGÀY/1 THÁNG</Label>
              <Input
                type="number"
                placeholder=""
                value={fee1Month}
                onChange={(e) => setFee1Month(e.target.value)}
                className="mt-1"
                aria-label="Học phí 1 ngày/1 tháng"
              />
            </div>
            <div className="col-span-1">
              <Label className="text-xs">1 NGÀY/3 THÁNG</Label>
              <Input
                type="number"
                placeholder=""
                value={fee3Months}
                onChange={(e) => setFee3Months(e.target.value)}
                className="mt-1"
                aria-label="Học phí 1 ngày/3 tháng"
              />
            </div>
            <div className="col-span-1">
              <Label className="text-xs">1 NGÀY/6 THÁNG</Label>
              <Input
                type="number"
                placeholder=""
                value={fee6Months}
                onChange={(e) => setFee6Months(e.target.value)}
                className="mt-1"
                aria-label="Học phí 1 ngày/6 tháng"
              />
            </div>
            <div className="col-span-1">
              <Label className="text-xs">1 NGÀY/12 THÁNG</Label>
              <Input
                type="number"
                placeholder=""
                value={fee12Months}
                onChange={(e) => setFee12Months(e.target.value)}
                className="mt-1"
                aria-label="Học phí 1 ngày/12 tháng"
              />
            </div>
            <div className="col-span-1">
              <Label className="text-xs">SỐ HỌC SINH (MỞ RỘNG)</Label>
              <Input
                type="number"
                placeholder="0"
                value={String(expandedStudents)}
                onChange={(e) => setExpandedStudents(Number(e.target.value || 0))}
                className="mt-1"
                aria-label="Số học sinh mở rộng"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Thông tin khác */}
      <Card>
        <CardHeader>
          <CardTitle className="text-orange-600">Thông tin khác</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            <div className="md:col-span-2">
              <Label className="text-xs">HÌNH THỨC HỌC</Label>
              <RadioGroup value={studyMode} onValueChange={(val) => setStudyMode(val as "Offline" | "Online")} className="flex flex-col space-y-2 mt-1">
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="Offline" id="study-offline" />
                  <Label htmlFor="study-offline" className="cursor-pointer">Offline</Label>
                </div>
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="Online" id="study-online" />
                  <Label htmlFor="study-online" className="cursor-pointer">Online</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="md:col-span-2">
              <Label className="text-xs">LOẠI CA</Label>
              <RadioGroup value={shiftType} onValueChange={(val) => setShiftType(val as "Ca đơn" | "Ca đúp")} className="flex flex-col space-y-2 mt-1">
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="Ca đơn" id="shift-single" />
                  <Label htmlFor="shift-single" className="cursor-pointer">Ca đơn</Label>
                </div>
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="Ca đúp" id="shift-double" />
                  <Label htmlFor="shift-double" className="cursor-pointer">Ca đúp</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="md:col-span-2">
              <Label className="text-xs">TỰ ĐỘNG TRỪ BUỔI</Label>
              <RadioGroup value={autoDeduct} onValueChange={(val) => setAutoDeduct(val as "Tự động" | "Thủ công")} className="flex flex-col space-y-2 mt-1">
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="Tự động" id="deduct-auto" />
                  <Label htmlFor="deduct-auto" className="cursor-pointer">Tự động</Label>
                </div>
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="Thủ công" id="deduct-manual" />
                  <Label htmlFor="deduct-manual" className="cursor-pointer">Thủ công</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="md:col-span-2">
              <Label className="text-xs">LINK FACEBOOK PAGE</Label>
              <Input value={fbPage} onChange={(e) => setFbPage(e.target.value)} placeholder="https://facebook.com/..." className="mt-1" />
            </div>

            <div className="md:col-span-2">
              <Label className="text-xs">LINK FACEBOOK GROUP</Label>
              <Input value={fbGroup} onChange={(e) => setFbGroup(e.target.value)} placeholder="https://facebook.com/groups/..." className="mt-1" />
            </div>

            <div className="md:col-span-1">
              <Label className="text-xs">VIDEO GIỚI THIỆU KHÓA HỌC</Label>
              <Input value={introVideo} onChange={(e) => setIntroVideo(e.target.value)} placeholder="Link video..." className="mt-1" />
            </div>

            <div className="md:col-span-1">
              <Label className="text-xs">THỨ TỰ</Label>
              <Input type="number" value={String(order)} onChange={(e) => setOrder(Number(e.target.value || 0))} className="mt-1" />
            </div>

            <div className="md:col-span-12">
              <Label className="text-xs">GHI CHÚ</Label>
              <Textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Nhập nội dung ghi chú" className="mt-1 min-h-[80px]" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Footer buttons placed outside the Card */}
      <div className="flex justify-end gap-2 p-4 border-t bg-gray-50 dark:bg-gray-800">
        <Button variant="outline" onClick={handleCancel}>HỦY</Button>
        <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={handleSave}>LƯU</Button>
      </div>
    </div>
  );
};

export default AddClass;