import React, { useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import { Upload } from "lucide-react";

const CLASS_OPTIONS = [
  "Lớp 1",
  "Lớp 2",
  "Lớp 3",
  "Lớp 4",
  "Lớp 5",
  "Lớp 6",
  "Lớp 7",
  "Lớp 8",
  "Lớp 9",
  "Lớp 10",
  "Lớp 11",
  "Lớp 12",
];

const STAR_OPTIONS = ["1", "2", "3", "4", "5"];

const AddCourseReview: React.FC = () => {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [name, setName] = useState("");
  const [className, setClassName] = useState("");
  const [stars, setStars] = useState<string>("5");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState<"active" | "hidden">("active");

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const reviewerInitials = React.useMemo(() => {
    const parts = name.trim().split(" ").filter(Boolean);
    if (parts.length === 0) return "NV";
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }, [name]);

  const onPickAvatar = () => fileRef.current?.click();

  const onAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setAvatarFile(file);
    if (avatarPreview) {
      URL.revokeObjectURL(avatarPreview);
      setAvatarPreview(null);
    }
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatarPreview(url);
    }
  };

  const validate = () => {
    if (!name.trim()) {
      toast.error("Vui lòng nhập tên người đánh giá.");
      return false;
    }
    if (!className) {
      toast.error("Vui lòng chọn lớp.");
      return false;
    }
    if (!content.trim()) {
      toast.error("Vui lòng nhập nội dung đánh giá.");
      return false;
    }
    return true;
  };

  const buildPayload = () => ({
    id: `rv-${Date.now()}`,
    name: name.trim(),
    className,
    stars: Number(stars),
    content: content.trim(),
    status,
    avatarFileName: avatarFile?.name ?? null,
    createdAt: new Date().toLocaleString(),
  });

  const handleSave = (addNew = false) => {
    if (!validate()) return;
    const payload = buildPayload();
    console.log("Saved review:", payload);
    toast.success("Đã lưu đánh giá.");
    if (addNew) {
      // Reset form for adding another
      setName("");
      setClassName("");
      setStars("5");
      setContent("");
      setStatus("active");
      setAvatarFile(null);
      if (avatarPreview) {
        URL.revokeObjectURL(avatarPreview);
        setAvatarPreview(null);
      }
      if (fileRef.current) fileRef.current.value = "";
      // keep focus on name
      const el = document.getElementById("reviewer-name");
      if (el) (el as HTMLInputElement).focus();
      return;
    }
    // otherwise keep values (or you may choose to reset)
  };

  return (
    <div className="p-4">
      <Card>
        <CardHeader>
          <CardTitle>Thêm đánh giá khóa học</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div className="lg:col-span-8 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="reviewer-name">Tên</Label>
                  <Input id="reviewer-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Tên người đánh giá" />
                </div>

                <div>
                  <Label htmlFor="class-select">Lớp</Label>
                  <Select value={className} onValueChange={setClassName}>
                    <SelectTrigger id="class-select">
                      <SelectValue placeholder="Chọn lớp" />
                    </SelectTrigger>
                    <SelectContent>
                      {CLASS_OPTIONS.map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="stars-select">Số sao</Label>
                  <Select value={stars} onValueChange={setStars}>
                    <SelectTrigger id="stars-select">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STAR_OPTIONS.map((s) => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Avatar</Label>
                  <div className="flex items-center gap-3">
                    <div>
                      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onAvatarChange} />
                      <Button variant="outline" onClick={onPickAvatar} className="flex items-center gap-2">
                        <Upload className="h-4 w-4" /> Chọn ảnh
                      </Button>
                    </div>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-10 w-10">
                        {avatarPreview ? <AvatarImage src={avatarPreview} alt={name || "avatar"} /> : <AvatarFallback>{reviewerInitials}</AvatarFallback>}
                      </Avatar>
                      <div className="text-sm text-muted-foreground">
                        {avatarFile?.name ?? "No file chosen"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="review-content">Nội dung đánh giá</Label>
                <Textarea id="review-content" value={content} onChange={(e) => setContent(e.target.value)} placeholder="Nhập nội dung đánh giá..." className="min-h-[120px]" />
              </div>

              <div>
                <Label className="mb-2 block">Trạng thái</Label>
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <RadioGroup value={status} onValueChange={(v) => setStatus(v as "active" | "hidden")}>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="active" id="status-active" />
                          <span>Hiển thị</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="hidden" id="status-hidden" />
                          <span>Ẩn</span>
                        </div>
                      </div>
                    </RadioGroup>
                  </label>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col justify-between">
              <div className="border rounded p-4 bg-gray-50">
                <div className="text-sm font-medium mb-2">Xem trước</div>
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    {avatarPreview ? <AvatarImage src={avatarPreview} alt={name || "avatar"} /> : <AvatarFallback>{reviewerInitials}</AvatarFallback>}
                  </Avatar>
                  <div className="flex-1">
                    <div className="font-medium">{name || "Người đánh giá"}</div>
                    <div className="text-sm text-muted-foreground">{className || "Lớp"}</div>
                    <div className="mt-2 text-sm">{content ? content.slice(0, 120) + (content.length > 120 ? "..." : "") : "Nội dung đánh giá sẽ hiển thị ở đây."}</div>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex gap-2 justify-end">
                <Button variant="outline" onClick={() => {
                  // Reset form
                  setName("");
                  setClassName("");
                  setStars("5");
                  setContent("");
                  setStatus("active");
                  setAvatarFile(null);
                  if (avatarPreview) {
                    URL.revokeObjectURL(avatarPreview);
                    setAvatarPreview(null);
                  }
                  if (fileRef.current) fileRef.current.value = "";
                  toast.info("Đã đặt lại form.");
                }}>Hủy</Button>

                <div className="flex gap-2">
                  <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={() => handleSave(false)}>Lưu</Button>
                  <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={() => handleSave(true)}>Lưu &amp; Thêm mới</Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddCourseReview;