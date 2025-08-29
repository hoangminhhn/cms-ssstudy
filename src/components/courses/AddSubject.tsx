import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const MOCK_TEACHERS = [
  { id: "gv1", name: "Giáo viên A" },
  { id: "gv2", name: "Giáo viên B" },
  { id: "gv3", name: "Giáo viên C" },
];

const MOCK_ASSISTANTS = [
  { id: "tg1", name: "Trợ giảng X" },
  { id: "tg2", name: "Trợ giảng Y" },
];

const AddSubject: React.FC = () => {
  const navigate = useNavigate();

  const [name, setName] = React.useState("");
  const [code, setCode] = React.useState("");
  const [fbLink, setFbLink] = React.useState("");
  const [teacher, setTeacher] = React.useState<string>(""); // empty means no selection
  const [assistant, setAssistant] = React.useState<string>("");
  const [order, setOrder] = React.useState<number | "">(0);
  const [mode, setMode] = React.useState<"Offline" | "Online">("Offline");
  const [display, setDisplay] = React.useState<"hidden" | "visible">("hidden");

  const resetForm = () => {
    setName("");
    setCode("");
    setFbLink("");
    setTeacher("");
    setAssistant("");
    setOrder(0);
    setMode("Offline");
    setDisplay("hidden");
  };

  const validate = () => {
    if (!name.trim()) {
      toast.error("Vui lòng nhập tên môn học.");
      return false;
    }
    if (!code.trim()) {
      toast.error("Vui lòng nhập mã môn học.");
      return false;
    }
    if (order !== "" && Number(order) < 0) {
      toast.error("Thứ tự phải là số >= 0.");
      return false;
    }
    return true;
  };

  const handleSave = (andAddNew = false) => {
    if (!validate()) return;

    const payload = {
      id: `s-${Date.now()}`,
      name: name.trim(),
      code: code.trim(),
      fbLink: fbLink.trim(),
      teacher,
      assistant,
      order: order === "" ? 0 : Number(order),
      mode,
      display,
      updatedAt: new Date().toLocaleString(),
    };

    console.log("Saving subject (demo):", payload);
    toast.success("Đã lưu môn học.");

    if (andAddNew) {
      resetForm();
      const el = document.getElementById("subject-name");
      if (el) (el as HTMLInputElement).focus();
      return;
    }

    navigate("/courses?tab=subjects");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Thêm môn học mới</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-8 gap-4 items-start">
            <div className="lg:col-span-4">
              <div className="mb-4">
                <Label htmlFor="subject-name">Tên môn học</Label>
                <Input id="subject-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nhập tên môn học" />
              </div>

              <div className="mb-4">
                <Label htmlFor="subject-code">Mã môn học</Label>
                <Input id="subject-code" value={code} onChange={(e) => setCode(e.target.value)} placeholder="Nhập mã môn học" />
              </div>

              <div className="mb-4">
                <Label htmlFor="fb-link">Link Messenger FB</Label>
                <Input id="fb-link" value={fbLink} onChange={(e) => setFbLink(e.target.value)} placeholder="https://m.me/..." />
              </div>

              <div className="mb-4">
                <Label>Giáo viên</Label>
                <Select value={teacher} onValueChange={setTeacher}>
                  <SelectTrigger>
                    <SelectValue placeholder="-- Chọn giáo viên --" />
                  </SelectTrigger>
                  <SelectContent>
                    {MOCK_TEACHERS.map((t) => (
                      <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="mb-4">
                <Label>Trợ giảng</Label>
                <Select value={assistant} onValueChange={setAssistant}>
                  <SelectTrigger>
                    <SelectValue placeholder="-- Chọn trợ giảng --" />
                  </SelectTrigger>
                  <SelectContent>
                    {MOCK_ASSISTANTS.map((a) => (
                      <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="lg:col-span-4">
              <div className="mb-4">
                <Label htmlFor="order">Thứ tự</Label>
                <Input id="order" type="number" value={order === "" ? "" : String(order)} onChange={(e) => setOrder(e.target.value === "" ? "" : Number(e.target.value))} />
              </div>

              <div className="mb-4">
                <Label>Hình thức học</Label>
                <div className="mt-2">
                  <RadioGroup value={mode} onValueChange={(v) => setMode(v as "Offline" | "Online")} className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="Offline" id="mode-offline" />
                      <Label htmlFor="mode-offline" className="cursor-pointer">Offline</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="Online" id="mode-online" />
                      <Label htmlFor="mode-online" className="cursor-pointer">Online</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>

              <div className="mb-4">
                <Label>Hiển thị</Label>
                <div className="mt-2">
                  <RadioGroup value={display} onValueChange={(v) => setDisplay(v as "hidden" | "visible")} className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="hidden" id="display-hidden" />
                      <Label htmlFor="display-hidden" className="cursor-pointer">Ẩn</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="visible" id="display-visible" />
                      <Label htmlFor="display-visible" className="cursor-pointer">Hiện</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>

              <div className="mt-8 flex justify-end gap-3">
                <Button variant="outline" onClick={() => navigate("/courses?tab=subjects")}>Hủy</Button>
                <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={() => handleSave(false)}>Lưu</Button>
                <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={() => handleSave(true)}>Lưu & Thêm mới</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddSubject;