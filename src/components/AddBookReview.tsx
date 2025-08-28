import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Star } from "lucide-react";

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

  const selectedBook = SAMPLE_BOOKS.find((b) => b.id === bookId) ?? null;

  const resetForm = () => {
    setBookId("");
    setReviewer("");
    setStars(5);
    setContent("");
    setActive(true);
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
      updatedAt: new Date().toLocaleString(),
    };

    console.log("Saved review:", payload);
    toast.success("Đã thêm đánh giá sách.");
    resetForm();
  };

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

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
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

              <div className="sm:col-span-2 flex items-end justify-end">
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