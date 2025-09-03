"use client";

import React, { useRef, useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Calendar, Check } from "lucide-react";
import { toast } from "sonner";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import SortableJS from "sortablejs";
import CourseIncludes from "./CourseIncludes";

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

  // Short description & full content (ensure declared)
  const [shortDescription, setShortDescription] = useState<string>("");
  const [fullContent, setFullContent] = useState<string>("");

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
    setHighlights([]);

    if (fileInputRef.current) fileInputRef.current.value = "";
    toast.info("Đã hủy thay đổi.");
  };

  // -- Chapters feature states and helpers --
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

  // -- Highlights (Thông tin nổi bật) feature --
  interface HighlightItem {
    id: string;
    text: string;
  }

  const [highlights, setHighlights] = useState<HighlightItem[]>([]);
  const [newHighlightText, setNewHighlightText] = useState("");
  const highlightsListRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!highlightsListRef.current) return;

    const sortable = SortableJS.create(highlightsListRef.current, {
      animation: 150,
      handle: ".drag-handle",
      onEnd: (evt) => {
        if (evt.oldIndex === undefined || evt.newIndex === undefined) return;
        setHighlights((prev) => {
          const items = [...prev];
          const [moved] = items.splice(evt.oldIndex, 1);
          items.splice(evt.newIndex, 0, moved);
          return items;
        });
      },
    });

    return () => sortable.destroy();
  }, [highlightsListRef.current]);

  const handleAddHighlight = () => {
    const text = newHighlightText.trim();
    if (!text) {
      toast.error("Vui lòng nhập nội dung nổi bật.");
      return;
    }
    const id = `h-${Date.now()}`;
    setHighlights((prev) => [...prev, { id, text }]);
    setNewHighlightText("");
    toast.success("Đã thêm thông tin nổi bật.");
  };

  const handleDeleteHighlight = (id: string) => {
    setHighlights((prev) => prev.filter((h) => h.id !== id));
    toast.success("Đã xóa thông tin nổi bật.");
  };

  // Small helper for keyboard add (Enter)
  const onHighlightKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddHighlight();
    }
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
          </div>
        </CardContent>
      </Card>

      {/* Học phí */}
      <Card>
        <CardHeader>
          <CardTitle>Học phí</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-6 gap-4 items-end">
            <div>
              <Label className="text-xs font-medium text-muted-foreground uppercase">THEO NGÀY</Label>
              <Input
                placeholder=""
                value={feePerDay}
                onChange={(e) => setFeePerDay(e.target.value)}
              />
            </div>

            <div>
              <Label className="text-xs font-medium text-muted-foreground uppercase">1 NGÀY/1 THÁNG</Label>
              <Input
                placeholder=""
                value={fee1Month}
                onChange={(e) => setFee1Month(e.target.value)}
              />
            </div>

            <div>
              <Label className="text-xs font-medium text-muted-foreground uppercase">1 NGÀY/3 THÁNG</Label>
              <Input
                placeholder=""
                value={fee3Months}
                onChange={(e) => setFee3Months(e.target.value)}
              />
            </div>

            <div>
              <Label className="text-xs font-medium text-muted-foreground uppercase">1 NGÀY/6 THÁNG</Label>
              <Input
                placeholder=""
                value={fee6Months}
                onChange={(e) => setFee6Months(e.target.value)}
              />
            </div>

            <div>
              <Label className="text-xs font-medium text-muted-foreground uppercase">1 NGÀY/12 THÁNG</Label>
              <Input
                placeholder=""
                value={fee12Months}
                onChange={(e) => setFee12Months(e.target.value)}
              />
            </div>

            <div>
              <Label className="text-xs font-medium text-muted-foreground uppercase">SỐ HỌC SINH (MỞ RỘNG)</Label>
              <Input
                type="number"
                value={String(expandedStudents)}
                onChange={(e) => setExpandedStudents(Number(e.target.value || 0))}
                min={0}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Remaining content */}
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

      {/* Chapters two-column panel */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

      {/* Short description */}
      <Card>
        <CardHeader>
          <CardTitle className="text-orange-600">Mô tả ngắn</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md overflow-hidden">
            <ReactQuill
              value={shortDescription}
              onChange={setShortDescription}
              modules={{
                toolbar: [
                  [{ font: [] }, { size: [] }],
                  ["bold", "italic", "underline", "strike"],
                  [{ list: "ordered" }, { list: "bullet" }],
                  [{ align: [] }],
                  ["link", "image"],
                  ["clean"],
                ],
              }}
              formats={["font","size","bold","italic","underline","strike","list","bullet","align","link","image"]}
              placeholder="Nhập mô tả ngắn..."
              className="min-h-[220px] bg-white text-sm"
            />
          </div>
          <div className="text-sm text-muted-foreground mt-2">Mô tả ngắn sẽ hiển thị ở trang khóa học và giúp học viên nắm nhanh nội dung.</div>
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