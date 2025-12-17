"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { toast } from "sonner";
import { Calendar } from "lucide-react";

const generatePassword = (len = 8) => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
  let out = "";
  for (let i = 0; i < len; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
};

const PracticeConfig: React.FC = () => {
  const [openAt, setOpenAt] = React.useState<string>("");
  const [closeAt, setCloseAt] = React.useState<string>("");
  const [resultPolicy, setResultPolicy] = React.useState<string>("Kết quả: Ngay sau khi nộp");
  const [answerPolicy, setAnswerPolicy] = React.useState<string>("Đáp án: Sau khi đóng đề");
  const [requirePassword, setRequirePassword] = React.useState<boolean>(true);
  const [password, setPassword] = React.useState<string>("");

  // refs to the wrappers so we can find the actual native input inside the Input component
  const openWrapperRef = React.useRef<HTMLDivElement | null>(null);
  const closeWrapperRef = React.useRef<HTMLDivElement | null>(null);

  const focusToggleOnWrapper = (wrapper: HTMLDivElement | null) => {
    if (!wrapper) return;
    const nativeInput = wrapper.querySelector<HTMLInputElement>('input[type="datetime-local"]');
    if (!nativeInput) return;
    // toggle focus: if focused -> blur, else focus
    if (document.activeElement === nativeInput) {
      nativeInput.blur();
    } else {
      nativeInput.focus();
      // for some browsers focusing programmatically may not open picker; try to dispatch a click as well
      try {
        nativeInput.dispatchEvent(new MouseEvent("click", { bubbles: true }));
      } catch {
        // ignore
      }
    }
  };

  const handleGenerate = () => {
    const p = generatePassword(8);
    setPassword(p);
    toast.success("Đã tạo mật khẩu.");
  };

  return (
    <div className="w-full mt-4">
      <div className="rounded-lg border bg-white dark:bg-gray-800 p-4">
        <div className="flex items-center justify-between gap-4">
          <h3 className="text-lg font-semibold">Cấu hình luyện đề thực chiến</h3>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
          {/* Left: Open / Close datetimes */}
          <div className="space-y-3">
            <div>
              <Label className="text-sm">Mở đề</Label>
              <div ref={openWrapperRef} className="relative mt-2">
                <Input
                  type="datetime-local"
                  value={openAt}
                  onChange={(e) => setOpenAt(e.target.value)}
                  className="pr-10"
                  aria-label="Mở đề"
                />
                <button
                  type="button"
                  onClick={() => focusToggleOnWrapper(openWrapperRef.current)}
                  aria-label="Mở/đóng chọn thời gian Mở đề"
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                </button>
              </div>
            </div>

            <div>
              <Label className="text-sm">Đóng đề</Label>
              <div ref={closeWrapperRef} className="relative mt-2">
                <Input
                  type="datetime-local"
                  value={closeAt}
                  onChange={(e) => setCloseAt(e.target.value)}
                  className="pr-10"
                  aria-label="Đóng đề"
                />
                <button
                  type="button"
                  onClick={() => focusToggleOnWrapper(closeWrapperRef.current)}
                  aria-label="Mở/đóng chọn thời gian Đóng đề"
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                </button>
              </div>
            </div>
          </div>

          {/* Middle: Policies selects */}
          <div className="space-y-3">
            <div>
              <Label className="text-sm">Chính sách kết quả/đáp án</Label>
              <div className="mt-2 space-y-2">
                <Select value={resultPolicy} onValueChange={setResultPolicy}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Kết quả: Ngay sau khi nộp">Kết quả: Ngay sau khi nộp</SelectItem>
                    <SelectItem value="Kết quả: Sau khi đóng đề">Kết quả: Sau khi đóng đề</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={answerPolicy} onValueChange={setAnswerPolicy}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Đáp án: Sau khi đóng đề">Đáp án: Sau khi đóng đề</SelectItem>
                    <SelectItem value="Đáp án: Sau khi nộp bài">Đáp án: Sau khi nộp bài</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Right: Password requirement box */}
          <div>
            <div className="border rounded-md p-3 bg-gray-50 dark:bg-gray-900">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">Yêu cầu mật khẩu</div>
                  <div className="text-xs text-muted-foreground">Hiện nút "Mở khóa đề thi" ngoài web</div>
                </div>
                <div>
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={requirePassword}
                      onChange={(e) => setRequirePassword(e.target.checked)}
                      className="sr-only"
                    />
                    <span className="w-9 h-5 bg-gray-200 rounded-full relative inline-block">
                      <span
                        className={`absolute left-0 top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                          requirePassword ? "translate-x-4" : "translate-x-0"
                        }`}
                        aria-hidden
                      />
                    </span>
                  </label>
                </div>
              </div>

              <div className="mt-3 space-y-2">
                <div>
                  <Label className="text-xs">Mật khẩu</Label>
                  <div className="flex items-center gap-2 mt-2">
                    <Input
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Mật khẩu"
                      className="flex-1"
                      aria-label="Mật khẩu"
                    />
                    <Button variant="outline" onClick={handleGenerate}>
                      Tạo
                    </Button>
                  </div>
                  <div className="text-xs text-muted-foreground mt-2">Bạn có thể thay đổi mật khẩu bất cứ lúc nào.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> 
    </div>
  );
};

export default PracticeConfig;