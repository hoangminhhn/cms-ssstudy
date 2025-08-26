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
      shortDescription,
      fullContent,
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
    setShortDescription("");
    setFullContent("");

    if (fileInputRef.current) fileInputRef.current.value = "";
    toast.info("Đã hủy thay đổi.");
  };

  // -- New: Chapters feature states and helpers --
  const allChaptersMock = [
    { id: "c1", title: "Giới thiệu khóa học" },
    { id: "c2", title: "Chương 1: Cơ bản" },
    { id: "c3", title: "Chương 2: Trung cấp" },
    { id: "c4", title: "Chương 3: Nâng cao" },
    { id: "c5", title: "Tài liệu tham khảo" },
    { id: "c6", title: "Bài tập & Đáp án" },
    { id: "c7", title: "Phần mở rộng" },
  ];

  const [allChapters] = useState(allChaptersMock);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredChapters, setFilteredChapters] = useState(allChapters);
  const [selectedChapters, setSelectedChapters] = useState<typeof allChaptersMock>([]);

  useEffect(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) {
      setFilteredChapters(allChapters);
    } else {
      setFilteredChapters(
        allChapters.filter((ch) => ch.title.toLowerCase().includes(q))
      );
    }
  }, [searchTerm, allChapters]);

  const handleAddChapter = (chapter: { id: string; title: string }) => {
    if (selectedChapters.find((c) => c.id === chapter.id)) {
      toast.info("Chương đã có trong danh sách.");
      return;
    }
    setSelectedChapters((prev) => [...prev, chapter]);
    toast.success(`Đã thêm: ${chapter.title}`);
  };

  const handleRemoveChapter = (chapterId: string) => {
    setSelectedChapters((prev) => prev.filter((c) => c.id !== chapterId));
    toast.success("Đã xóa chương.");
  };

  const handleSearchClick = () => {
    // filtering happens automatically via useEffect; keep handler for potential analytics
    toast.success("Đã lọc chương.");
  };

  // -- End chapters feature --

  // -- Short description editor state and toolbar config --
  const [shortDescription, setShortDescription] = useState<string>("");

  const quillModules = {
    toolbar: [
      [{ font: [] }, { size: [] }],
      ["bold", "italic", "underline", "strike"],
      [{ script: "sub" }, { script: "super" }],
      [{ color: [] }, { background: [] }],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ indent: "-1" }, { indent: "+1" }],
      [{ align: [] }],
      ["blockquote", "code-block"],
      ["link", "image", "video"],
      ["clean"],
    ],
  };

  const quillFormats = [
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "script",
    "color",
    "background",
    "list",
    "bullet",
    "indent",
    "align",
    "blockquote",
    "code-block",
    "link",
    "image",
    "video",
  ];
  // -- End short description config --

  // -- Full content (Nội dung) editor state and toolbar (more complete) --
  const [fullContent, setFullContent] = useState<string>("");

  const contentModules = {
    toolbar: [
      [{ 'font': [] }, { 'size': [] }],
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'underline', 'italic', 'strike'],
      [{ 'script': 'sub' }, { 'script': 'super' }],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'align': [] }],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'indent': '-1' }, { 'indent': '+1' }],
      ['blockquote', 'code-block', 'formula'],
      ['link', 'image', 'video'],
      ['clean'],
    ],
  };

  const contentFormats = [
    'font', 'size', 'header',
    'bold', 'italic', 'underline', 'strike',
    'script', 'color', 'background',
    'align', 'list', 'bullet', 'indent',
    'blockquote', 'code-block', 'formula',
    'link', 'image', 'video'
  ];
  // -- End content config --

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

      <Card>
        <CardHeader>
          <CardTitle className="text-orange-600">Thông tin khác</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            <div className="md:col-span-1">
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

            <div className="md:col-span-1">
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

            <div className="md:col-span-1">
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

            <div className="md:col-span-3">
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

      {/* Feature panels */}
      <div className="space-y-4">
        <Card>
          <CardContent className="py-4 px-6">
            <div className="flex items-center gap-3">
              <div className="text-orange-600 font-medium text-lg">Sách đề xuất</div>
              <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white">
                THÊM SÁCH
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="py-4 px-6">
            <div className="flex items-center gap-3">
              <div className="text-orange-600 font-medium text-lg">Sách tặng kèm</div>
              <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white">
                THÊM SÁCH
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="py-4 px-6">
            <div className="flex items-center gap-3">
              <div className="text-orange-600 font-medium text-lg">Khóa học tặng kèm</div>
              <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white">
                THÊM KHÓA HỌC
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="py-4 px-6">
            <div className="flex items-center gap-3">
              <div className="text-orange-600 font-medium text-lg">Khóa học đề xuất</div>
              <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white">
                THÊM KHÓA HỌC
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chapters two-column panel (no separate title) */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left column: selected chapters */}
            <div className="border rounded-md p-4 bg-white dark:bg-gray-800 min-h-[180px]">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-orange-600 font-medium">Danh sách chương của khóa học</h3>
                <div className="text-sm text-muted-foreground">{selectedChapters.length} chương</div>
              </div>

              {selectedChapters.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  Chưa có chương nào. Hãy thêm từ bên phải.
                </div>
              ) : (
                <ul className="space-y-2">
                  {selectedChapters.map((ch) => (
                    <li key={ch.id} className="flex items-center justify-between rounded-md border px-3 py-2">
                      <div className="text-sm font-medium">{ch.title}</div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-red-600 hover:bg-red-50"
                          onClick={() => handleRemoveChapter(ch.id)}
                          aria-label={`Xóa ${ch.title}`}
                        >
                          Xóa
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Right column: all chapters with search */}
            <div className="border rounded-md p-4 bg-white dark:bg-gray-800 min-h-[180px]">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-orange-600 font-medium">Tất cả chương</h3>
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Tìm chương..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-64"
                    aria-label="Tìm chương"
                  />
                  <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white" onClick={handleSearchClick}>
                    Tìm kiếm
                  </Button>
                </div>
              </div>

              {filteredChapters.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">Không tìm thấy chương.</div>
              ) : (
                <ul className="space-y-2">
                  {filteredChapters.map((ch) => {
                    const already = selectedChapters.some((s) => s.id === ch.id);
                    return (
                      <li key={ch.id} className="flex items-center justify-between rounded-md border px-3 py-2">
                        <div className="text-sm">{ch.title}</div>
                        <div>
                          <Button
                            size="sm"
                            className={`px-3 py-1 ${already ? "bg-gray-200 text-gray-600" : "bg-green-500 hover:bg-green-600 text-white"}`}
                            onClick={() => handleAddChapter(ch)}
                            disabled={already}
                            aria-label={`Thêm ${ch.title}`}
                          >
                            {already ? "Đã thêm" : "Thêm"}
                          </Button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Short description panel (Mô tả ngắn) */}
      <Card>
        <CardHeader>
          <CardTitle className="text-orange-600">Mô tả ngắn</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md overflow-hidden">
            <ReactQuill
              value={shortDescription}
              onChange={setShortDescription}
              modules={quillModules}
              formats={quillFormats}
              placeholder="Nhập mô tả ngắn..."
              className="min-h-[220px] bg-white text-sm"
            />
          </div>
          <div className="text-sm text-muted-foreground mt-2">Mô tả ngắn sẽ hiển thị ở trang khóa học và giúp học viên nắm nhanh nội dung.</div>
        </CardContent>
      </Card>

      {/* New: Full content panel (Nội dung) */}
      <Card>
        <CardHeader>
          <CardTitle className="text-orange-600">Nội dung</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md overflow-hidden">
            <ReactQuill
              value={fullContent}
              onChange={setFullContent}
              modules={contentModules}
              formats={contentFormats}
              placeholder="Nhập nội dung chi tiết khóa học..."
              className="min-h-[420px] bg-white text-sm"
            />
          </div>
          <div className="text-sm text-muted-foreground mt-2">Nội dung chi tiết hỗ trợ định dạng nâng cao, chèn ảnh/video/công thức.</div>
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