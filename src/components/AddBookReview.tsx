import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Star, Upload } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

type BookOption = {
  id: string;
  title: string;
  author?: string;
};

const SAMPLE_BOOKS: BookOption[] = [
  { id: "b1", title: "Sách 20 đề chọn lọc THPTQG môn Toán 2024", author: "NXB Toán" },
  { id: "b2", title: "Sách 7 Ngày đạt điểm tối đa mũ và logarit", author: "NXB Lý" },
  { id: "b3", title: "Kỹ thuật CASIO từ A đến Z", author: "NXB CASIO" },
];

const AddBookReview: React.FC = () => {
  const [bookId, setBookId] = React.useState<string>("");
  const [reviewer, setReviewer] = React.useState<string>("");
  const [stars, setStars] = React.useState<number>(5);
  const [content, setContent] = React.useState<string>("");
  const [active, setActive] = React.useState<boolean>(true);

  // Avatar state + ref
  const [avatarPreview, setAvatarPreview] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const selectedBook = SAMPLE_BOOKS.find((b) => b.id === bookId) ?? null;

  const resetForm = () => {
    setBookId("");
    setReviewer("");
    setStars(5);
    setContent("");
    setActive(true);
    setAvatarPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSave = () => {
    if (!bookId) {
      toast.error("Vui lòng chọn một cuốn sách.");
      return;
    }
    if (!reviewer.trim()) {
      toast.error("Vui lòng nhập tên người đánh giá.");
      return;
    }
    if (!content.trim()) {
      toast.error("Vui lòng nhập nội dung đánh giá.");
      return;
    }

    // In a real app you'd call an API here
    const payload = {
      id: `r-${Date.now()}`,
      bookId,
      reviewer: reviewer.trim(),
      stars,
      content: content.trim(),
      active,
      avatar: avatarPreview,
      updatedAt: new Date().toLocaleString(),
    };

    console.log("Saved review:", payload);
    toast.success("Đã thêm đánh giá sách.");
    resetForm();
  };

  const handlePickAvatar = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setAvatarPreview(String(reader.result));
    };
    reader.readAsDataURL(file);
  };

  // helper to show initials if no avatar
  const reviewerInitials = React.useMemo(() => {
    const name = reviewer.trim();
    if (!name) return "NG";
    const parts = name.split(" ").filter(Boolean);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }, [reviewer]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left: Form */}
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Thêm đánh giá sách</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="book">Sách</Label>
                <Select value={bookId} onValueChange={setBookId}>
                  <SelectTrigger id="book" className="w-full">
                    <SelectValue placeholder="Chọn sách..." />
                  </SelectTrigger>
                  <SelectContent>
                    {SAMPLE_BOOKS.map((b) => (
                      <SelectItem key={b.id} value={b.id}>
                        {b.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="reviewer">Người đánh giá</Label>
                <Input id="reviewer" placeholder="Tên người đánh giá" value={reviewer} onChange={(e) => setReviewer(e.target.value)} />
              </div>
            </div>

            {/* Stars first, then Avatar, then Active (avatar is now after stars) */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
              {/* Stars selector - moved to be first */}
              <div>
                <Label htmlFor="stars">Số sao</Label>
                <Select value={String(stars)} onValueChange={(v) => setStars(Number(v))}>
                  <SelectTrigger id="stars" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="3">3</SelectItem>
                    <SelectItem value="4">4</SelectItem>
                    <SelectItem value="5">5</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Avatar picker - moved to second column */}
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  <Avatar className="h-12 w-12">
                    {avatarPreview ? (
                      <AvatarImage src={avatarPreview} alt={reviewer || "avatar"} />
                    ) : (
                      <AvatarFallback>{reviewerInitials}</AvatarFallback>
                    )}
                  </Avatar>
                </div>

                <div className="flex flex-col">
                  <Label className="text-sm">Ảnh đại diện</Label>
                  <div className="flex items-center gap-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarChange}
                      aria-label="Upload avatar"
                    />
                    <Button variant="outline" size="sm" onClick={handlePickAvatar} className="flex items-center gap-2">
                      <Upload className="h-4 w-4" /> Chọn ảnh
                    </Button>
                    {avatarPreview && (
                      <Button variant="ghost" size="sm" onClick={() => setAvatarPreview(null)}>
                        Xóa
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {/* Active switch (span two columns on larger screens) */}
              <div className="sm:col-span-2 flex items-center justify-end">
                <div className="flex items-center gap-3">
                  <Label className="mb-0">Kích hoạt</Label>
                  <Switch checked={active} onCheckedChange={(v) => setActive(!!v)} />
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="content">Nội dung đánh giá</Label>
              <Textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} placeholder="Nhập nội dung đánh giá..." className="min-h-[160px]" />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={resetForm}>Hủy</Button>
              <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={handleSave}>Lưu</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right: Preview */}
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Xem trước đánh giá</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border rounded p-4 bg-white dark:bg-gray-800">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <Avatar className="h-12 w-12">
                      {avatarPreview ? (
                        <AvatarImage src={avatarPreview} alt={reviewer || "avatar"} />
                      ) : (
                        <AvatarFallback>{reviewerInitials}</AvatarFallback>
                      )}
                    </Avatar>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-sm">{selectedBook ? selectedBook.title : "Chưa chọn sách"}</div>
                        {selectedBook?.author && <div className="text-xs text-muted-foreground">{selectedBook.author}</div>}
                      </div>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: stars }).map((_, i) => (
                          <Star key={i} className="h-4 w-4 text-yellow-400" />
                        ))}
                      </div>
                    </div>

                    <div className="mt-3 text-sm text-muted-foreground">
                      {content ? content : "Nội dung đánh giá sẽ hiển thị ở đây khi bạn nhập."}
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <div className="text-sm font-medium">{reviewer ? reviewer : "Người đánh giá"}</div>
                      <div className={`text-xs px-2 py-1 rounded ${active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                        {active ? "Kích hoạt" : "Tạm ẩn"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-xs text-muted-foreground">
                Lưu ý: đây là bản xem trước. Khi nhấn Lưu, đánh giá sẽ được tạo (mô phỏng).
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AddBookReview;