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
import { Textarea } from "@/components/ui/textarea";
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
  const [promoNote, setPromoNote] = useState<string>(""); // promo note

  // Học phí (other fields)
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
      promoNote,
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
    setPromoNote("");

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

    // Reset highlights etc. (if any)
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

  // New inline-edit states for highlights
  const [editingHighlightId, setEditingHighlightId] = useState<string | null>(null);
  const [editingHighlightText, setEditingHighlightText] = useState<string>("");
  const highlightEditInputRef = useRef<HTMLInputElement | null>(null);

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

  useEffect(() => {
    if (editingHighlightId && highlightEditInputRef.current) {
      highlightEditInputRef.current.focus();
      highlightEditInputRef.current.select();
    }
  }, [editingHighlightId]);

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

  // Save an edited highlight (via check button)
  const saveEditedHighlight = (id: string) => {
    const trimmed = editingHighlightText.trim();
    if (!trimmed) {
      toast.error("Nội dung nổi bật không được để trống.");
      return;
    }
    setHighlights((prev) => prev.map((h) => (h.id === id ? { ...h, text: trimmed } : h)));
    setEditingHighlightId(null);
    setEditingHighlightText("");
    toast.success("Đã cập nhật thông tin nổi bật.");
  };

  const startEditingHighlight = (h: HighlightItem) => {
    setEditingHighlightId(h.id);
    setEditingHighlightText(h.text);
  };

  return (
    <div className="space-y-6">
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
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        className="drag-handle cursor-move p-1 text-gray-400 hover:text-gray-600"
                        aria-label="Kéo thả để sắp xếp"
                        title="Kéo thả để sắp xếp"
                      >
                        &#x2630;
                      </button>

                      <div className="h-8 w-8 flex items-center justify-center rounded-full bg-green-50 text-green-600">
                        <Check className="h-4 w-4" />
                      </div>

                      <div className="flex-1 min-w-0">
                        {editingHighlightId === h.id ? (
                          <input
                            ref={highlightEditInputRef}
                            value={editingHighlightText}
                            onChange={(e) => setEditingHighlightText(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                saveEditedHighlight(h.id);
                              } else if (e.key === "Escape") {
                                e.preventDefault();
                                cancelInlineEdit();
                              }
                            }}
                            className="w-full border-b border-dashed py-1 focus:outline-none"
                            aria-label={`Chỉnh sửa thông tin nổi bật ${h.text}`}
                          />
                        ) : (
                          <div
                            className="text-sm truncate cursor-text"
                            onClick={() => startEditingHighlight(h)}
                            title="Nhấp để chỉnh sửa"
                          >
                            {h.text}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {editingHighlightId === h.id ? (
                          <button
                            onClick={() => saveEditedHighlight(h.id)}
                            title="Hoàn thành"
                            className="h-8 w-8 rounded-md bg-green-600 hover:bg-green-700 flex items-center justify-center text-white"
                            aria-label="Lưu"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                        ) : null}

                        <Button variant="ghost" className="text-red-600" onClick={() => handleDeleteHighlight(h.id)}>
                          Xóa
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <p className="text-sm text-muted-foreground">Kéo-thả để thay đổi thứ tự các mục; nhấp vào nội dung để chỉnh sửa, sau khi chỉnh sửa bấm dấu tích để lưu.</p>
            </div>
          </CardContent>
        </Card>

        <div>
          <CourseIncludes />
        </div>
      </div>

      <div className="flex justify-end gap-2 p-4 border-t bg-gray-50 dark:bg-gray-800">
        <Button variant="outline" onClick={handleCancel}>HỦY</Button>
        <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={handleSave}>LƯU</Button>
      </div>
    </div>
  );
};

export default AddClass;