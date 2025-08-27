import React, { useRef, useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Calendar, Check, BookOpen, FileText, File, Clock, Plus, Upload } from "lucide-react";
import { toast } from "sonner";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import SortableJS from "sortablejs";

type ExtraRow = {
  id: string;
  title: string;
  value: string;
  iconKind: "builtin" | "uploaded";
  builtinKey?: string;
  uploadedDataUrl?: string | null;
};

const AddClass: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const uploadIconInputRef = useRef<HTMLInputElement | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Thông tin chung (kept unchanged)
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

  // Chapters feature (unchanged)
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

  // Short description & content editors (unchanged)
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

  // Highlights (unchanged)
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

  const onHighlightKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddHighlight();
    }
  };

  // --- New: "Khóa học bao gồm" state and handlers ---
  // Fixed 4 required rows
  const [includedTopics, setIncludedTopics] = useState({
    topics: "", // chuyên đề
    lessonsCount: "", // số bài học
    exercisesCount: "", // số bài tập
    hours: "", // số giờ học
  });
  const [includedErrors, setIncludedErrors] = useState<Record<string, string>>({});

  // Extra customizable rows
  const [extras, setExtras] = useState<ExtraRow[]>([]);

  // Builtin icon options (key -> component)
  const builtinIcons: { key: string; label: string; Icon: React.ElementType }[] = [
    { key: "book", label: "Chuyên đề", Icon: BookOpen },
    { key: "lessons", label: "Bài học", Icon: FileText },
    { key: "exercises", label: "Bài tập", Icon: File },
    { key: "hours", label: "Giờ học", Icon: Clock },
  ];

  // Validate fixed required fields
  const validateFixed = () => {
    const errors: Record<string, string> = {};
    if (!includedTopics.topics.trim()) errors.topics = "Bắt buộc";
    if (!includedTopics.lessonsCount.trim()) errors.lessonsCount = "Bắt buộc";
    if (!includedTopics.exercisesCount.trim()) errors.exercisesCount = "Bắt buộc";
    if (!includedTopics.hours.trim()) errors.hours = "Bắt buộc";
    setIncludedErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Add extra row
  const addExtraRow = () => {
    const id = `ext-${Date.now()}`;
    setExtras((prev) => [
      ...prev,
      {
        id,
        title: "",
        value: "",
        iconKind: "builtin",
        builtinKey: "book",
        uploadedDataUrl: null,
      },
    ]);
  };

  // Remove extra row
  const removeExtraRow = (id: string) => {
    setExtras((prev) => prev.filter((r) => r.id !== id));
  };

  // Update extra row field
  const updateExtraRow = (id: string, patch: Partial<ExtraRow>) => {
    setExtras((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  };

  // Upload icon for a specific extra row
  const handleUploadIcon = (e: React.ChangeEvent<HTMLInputElement>, rowId: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.includes("svg") && file.type !== "image/svg+xml") {
      toast.error("Chỉ chấp nhận file SVG cho icon.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = String(reader.result);
      updateExtraRow(rowId, { iconKind: "uploaded", uploadedDataUrl: dataUrl, builtinKey: undefined });
      toast.success("Đã tải icon lên.");
    };
    reader.readAsDataURL(file);
    e.currentTarget.value = "";
  };

  // When saving main form, validate fixed fields and extras' required fields (title + value)
  const handleSave = () => {
    // Validate fixed rows
    const okFixed = validateFixed();
    // Validate extras
    const invalidExtra = extras.some((r) => !r.title.trim() || !r.value.trim());
    if (!okFixed) {
      toast.error("Vui lòng điền đầy đủ các trường bắt buộc trong 'Khóa học bao gồm'.");
      return;
    }
    if (invalidExtra) {
      toast.error("Vui lòng điền đầy đủ tiêu đề và nội dung cho các hàng bổ sung hoặc xóa chúng.");
      return;
    }

    // proceed to save (currently local)
    toast.success("Đã lưu thông tin lớp.");
    console.log({
      includedTopics,
      extras,
      // other fields...
    });
  };

  // Helper render for builtin icon
  const renderBuiltinIcon = (key?: string) => {
    const found = builtinIcons.find((b) => b.key === key);
    if (!found) return <BookOpen className="h-5 w-5" />;
    const Icon = found.Icon;
    return <Icon className="h-5 w-5" />;
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

    // Reset highlights & extras
    setHighlights([]);
    setExtras([]);

    if (fileInputRef.current) fileInputRef.current.value = "";
    if (uploadIconInputRef.current) uploadIconInputRef.current.value = "";
    toast.info("Đã hủy thay đổi.");
  };

  return (
    <div className="space-y-6">
      {/* --- existing top parts (unchanged) --- */}
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

      {/* ...price, fees, other cards unchanged (omitted here for brevity in rendering) */}
      <Card>
        <CardHeader>
          <CardTitle>Giá và khuyến mãi</CardTitle>
        </CardHeader>
        <CardContent>
          {/* content unchanged */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            <div className="md:col-span-2">
              <Label htmlFor="price" className="text-xs">GIÁ KHÓA HỌC</Label>
              <Input id="price" type="number" placeholder="0" value={price} onChange={(e) => setPrice(e.target.value)} className="mt-1" />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="promoPrice" className="text-xs">GIÁ KHUYẾN MÃI</Label>
              <Input id="promoPrice" type="number" placeholder="0" value={promoPrice} onChange={(e) => setPromoPrice(e.target.value)} className="mt-1" />
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
              <Input type="number" value={String(promoQuantity)} onChange={(e) => setPromoQuantity(Number(e.target.value || 0))} className="mt-1" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Full content panel (Nội dung) */}
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

      {/* Left: Highlights (unchanged), Right: Khóa học bao gồm (new detailed functionality) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left Card: Thông tin nổi bật (kept as before) */}
        <Card>
          <CardHeader>
            <CardTitle className="text-orange-600">Thông tin nổi bật</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Nhập thông tin nổi bật..."
                  value={newHighlightText}
                  onChange={(e) => setNewHighlightText(e.target.value)}
                  onKeyDown={onHighlightKeyDown}
                  aria-label="Nhập thông tin nổi bật"
                />
                <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={handleAddHighlight}>
                  Thêm
                </Button>
              </div>

              <div ref={highlightsListRef} className="space-y-2" aria-label="Danh sách thông tin nổi bật sắp xếp được">
                {highlights.length === 0 ? (
                  <div className="text-sm text-muted-foreground p-4 border rounded">Chưa có thông tin nổi bật nào.</div>
                ) : (
                  highlights.map((h) => (
                    <div
                      key={h.id}
                      className="flex items-center gap-3 border rounded p-3 bg-white dark:bg-gray-800"
                    >
                      <button
                        className="drag-handle p-1 text-gray-400 hover:text-gray-600"
                        aria-label="Kéo để thay đổi vị trí"
                        title="Kéo để thay đổi vị trí"
                      >
                        <span className="select-none" aria-hidden>☰</span>
                      </button>

                      <div className="flex-1 flex items-center gap-3">
                        <div className="h-8 w-8 flex items-center justify-center rounded-full bg-green-50 text-green-600">
                          <Check className="h-4 w-4" />
                        </div>
                        <div className="text-sm">{h.text}</div>
                      </div>

                      <div>
                        <Button
                          variant="ghost"
                          className="text-red-600 hover:bg-red-50"
                          onClick={() => handleDeleteHighlight(h.id)}
                          aria-label={`Xóa thông tin nổi bật ${h.text}`}
                        >
                          Xóa
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <p className="text-sm text-muted-foreground">Danh sách có thể kéo-thả để thay đổi thứ tự.</p>
            </div>
          </CardContent>
        </Card>

        {/* Right Card: Khóa học bao gồm */}
        <Card>
          <CardHeader>
            <CardTitle className="text-orange-600">Khóa học bao gồm (CMS)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Fixed 4 rows */}
              <div className="grid gap-3">
                {/* Row 1: Chuyên đề */}
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 text-orange-600">
                    <BookOpen className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <Label className="text-sm">Chuyên đề (admin)</Label>
                    <Input
                      value={includedTopics.topics}
                      onChange={(e) => setIncludedTopics((p) => ({ ...p, topics: e.target.value }))}
                      placeholder="Ví dụ: Toán nâng cao, Logic..."
                    />
                    {includedErrors.topics && <p className="text-xs text-red-600 mt-1">{includedErrors.topics}</p>}
                  </div>
                </div>

                {/* Row 2: Số bài học */}
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 text-orange-600">
                    <FileText className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <Label className="text-sm">Số bài học (admin)</Label>
                    <Input
                      value={includedTopics.lessonsCount}
                      onChange={(e) => setIncludedTopics((p) => ({ ...p, lessonsCount: e.target.value }))}
                      placeholder="Ví dụ: 24"
                    />
                    {includedErrors.lessonsCount && <p className="text-xs text-red-600 mt-1">{includedErrors.lessonsCount}</p>}
                  </div>
                </div>

                {/* Row 3: Số bài tập */}
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 text-orange-600">
                    <File className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <Label className="text-sm">Số bài tập (admin)</Label>
                    <Input
                      value={includedTopics.exercisesCount}
                      onChange={(e) => setIncludedTopics((p) => ({ ...p, exercisesCount: e.target.value }))}
                      placeholder="Ví dụ: 10"
                    />
                    {includedErrors.exercisesCount && <p className="text-xs text-red-600 mt-1">{includedErrors.exercisesCount}</p>}
                  </div>
                </div>

                {/* Row 4: Số giờ học */}
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 text-orange-600">
                    <Clock className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <Label className="text-sm">Số giờ học (admin)</Label>
                    <Input
                      value={includedTopics.hours}
                      onChange={(e) => setIncludedTopics((p) => ({ ...p, hours: e.target.value }))}
                      placeholder="Ví dụ: 36 giờ"
                    />
                    {includedErrors.hours && <p className="text-xs text-red-600 mt-1">{includedErrors.hours}</p>}
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="font-medium">Hàng thông tin bổ sung</div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" onClick={addExtraRow} className="flex items-center gap-2">
                      <Plus className="h-4 w-4" /> Thêm hàng
                    </Button>
                  </div>
                </div>

                {extras.length === 0 ? (
                  <div className="text-sm text-muted-foreground p-4 border rounded">Chưa có hàng bổ sung nào.</div>
                ) : (
                  <div className="space-y-3">
                    {extras.map((r) => (
                      <div key={r.id} className="flex items-start gap-3 border rounded p-3 bg-white dark:bg-gray-800">
                        <div className="flex-shrink-0">
                          {/* Render built-in icon or uploaded */}
                          {r.iconKind === "builtin" ? (
                            <div className="text-orange-600">
                              {renderBuiltinIcon(r.builtinKey)}
                            </div>
                          ) : r.uploadedDataUrl ? (
                            <img src={r.uploadedDataUrl} alt="icon" className="h-6 w-6 object-contain" />
                          ) : (
                            <div className="text-orange-600">
                              <Upload className="h-6 w-6" />
                            </div>
                          )}
                        </div>

                        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div>
                            <Label className="text-xs">Tiêu đề (admin)</Label>
                            <Input value={r.title} onChange={(e) => updateExtraRow(r.id, { title: e.target.value })} placeholder="Ví dụ: Trắc nghiệm online" />
                          </div>

                          <div>
                            <Label className="text-xs">Nội dung (admin)</Label>
                            <Input value={r.value} onChange={(e) => updateExtraRow(r.id, { value: e.target.value })} placeholder="Ví dụ: 5 bài kiểm tra" />
                          </div>

                          <div>
                            <Label className="text-xs">Icon</Label>
                            <div className="flex items-center gap-2">
                              <Select value={r.iconKind === "builtin" ? r.builtinKey : "uploaded"} onValueChange={(val) => {
                                if (val === "uploaded") {
                                  // trigger upload dialog
                                  updateExtraRow(r.id, { iconKind: "uploaded" });
                                  uploadIconInputRef.current?.click();
                                } else {
                                  updateExtraRow(r.id, { iconKind: "builtin", builtinKey: val, uploadedDataUrl: null });
                                }
                              }}>
                                <SelectTrigger className="w-full">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {builtinIcons.map((b) => (
                                    <SelectItem key={b.key} value={b.key}>
                                      <div className="flex items-center gap-2">
                                        <span className="text-orange-600">{b.label}</span>
                                      </div>
                                    </SelectItem>
                                  ))}
                                  <SelectItem value="uploaded">Tải icon (SVG)</SelectItem>
                                </SelectContent>
                              </Select>
                              <input
                                ref={uploadIconInputRef}
                                type="file"
                                accept=".svg"
                                className="hidden"
                                onChange={(e) => handleUploadIcon(e, r.id)}
                              />
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">Kích thước icon cố định.</p>
                          </div>
                        </div>

                        <div className="flex-shrink-0">
                          <Button variant="ghost" className="text-red-600 hover:bg-red-50" onClick={() => removeExtraRow(r.id)}>Xóa</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="text-sm text-muted-foreground">
                Lưu ý: Trong CMS bạn thấy tiêu đề để nhập; trên webuser chỉ hiển thị nội dung (không hiển thị tiêu đề).
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer actions (save/cancel) */}
      <div className="flex justify-end gap-2 p-4 border-t bg-gray-50 dark:bg-gray-800">
        <Button variant="outline" onClick={handleCancel}>HỦY</Button>
        <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={handleSave}>LƯU</Button>
      </div>
    </div>
  );
};

export default AddClass;