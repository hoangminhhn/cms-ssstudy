import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { Book, FileText, ClipboardList, Clock, Video, Monitor } from "lucide-react";

type BuiltinIconKey = "book" | "lessons" | "exercise" | "clock" | "video" | "monitor";

const BUILTIN_ICONS: Record<
  BuiltinIconKey,
  { Component: React.ComponentType<any>; label: string }
> = {
  book: { Component: Book, label: "Sách/Chuyên đề" },
  lessons: { Component: FileText, label: "Bài học" },
  exercise: { Component: ClipboardList, label: "Bài tập" },
  clock: { Component: Clock, label: "Giờ học" },
  video: { Component: Video, label: "Video" },
  monitor: { Component: Monitor, label: "Livestream" },
};

type IconData =
  | { kind: "builtin"; key: BuiltinIconKey }
  | { kind: "svg"; svgString: string };

interface CustomRow {
  id: string;
  icon: IconData;
  text: string;
}

const defaultFixed = [
  { id: "fixed-1", key: "book" as BuiltinIconKey, label: "Số chuyên đề", value: "" },
  { id: "fixed-2", key: "lessons" as BuiltinIconKey, label: "Số bài học", value: "" },
  { id: "fixed-3", key: "exercise" as BuiltinIconKey, label: "Số bài tập", value: "" },
  { id: "fixed-4", key: "clock" as BuiltinIconKey, label: "Số giờ học", value: "" },
];

const IncludedFeatures: React.FC = () => {
  const [fixed, setFixed] = React.useState(
    defaultFixed.map((f) => ({ ...f }))
  );

  const [customRows, setCustomRows] = React.useState<CustomRow[]>([
    // example initial
    // { id: 'c-1', icon: { kind: 'builtin', key: 'video' }, text: 'Hình thức học video và livestream' }
  ]);

  const fileInputRefs = React.useRef<Record<string, HTMLInputElement | null>>(
    {}
  );

  const createId = (prefix = "c") => `${prefix}-${Date.now().toString(36)}-${Math.floor(Math.random() * 1000)}`;

  const handleFixedChange = (id: string, value: string) => {
    setFixed((prev) => prev.map((f) => (f.id === id ? { ...f, value } : f)));
  };

  const addCustomRow = () => {
    const id = createId("c");
    const newRow: CustomRow = {
      id,
      icon: { kind: "builtin", key: "monitor" },
      text: "",
    };
    setCustomRows((p) => [...p, newRow]);
    toast.success("Đã thêm mục mới.");
  };

  const removeCustomRow = (id: string) => {
    setCustomRows((p) => p.filter((r) => r.id !== id));
    toast.success("Đã xóa mục.");
  };

  const updateCustomText = (id: string, text: string) => {
    setCustomRows((p) => p.map((r) => (r.id === id ? { ...r, text } : r)));
  };

  const setBuiltinIcon = (id: string, key: BuiltinIconKey) => {
    setCustomRows((p) => p.map((r) => (r.id === id ? { ...r, icon: { kind: "builtin", key } } : r)));
  };

  const handleUploadSVG = async (id: string, file?: File) => {
    if (!file) {
      toast.error("Không có file.");
      return;
    }
    if (file.type !== "image/svg+xml") {
      toast.error("Vui lòng tải lên file SVG (.svg).");
      return;
    }
    const text = await file.text();
    setCustomRows((p) => p.map((r) => (r.id === id ? { ...r, icon: { kind: "svg", svgString: text } } : r)));
    toast.success("Đã tải lên SVG.");
  };

  const triggerUploadFor = (id: string) => {
    if (!fileInputRefs.current[id]) {
      fileInputRefs.current[id] = null;
    }
    fileInputRefs.current[id]?.click();
  };

  const renderIcon = (icon: IconData, className = "h-5 w-5 text-muted-foreground") => {
    if (icon.kind === "builtin") {
      const Comp = BUILTIN_ICONS[icon.key].Component;
      return <Comp className={className} />;
    }
    // svg string
    return (
      <span
        className={className}
        aria-hidden
        dangerouslySetInnerHTML={{ __html: icon.svgString }}
        style={{ display: "inline-flex", lineHeight: 0 }}
      />
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Khóa học bao gồm</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Fixed rows */}
          <div className="space-y-2">
            {fixed.map((f) => {
              const Comp = BUILTIN_ICONS[f.key].Component;
              return (
                <div key={f.id} className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded text-orange-600 bg-orange-50">
                    <Comp className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-muted-foreground mb-1">{f.label}</div>
                    <Input
                      value={f.value}
                      onChange={(e) => handleFixedChange(f.id, e.target.value)}
                      placeholder={`Nhập ${f.label.toLowerCase()} (vd. 12, 150, 40+)`}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <hr />

          {/* Custom rows */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div>
                <div className="text-sm font-medium">Các mục bổ sung</div>
                <div className="text-xs text-muted-foreground">Thêm thông tin bổ sung, chọn icon hoặc tải lên SVG</div>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" onClick={addCustomRow}>
                  + Thêm mục
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              {customRows.length === 0 && (
                <div className="text-sm text-muted-foreground p-4 border rounded">Chưa có mục bổ sung nào.</div>
              )}

              {customRows.map((r) => (
                <div key={r.id} className="flex items-start gap-3">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-10 h-10 rounded flex items-center justify-center bg-gray-50 dark:bg-gray-700">
                      {renderIcon(r.icon, "h-5 w-5 text-orange-600")}
                    </div>

                    {/* Icon picker: builtins + upload */}
                    <div className="flex flex-col items-center gap-1">
                      <div className="flex gap-1">
                        {(Object.keys(BUILTIN_ICONS) as BuiltinIconKey[]).slice(0, 4).map((k) => {
                          const Comp = BUILTIN_ICONS[k].Component;
                          return (
                            <button
                              key={k}
                              type="button"
                              onClick={() => setBuiltinIcon(r.id, k)}
                              className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                              title={BUILTIN_ICONS[k].label}
                              aria-label={`Chọn icon ${BUILTIN_ICONS[k].label}`}
                            >
                              <Comp className="h-4 w-4 text-muted-foreground" />
                            </button>
                          );
                        })}
                        <button
                          type="button"
                          onClick={() => {
                            // open upload input
                            if (!fileInputRefs.current[r.id]) fileInputRefs.current[r.id] = null;
                            fileInputRefs.current[r.id]?.click();
                          }}
                          className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                          title="Tải SVG"
                          aria-label="Tải SVG"
                        >
                          <Upload className="h-4 w-4 text-muted-foreground" />
                        </button>
                      </div>

                      <input
                        type="file"
                        accept=".svg"
                        className="hidden"
                        ref={(el) => (fileInputRefs.current[r.id] = el)}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleUploadSVG(r.id, file);
                          // reset input so same file can be chosen again if needed
                          e.currentTarget.value = "";
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex-1">
                    <Input
                      value={r.text}
                      onChange={(e) => updateCustomText(r.id, e.target.value)}
                      placeholder="Nhập nội dung (ví dụ: 20+ Đề thi thử...)"
                    />
                    <div className="mt-2 text-xs text-muted-foreground flex items-center gap-2">
                      <span className="italic">Icon hiện tại:</span>
                      <span className="flex items-center gap-2">
                        {renderIcon(r.icon, "h-4 w-4")}
                        <span className="text-sm">{r.icon.kind === "builtin" ? BUILTIN_ICONS[r.icon.key].label : "SVG tải lên"}</span>
                      </span>
                    </div>
                  </div>

                  <div>
                    <Button variant="ghost" size="icon" onClick={() => removeCustomRow(r.id)} className="text-red-600 hover:bg-red-50" aria-label="Xóa mục">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default IncludedFeatures;