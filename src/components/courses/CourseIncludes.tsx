import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Book, FileText, Clock, FilePlus, Image, Link as LinkIcon, Play } from "lucide-react";

type BuiltInIconKey = "Book" | "FileText" | "Clock" | "FilePlus" | "Play" | "Image" | "Link";

const BUILT_IN_ICONS: Record<BuiltInIconKey, React.ComponentType<any>> = {
  Book,
  FileText,
  Clock,
  FilePlus,
  Play,
  Image,
  Link: LinkIcon,
};

interface CustomInclude {
  id: string;
  label: string;
  iconType: "built-in" | "svg";
  builtInKey?: BuiltInIconKey;
  svgUrl?: string; // data URL from uploaded SVG
}

const CourseIncludes: React.FC = () => {
  // Fixed fields state
  const [topics, setTopics] = React.useState<string>("12");
  const [lessons, setLessons] = React.useState<string>("150");
  const [exercises, setExercises] = React.useState<string>("200+");
  const [hours, setHours] = React.useState<string>("400+");

  // Custom fields state
  const [customLabel, setCustomLabel] = React.useState<string>("");
  const [customIconType, setCustomIconType] = React.useState<"built-in" | "svg">("built-in");
  const [selectedBuiltIn, setSelectedBuiltIn] = React.useState<BuiltInIconKey>("Book");
  const [uploadedSvgUrl, setUploadedSvgUrl] = React.useState<string>("");

  const [customItems, setCustomItems] = React.useState<CustomInclude[]>([]);

  const svgInputRef = React.useRef<HTMLInputElement | null>(null);

  const handleUploadSvg = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.includes("svg") && !file.name.toLowerCase().endsWith(".svg")) {
      toast.error("Vui lòng chọn file SVG.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result || "");
      setUploadedSvgUrl(result);
      toast.success("SVG đã được tải lên và xem trước.");
    };
    reader.readAsDataURL(file);
  };

  const handleAddCustom = () => {
    const label = customLabel.trim();
    if (!label) {
      toast.error("Vui lòng nhập nội dung cho mục bổ sung.");
      return;
    }
    if (customIconType === "svg" && !uploadedSvgUrl) {
      toast.error("Vui lòng tải lên một file SVG trước khi thêm.");
      return;
    }

    const newItem: CustomInclude = {
      id: `ci-${Date.now()}`,
      label,
      iconType: customIconType,
      builtInKey: customIconType === "built-in" ? selectedBuiltIn : undefined,
      svgUrl: customIconType === "svg" ? uploadedSvgUrl : undefined,
    };

    setCustomItems((prev) => [...prev, newItem]);
    setCustomLabel("");
    setUploadedSvgUrl("");
    if (svgInputRef.current) svgInputRef.current.value = "";
    setCustomIconType("built-in");
    setSelectedBuiltIn("Book");
    toast.success("Đã thêm mục 'Khóa học bao gồm'.");
  };

  const handleRemoveCustom = (id: string) => {
    setCustomItems((prev) => prev.filter((c) => c.id !== id));
    toast.success("Đã xóa mục.");
  };

  const renderIcon = (item: CustomInclude | { iconType: "built-in"; builtInKey: BuiltInIconKey } | null) => {
    if (!item) return null;
    if (item.iconType === "built-in") {
      const Comp = BUILT_IN_ICONS[item.builtInKey as BuiltInIconKey];
      return <Comp className="h-5 w-5 text-gray-600" />;
    }
    if (item.iconType === "svg" && item.svgUrl) {
      return <img src={item.svgUrl} alt="svg" className="h-5 w-5 object-contain" />;
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Khóa học bao gồm</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {/* Fixed 4 rows */}
          <div className="space-y-2">
            {/* Each row: left = icon+title (natural width), right = input (flex-1, fills remaining) */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-3 flex-shrink-0">
                <Book className="h-5 w-5 text-gray-600" />
                <div className="text-sm text-gray-700 whitespace-nowrap">Số chuyên đề</div>
              </div>
              <div className="flex-1 min-w-0">
                <Input value={topics} onChange={(e) => setTopics(e.target.value)} className="w-full" />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-3 flex-shrink-0">
                <FileText className="h-5 w-5 text-gray-600" />
                <div className="text-sm text-gray-700 whitespace-nowrap">Số bài học</div>
              </div>
              <div className="flex-1 min-w-0">
                <Input value={lessons} onChange={(e) => setLessons(e.target.value)} className="w-full" />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-3 flex-shrink-0">
                <FilePlus className="h-5 w-5 text-gray-600" />
                <div className="text-sm text-gray-700 whitespace-nowrap">Số bài tập</div>
              </div>
              <div className="flex-1 min-w-0">
                <Input value={exercises} onChange={(e) => setExercises(e.target.value)} className="w-full" />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-3 flex-shrink-0">
                <Clock className="h-5 w-5 text-gray-600" />
                <div className="text-sm text-gray-700 whitespace-nowrap">Số giờ học</div>
              </div>
              <div className="flex-1 min-w-0">
                <Input value={hours} onChange={(e) => setHours(e.target.value)} className="w-full" />
              </div>
            </div>
          </div>

          <hr className="my-2" />

          {/* Add custom items */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium">Thêm mục tùy chỉnh</div>
              <div className="text-xs text-muted-foreground">Bạn có thể chọn icon có sẵn hoặc tải file SVG</div>
            </div>

            <div className="grid grid-cols-1 gap-2">
              <div className="flex items-center gap-2">
                <Label className="whitespace-nowrap">Icon</Label>
                <select
                  value={customIconType}
                  onChange={(e) => setCustomIconType(e.target.value as "built-in" | "svg")}
                  className="rounded border px-2 py-1 text-sm"
                >
                  <option value="built-in">Chọn icon có sẵn</option>
                  <option value="svg">Tải lên SVG</option>
                </select>
              </div>

              {customIconType === "built-in" ? (
                <div className="flex items-center gap-2">
                  <Label>Chọn</Label>
                  <select
                    value={selectedBuiltIn}
                    onChange={(e) => setSelectedBuiltIn(e.target.value as BuiltInIconKey)}
                    className="rounded border px-2 py-1 text-sm"
                  >
                    {Object.keys(BUILT_IN_ICONS).map((k) => (
                      <option key={k} value={k}>
                        {k}
                      </option>
                    ))}
                  </select>
                  <div className="ml-2">
                    {/* preview */}
                    {React.createElement(BUILT_IN_ICONS[selectedBuiltIn], { className: "h-5 w-5 text-gray-600" })}
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Label>Tải SVG</Label>
                  <input ref={svgInputRef} type="file" accept=".svg" onChange={handleUploadSvg} />
                  {uploadedSvgUrl && <img src={uploadedSvgUrl} alt="preview" className="h-6 w-6" />}
                </div>
              )}

              <div className="flex items-center gap-2">
                <Label className="whitespace-nowrap">Nội dung</Label>
                <Input value={customLabel} onChange={(e) => setCustomLabel(e.target.value)} className="flex-1" />
                <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={handleAddCustom}>
                  Thêm
                </Button>
              </div>
            </div>
          </div>

          {/* Render custom items */}
          {customItems.length > 0 && (
            <div className="mt-3 space-y-2">
              {customItems.map((it) => (
                <div key={it.id} className="flex items-center gap-3 justify-between border rounded px-3 py-2 bg-white dark:bg-gray-800">
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="flex-shrink-0">
                      {it.iconType === "built-in" && it.builtInKey ? (
                        React.createElement(BUILT_IN_ICONS[it.builtInKey], { className: "h-5 w-5 text-gray-600" })
                      ) : it.svgUrl ? (
                        <img src={it.svgUrl} alt={it.label} className="h-5 w-5 object-contain" />
                      ) : (
                        <Image className="h-5 w-5 text-gray-600" />
                      )}
                    </div>
                    <div className="text-sm">{it.label}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleRemoveCustom(it.id)} className="text-red-600">
                      Xóa
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseIncludes;