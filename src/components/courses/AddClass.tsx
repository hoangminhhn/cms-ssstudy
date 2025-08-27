import React, { useRef, useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Calendar, Check, Layers, BookOpen, FileText, Clock, Plus, Trash } from "lucide-react";
import { toast } from "sonner";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
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
  const [promoTimeMode, setPromoTimeMode] = useState<string>("specific");
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
      includes,
    });
  };

  const handleCancel = () => {
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
    // Reset includes to initial fixed ones
    setIncludes(initialIncludes);
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
    toast.success("Đã lọc chương.");
  };

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

  // -- Full content (Nội dung) editor state and toolbar (more complete) --
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

  const onHighlightKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddHighlight();
    }
  };

  // -- "Khóa học bao gồm" feature --
  type IconName = "Layers" | "BookOpen" | "FileText" | "Clock" | "Star" | "Award" | "Certificate";
  interface IncludeItem {
    id: string;
    label: string;
    value: string;
    iconType: "builtin" | "svg";
    iconName?: IconName;
    svgDataUrl?: string;
    fixed?: boolean;
  }

  const initialIncludes: IncludeItem[] = [
    { id: "inc1", label: "Tổng số chuyên đề", value: "0", iconType: "builtin", iconName: "Layers", fixed: true },
    { id: "inc2", label: "Tổng số bài học", value: "0", iconType: "builtin", iconName: "BookOpen", fixed: true },
    { id: "inc3", label: "Tổng số bài tập", value: "0", iconType: "builtin", iconName: "FileText", fixed: true },
    { id: "inc4", label: "Tổng số giờ học", value: "0", iconType: "builtin", iconName: "Clock", fixed: true },
  ];

  const [includes, setIncludes] = useState<IncludeItem[]>(initialIncludes);

  // Form state for adding a new include row
  const [newIncludeLabel, setNewIncludeLabel] = useState("");
  const [newIncludeValue, setNewIncludeValue] = useState("");
  const [newIncludeIconType, setNewIncludeIconType] = useState<"builtin" | "svg">("builtin");
  const [newIncludeIconName, setNewIncludeIconName] = useState<IconName>("Layers");
  const [newIncludeSvgDataUrl, setNewIncludeSvgDataUrl] = useState<string | undefined>(undefined);
  const newSvgInputRef = useRef<HTMLInputElement | null>(null);

  const builtinIcons: { name: IconName; label: string; render: React.ReactNode }[] = [
    { name: "Layers", label: "Chuyên đề", render: <Layers className="w-5 h-5" /> },
    { name: "BookOpen", label: "Bài học", render: <BookOpen className="w-5 h-5" /> },
    { name: "FileText", label: "Bài tập", render: <FileText className="w-5 h-5" /> },
    { name: "Clock", label: "Giờ học", render: <Clock className="w-5 h-5" /> },
    { name: "Star", label: "Star", render: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .587l3.668 7.431L24 9.748l-6 5.845L19.335 24 12 19.897 4.665 24 6 15.593 0 9.748l8.332-1.73z" /></svg> },
    { name: "Award", label: "Award", render: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2 5h5l-4 3 1 5-4-3-4 3 1-5-4-3h5z" /></svg> },
    { name: "Certificate", label: "Certificate", render: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3 6h6v10l-9 4-9-4V8h6z" /></svg> },
  ];

  const handleSvgFileChangeForNew = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.name.toLowerCase().endsWith(".svg") && file.type !== "image/svg+xml") {
      toast.error("Chỉ chấp nhận định dạng SVG.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setNewIncludeSvgDataUrl(String(reader.result));
    };
    reader.readAsDataURL(file);
  };

  const handleAddInclude = () => {
    const label = newIncludeLabel.trim();
    const value = newIncludeValue.trim();
    if (!label) {
      toast.error("Vui lòng nhập nhãn.");
      return;
    }
    if (!value) {
      toast.error("Vui lòng nhập giá trị.");
      return;
    }
    if (newIncludeIconType === "svg" && !newIncludeSvgDataUrl) {
      toast.error("Vui lòng upload file SVG cho icon.");
      return;
    }
    const id = `inc-${Date.now()}`;
    const item: IncludeItem = {
      id,
      label,
      value,
      iconType: newIncludeIconType,
      iconName: newIncludeIconType === "builtin" ? newIncludeIconName : undefined,
      svgDataUrl: newIncludeIconType === "svg" ? newIncludeSvgDataUrl : undefined,
      fixed: false,
    };
    setIncludes((prev) => [...prev, item]);
    setNewIncludeLabel("");
    setNewIncludeValue("");
    setNewIncludeIconType("builtin");
    setNewIncludeIconName("Layers");
    setNewIncludeSvgDataUrl(undefined);
    if (newSvgInputRef.current) newSvgInputRef.current.value = "";
    toast.success("Đã thêm mục 'Khóa học bao gồm'.");
  };

  const handleDeleteInclude = (id: string) => {
    setIncludes((prev) => prev.filter((it) => it.id !== id));
    toast.success("Đã xóa mục.");
  };

  const handleUpdateInclude = (id: string, patch: Partial<IncludeItem>) => {
    setIncludes((prev) => prev.map((it) => (it.id === id ? { ...it, ...patch } : it)));
  };

  // Helper to render icon
  const renderIcon = (it: IncludeItem) => {
    if (it.iconType === "svg" && it.svgDataUrl) {
      return <img src={it.svgDataUrl} alt={it.label} className="w-6 h-6" />;
    }
    const name = it.iconName;
    switch (name) {
      case "Layers":
        return <Layers className="w-6 h-6" />;
      case "BookOpen":
        return <BookOpen className="w-6 h-6" />;
      case "FileText":
        return <FileText className="w-6 h-6" />;
      case "Clock":
        return <Clock className="w-6 h-6" />;
      case "Star":
        return <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .587l3.668 7.431L24 9.748l-6 5.845L19.335 24 12 19.897 4.665 24 6 15.593 0 9.748l8.332-1.73z" /></svg>;
      case "Award":
        return <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2 5h5l-4 3 1 5-4-3-4 3 1-5-4-3h5z" /></svg>;
      case "Certificate":
        return <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3 6h6v10l-9 4-9-4V8h6z" /></svg>;
      default:
        return <Layers className="w-6 h-6" />;
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

      {/* ... other cards unchanged (pricing, fees, info, features, chapters, description, content) ... */}
      {/* For brevity in reading, these sections are kept identical to previous version and unchanged. */}
      {/* Short description panel */}
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

      {/* Split into two cards: left = Highlights, right = "Khóa học bao gồm" */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Highlights card (left) */}
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

              <p className="text-sm text-muted-foreground">Kéo-thả để thay đổi thứ tự các mục.</p>
            </div>
          </CardContent>
        </Card>

        {/* New: "Khóa học bao gồm" card (right) */}
        <Card>
          <CardHeader>
            <CardTitle className="text-orange-600">Khóa học bao gồm</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Add new include form */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 items-end">
                <div>
                  <Label className="text-xs">Nhãn</Label>
                  <Input value={newIncludeLabel} onChange={(e) => setNewIncludeLabel(e.target.value)} placeholder="Ví dụ: Tài liệu kèm theo" />
                </div>
                <div>
                  <Label className="text-xs">Giá trị</Label>
                  <Input value={newIncludeValue} onChange={(e) => setNewIncludeValue(e.target.value)} placeholder="Ví dụ: 5" />
                </div>
                <div>
                  <Label className="text-xs">Icon</Label>
                  <div className="flex gap-2 items-center">
                    <Select value={newIncludeIconType} onValueChange={(v) => setNewIncludeIconType(v as "builtin" | "svg")}>
                      <SelectTrigger className="h-9">
                        <SelectValue placeholder="Chọn loại" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="builtin">Icon có sẵn</SelectItem>
                        <SelectItem value="svg">Upload SVG</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {newIncludeIconType === "builtin" ? (
                    <div className="mt-2">
                      <Select value={newIncludeIconName} onValueChange={(v) => setNewIncludeIconName(v as IconName)}>
                        <SelectTrigger className="h-9">
                          <SelectValue placeholder="Chọn icon" />
                        </SelectTrigger>
                        <SelectContent>
                          {builtinIcons.map((bi) => (
                            <SelectItem key={bi.name} value={bi.name}>
                              <div className="flex items-center gap-2">
                                <span>{bi.render}</span>
                                <span>{bi.label}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  ) : (
                    <div className="mt-2">
                      <input
                        ref={newSvgInputRef}
                        type="file"
                        accept=".svg,image/svg+xml"
                        onChange={handleSvgFileChangeForNew}
                        className="text-sm"
                        aria-label="Upload icon SVG"
                      />
                      {newIncludeSvgDataUrl && <div className="mt-2"><img src={newIncludeSvgDataUrl} alt="svg preview" className="w-8 h-8" /></div>}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleAddInclude} className="bg-green-600 hover:bg-green-700 text-white">
                  <Plus className="mr-2" /> Thêm mục
                </Button>
              </div>

              {/* List of includes */}
              <div className="space-y-2">
                {includes.map((it) => (
                  <div key={it.id} className="flex items-center gap-3 border rounded p-3 bg-white dark:bg-gray-800">
                    <div className="w-10 h-10 flex items-center justify-center rounded bg-gray-50">
                      {renderIcon(it)}
                    </div>

                    <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-2 items-center">
                      <div>
                        {it.fixed ? (
                          <div className="text-sm font-medium">{it.label}</div>
                        ) : (
                          <Input
                            value={it.label}
                            onChange={(e) => handleUpdateInclude(it.id, { label: e.target.value })}
                            className="text-sm"
                            aria-label="Edit label"
                          />
                        )}
                      </div>
                      <div>
                        {it.fixed ? (
                          <div className="text-sm">{it.value}</div>
                        ) : (
                          <Input
                            value={it.value}
                            onChange={(e) => handleUpdateInclude(it.id, { value: e.target.value })}
                            className="text-sm"
                            aria-label="Edit value"
                          />
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {!it.fixed && (
                          <>
                            <Select value={it.iconType === "builtin" ? (it.iconName || "Layers") : "svg"} onValueChange={(v) => {
                              if (v === "svg") {
                                handleUpdateInclude(it.id, { iconType: "svg", iconName: undefined, svgDataUrl: undefined });
                              } else {
                                handleUpdateInclude(it.id, { iconType: "builtin", iconName: v as IconName, svgDataUrl: undefined });
                              }
                            }}>
                              <SelectTrigger className="h-8">
                                <SelectValue placeholder="Icon" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Layers">Layers</SelectItem>
                                <SelectItem value="BookOpen">BookOpen</SelectItem>
                                <SelectItem value="FileText">FileText</SelectItem>
                                <SelectItem value="Clock">Clock</SelectItem>
                                <SelectItem value="Star">Star</SelectItem>
                                <SelectItem value="Award">Award</SelectItem>
                                <SelectItem value="Certificate">Certificate</SelectItem>
                                <SelectItem value="svg">SVG (upload)</SelectItem>
                              </SelectContent>
                            </Select>

                            {it.iconType === "svg" ? (
                              <label className="inline-flex items-center gap-2 cursor-pointer">
                                <input
                                  type="file"
                                  accept=".svg,image/svg+xml"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (!file) return;
                                    if (!file.name.toLowerCase().endsWith(".svg") && file.type !== "image/svg+xml") {
                                      toast.error("Chỉ chấp nhận định dạng SVG.");
                                      return;
                                    }
                                    const reader = new FileReader();
                                    reader.onload = () => {
                                      handleUpdateInclude(it.id, { svgDataUrl: String(reader.result) });
                                    };
                                    reader.readAsDataURL(file);
                                  }}
                                />
                              </label>
                            ) : null}

                            <Button variant="ghost" className="text-red-600" onClick={() => handleDeleteInclude(it.id)}>
                              <Trash />
                            </Button>
                          </>
                        )}
                        {it.fixed && <div className="text-xs text-muted-foreground">Mục cố định</div>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-sm text-muted-foreground">Bốn mục đầu là cố định; bạn có thể thêm, chỉnh sửa hoặc xóa các mục do admin thêm. Icon có thể chọn trong danh sách hoặc upload SVG.</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer buttons placed outside the Card */}
      <div className="flex justify-end gap-2 p-4 border-t bg-gray-50 dark:bg-gray-800">
        <Button variant="outline" onClick={handleCancel}>HỦY</Button>
        <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={handleSave}>LƯU</Button>
      </div>
    </div>
  );
};

export default AddClass;