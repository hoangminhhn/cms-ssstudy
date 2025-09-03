import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Book, FileText, Clock, FilePlus, Image, Link as LinkIcon, Play } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

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
  builtInKey: BuiltInIconKey;
}

const AVAILABLE_ICON_KEYS = Object.keys(BUILT_IN_ICONS) as BuiltInIconKey[];

const CourseIncludes: React.FC = () => {
  // Fixed fields state start empty; placeholders will show examples
  const [topics, setTopics] = React.useState<string>("");
  const [lessons, setLessons] = React.useState<string>("");
  const [exercises, setExercises] = React.useState<string>("");
  const [hours, setHours] = React.useState<string>("");

  // Custom fields state
  const [customLabel, setCustomLabel] = React.useState<string>("");
  const [selectedIconForNew, setSelectedIconForNew] = React.useState<BuiltInIconKey>("Book");

  const [customItems, setCustomItems] = React.useState<CustomInclude[]>([]);

  // dialogOpenId: null | "new" | itemId
  const [dialogOpenId, setDialogOpenId] = React.useState<string | null>(null);

  const handleAddCustom = () => {
    const label = customLabel.trim();
    if (!label) {
      toast.error("Vui lòng nhập nội dung cho mục bổ sung.");
      return;
    }

    const newItem: CustomInclude = {
      id: `ci-${Date.now()}`,
      label,
      builtInKey: selectedIconForNew,
    };

    setCustomItems((prev) => [...prev, newItem]);
    setCustomLabel("");
    setSelectedIconForNew("Book");
    toast.success("Đã thêm mục 'Khóa học bao gồm'.");
  };

  const handleRemoveCustom = (id: string) => {
    setCustomItems((prev) => prev.filter((c) => c.id !== id));
    toast.success("Đã xóa mục.");
  };

  const handleUpdateItemIcon = (id: string, key: BuiltInIconKey) => {
    setCustomItems((prev) => prev.map((it) => (it.id === id ? { ...it, builtInKey: key } : it)));
    setDialogOpenId(null);
    toast.success("Đã cập nhật icon.");
  };

  const handleUpdateNewIcon = (key: BuiltInIconKey) => {
    setSelectedIconForNew(key);
    setDialogOpenId(null);
  };

  // helper to render the modal content
  const renderIconPickerContent = (targetId: string | null) => {
    const isForNew = targetId === "new";
    const currentKey = isForNew ? selectedIconForNew : customItems.find((it) => it.id === targetId)?.builtInKey;

    return (
      <div className="p-2">
        <div className="grid grid-cols-4 gap-2">
          {AVAILABLE_ICON_KEYS.map((k) => (
            <button
              key={k}
              onClick={() => {
                if (isForNew) {
                  handleUpdateNewIcon(k);
                } else if (targetId) {
                  handleUpdateItemIcon(targetId, k);
                }
              }}
              className={cn(
                "p-3 rounded-md flex items-center justify-center hover:bg-gray-100",
                k === currentKey ? "ring-2 ring-orange-300" : ""
              )}
              aria-label={`Chọn icon ${k}`}
              title={k}
            >
              {React.createElement(BUILT_IN_ICONS[k], { className: "h-6 w-6 text-gray-700" })}
            </button>
          ))}
        </div>
      </div>
    );
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
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-3 flex-shrink-0">
                <Book className="h-5 w-5 text-gray-600" />
                <div className="text-sm text-gray-700 whitespace-nowrap">Số chuyên đề</div>
              </div>
              <div className="flex-1 min-w-0">
                <Input
                  value={topics}
                  onChange={(e) => setTopics(e.target.value)}
                  placeholder="Ví dụ: 20+ Chuyên đề"
                  className="w-full"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-3 flex-shrink-0">
                <FileText className="h-5 w-5 text-gray-600" />
                <div className="text-sm text-gray-700 whitespace-nowrap">Số bài học</div>
              </div>
              <div className="flex-1 min-w-0">
                <Input
                  value={lessons}
                  onChange={(e) => setLessons(e.target.value)}
                  placeholder="Ví dụ: 150+ Bài học"
                  className="w-full"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-3 flex-shrink-0">
                <FilePlus className="h-5 w-5 text-gray-600" />
                <div className="text-sm text-gray-700 whitespace-nowrap">Số bài tập</div>
              </div>
              <div className="flex-1 min-w-0">
                <Input
                  value={exercises}
                  onChange={(e) => setExercises(e.target.value)}
                  placeholder="Ví dụ: 200+ Bài tập"
                  className="w-full"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-3 flex-shrink-0">
                <Clock className="h-5 w-5 text-gray-600" />
                <div className="text-sm text-gray-700 whitespace-nowrap">Số giờ học</div>
              </div>
              <div className="flex-1 min-w-0">
                <Input
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                  placeholder="Ví dụ: 400+ Giờ học"
                  className="w-full"
                />
              </div>
            </div>
          </div>

          <hr className="my-2" />

          {/* Add custom items: single label + modal icon picker */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium">Thêm mục tùy chỉnh</div>
              <div className="text-xs text-muted-foreground">Nhập nội dung và chọn icon bên cạnh</div>
            </div>

            <div className="flex items-center gap-2">
              <Label className="whitespace-nowrap">Nội dung</Label>

              <div className="flex-1 flex items-center gap-2 min-w-0">
                <Input
                  value={customLabel}
                  onChange={(e) => setCustomLabel(e.target.value)}
                  placeholder="Ví dụ: 20+ Bài giảng livestream tương tác"
                  className="flex-1 min-w-0"
                />

                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => setDialogOpenId("new")}
                      className="h-9 w-9 rounded-md border flex items-center justify-center bg-white hover:bg-gray-50"
                      aria-label="Click để thay đổi icon"
                      title="Click để thay đổi icon"
                    >
                      {React.createElement(BUILT_IN_ICONS[selectedIconForNew], {
                        className: "h-5 w-5 text-gray-600",
                      })}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>click để thay đổi icon</TooltipContent>
                </Tooltip>

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
                  <div className="flex items-center gap-3 flex-shrink-0 min-w-0">
                    <div className="flex items-center gap-2">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            onClick={() => setDialogOpenId(it.id)}
                            className="h-8 w-8 rounded-md flex items-center justify-center bg-gray-100 hover:bg-gray-200"
                            aria-label="Click để thay đổi icon"
                            title="Click để thay đổi icon"
                          >
                            {React.createElement(BUILT_IN_ICONS[it.builtInKey], { className: "h-4 w-4 text-gray-700" })}
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>click để thay đổi icon</TooltipContent>
                      </Tooltip>

                      <div className="text-sm truncate">{it.label}</div>
                    </div>
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

        {/* Dialog used for icon selection (centered) */}
        <Dialog open={dialogOpenId !== null} onOpenChange={(open) => { if (!open) setDialogOpenId(null); }}>
          <DialogContent className="max-w-md w-full">
            <DialogHeader>
              <DialogTitle>Chọn icon</DialogTitle>
            </DialogHeader>

            <div className="mt-2">
              {renderIconPickerContent(dialogOpenId)}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpenId(null)}>Đóng</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default CourseIncludes;