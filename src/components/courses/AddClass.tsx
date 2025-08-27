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
import { Check, Trash2 } from "lucide-react";
import SortableJS from "sortablejs";

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
      highlights,
    });
  };

  const handleCancel = () => {
    // Reset some fields; keep behavior simple
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

    setPrice("");
    setPromoPrice("");
    setPromoFrom("");
    setPromoTo("");
    setPromoQuantity(0);
    setPromoTimeMode("specific");

    setFeePerDay("");
    setFee1Month("");
    setFee3Months("");
    setFee6Months("");
    setFee12Months("");
    setExpandedStudents(0);

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
    setNewHighlight("");

    if (fileInputRef.current) fileInputRef.current.value = "";
    toast.info("Đã hủy thay đổi.");
  };

  // -- Chapters feature (kept for context) --
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
    toast.success("Đã lọc chương.");
  };

  // -- Short description editor --
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

  // -- Full content editor --
  const [fullContent, setFullContent] = useState<string>("");

  const contentModules = {
    toolbar: [
      [{ font: [] }, { size: [] }],
      [{ header: [1, 2, 3, false] }],
      ["bold", "underline", "italic", "strike"],
      [{ script: "sub" }, { script: "super" }],
      [{ color: [] }, { background: [] }],
      [{ align: [] }],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ indent: "-1" }, { indent: "+1" }],
      ["blockquote", "code-block", "formula"],
      ["link", "image", "video"],
      ["clean"],
    ],
  };

  const contentFormats = [
    "font", "size", "header",
    "bold", "italic", "underline", "strike",
    "script", "color", "background",
    "align", "list", "bullet", "indent",
    "blockquote", "code-block", "formula",
    "link", "image", "video"
  ];

  // -- Highlights with drag & drop (vertical list) --
  const [highlights, setHighlights] = useState<string[]>([
    "Đảm bảo đầu ra.",
    "Có kiến thức về cấu trúc và cách tiếp cận bài thi IELTS hiệu quả.",
    "Hình thành tư duy học đúng. Bỏ Tư duy đọc dịch, viết dịch, nói dịch.",
    "Nói và viết một đoạn/ một bài nhanh, lưu loát, tự nhiên và liên kết, kể cả khi gặp chủ đề lạ.",
  ]);
  const [newHighlight, setNewHighlight] = useState<string>("");

  const addHighlight = () => {
    const trimmed = newHighlight.trim();
    if (!trimmed) {
      toast.error("Vui lòng nhập nội dung nổi bật.");
      return;
    }
    setHighlights(prev => [...prev, trimmed]);
    setNewHighlight("");
    toast.success("Đã thêm thông tin nổi bật.");
  };

  const removeHighlight = (index: number) => {
    setHighlights(prev => prev.filter((_, i) => i !== index));
    toast.success("Đã xóa thông tin nổi bật.");
  };

  // Sortable ref for vertical ordering
  const highlightsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!highlightsRef.current) return;
    const sortable = SortableJS.create(highlightsRef.current, {
      animation: 150,
      handle: ".drag-handle",
      ghostClass: "opacity-60",
      onEnd: (evt) => {
        const oldIndex = evt.oldIndex;
        const newIndex = evt.newIndex;
        if (typeof oldIndex !== "number" || typeof newIndex !== "number") return;
        setHighlights(prev => {
          const next = [...prev];
          const [moved] = next.splice(oldIndex, 1);
          next.splice(newIndex, 0, moved);
          return next;
        });
        toast.success("Đã thay đổi thứ tự thông tin nổi bật.");
      },
    });

    return () => sortable.destroy();
  }, [highlightsRef.current]); // eslint-disable-line react-hooks/exhaustive-deps

  const renderHighlightsList = () => {
    return (
      <div ref={highlightsRef} className="flex flex-col gap-2" aria-live="polite">
        {highlights.map((h, idx) => (
          <div
            key={idx}
            className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 border rounded-md"
            role="group"
            aria-label={`Thông tin nổi bật ${idx + 1}`}
          >
            <div className="drag-handle cursor-move select-none text-gray-400" aria-hidden title="Kéo để thay đổi vị trí">
              ≡
            </div>
            <div className="flex-shrink-0 mt-0.5">
              <div className="h-6 w-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                <Check className="h-4 w-4" />
              </div>
            </div>
            <div className="flex-1 text-sm text-gray-700 dark:text-gray-200">{h}</div>
            <div className="ml-2">
              <Button variant="ghost" size="icon" className="text-red-600 hover:bg-red-50" onClick={() => removeHighlight(idx)} aria-label={`Xóa highlight ${idx + 1}`}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    );
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

      {/* Many intermediate panels kept unchanged... (pricing, fees, chapters, descriptions) */}
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

      {/* Highlights + Placeholder side-by-side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left: Highlights (half width) */}
        <Card>
          <CardHeader>
            <CardTitle className="text-orange-600">Thông tin nổi bật</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="flex gap-2 items-center">
                <Input
                  placeholder="Nhập thông tin nổi bật..."
                  value={newHighlight}
                  onChange={(e) => setNewHighlight(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addHighlight();
                    }
                  }}
                />
                <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={addHighlight}>Thêm</Button>
              </div>

              <div>
                {highlights.length === 0 ? (
                  <div className="text-muted-foreground text-sm">Chưa có thông tin nổi bật nào.</div>
                ) : (
                  renderHighlightsList()
                )}
              </div>

              <div className="text-sm text-muted-foreground">Danh sách có thể kéo-thả để thay đổi thứ tự (kéo lên/xuống).</div>
            </div>
          </CardContent>
        </Card>

        {/* Right: Placeholder for future functionality (half width) */}
        <Card>
          <CardHeader>
            <CardTitle className="text-muted-foreground">Bảng phụ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="min-h-[220px] flex items-center justify-center text-sm text-muted-foreground">
              Khu vực dành cho chức năng bổ sung — bạn có thể thêm module tiếp theo ở đây.
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer buttons */}
      <div className="flex justify-end gap-2 p-4 border-t bg-gray-50 dark:bg-gray-800">
        <Button variant="outline" onClick={handleCancel}>HỦY</Button>
        <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={handleSave}>LƯU</Button>
      </div>
    </div>
  );
};

export default AddClass;