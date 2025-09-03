import React, { useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const GROUP_OPTIONS = ["Super Admin", "Biên tập viên", "Giáo viên", "Hỗ trợ"];

const AddAdmin: React.FC = () => {
  const coverRef = useRef<HTMLInputElement | null>(null);
  const avatarRef = useRef<HTMLInputElement | null>(null);

  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [group, setGroup] = useState<string>(GROUP_OPTIONS[0]);
  const [totalClasses, setTotalClasses] = useState<number | "">(0);
  const [totalStudents, setTotalStudents] = useState<number | "">(0);
  const [showProfile, setShowProfile] = useState<"show" | "hide">("show");
  const [password, setPassword] = useState("");
  const [facebookLink, setFacebookLink] = useState("");

  const [shortDesc, setShortDesc] = useState<string>("");
  const [fullContent, setFullContent] = useState<string>("");

  const onPickCover = () => coverRef.current?.click();
  const onPickAvatar = () => avatarRef.current?.click();

  const onCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => setCoverPreview(String(reader.result));
    reader.readAsDataURL(f);
  };

  const onAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => setAvatarPreview(String(reader.result));
    reader.readAsDataURL(f);
  };

  const handleCancel = () => {
    setCoverPreview(null);
    setAvatarPreview(null);
    setName("");
    setPhone("");
    setEmail("");
    setGroup(GROUP_OPTIONS[0]);
    setTotalClasses(0);
    setTotalStudents(0);
    setShowProfile("show");
    setPassword("");
    setFacebookLink("");
    setShortDesc("");
    setFullContent("");
    if (coverRef.current) coverRef.current.value = "";
    if (avatarRef.current) avatarRef.current.value = "";
    toast.info("Đã hủy thay đổi.");
  };

  const handleSave = () => {
    // Basic validation
    if (!name.trim()) {
      toast.error("Vui lòng nhập tên quản trị viên.");
      return;
    }
    if (!email.trim()) {
      toast.error("Vui lòng nhập email.");
      return;
    }

    const payload = {
      coverPreview,
      avatarPreview,
      name,
      phone,
      email,
      group,
      totalClasses: Number(totalClasses) || 0,
      totalStudents: Number(totalStudents) || 0,
      showProfile,
      password,
      facebookLink,
      shortDesc,
      fullContent,
    };

    console.log("Save admin payload:", payload);
    toast.success("Đã lưu quản trị viên (demo).");
    // reset or keep depending on desired UX
    handleCancel();
  };

  const quillModules = {
    toolbar: [
      [{ font: [] }, { size: [] }],
      ["bold", "italic", "underline", "strike"],
      [{ color: [] }, { background: [] }],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ align: [] }],
      ["link", "image"],
      ["clean"],
    ],
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Ảnh và thông tin</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
            {/* Uploads */}
            <div className="lg:col-span-3 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="border-dashed border-2 border-orange-200 rounded p-3 flex flex-col items-center justify-center min-h-[120px]">
                  {coverPreview ? (
                    <img src={coverPreview} alt="cover" className="max-h-24 object-contain rounded" />
                  ) : (
                    <div className="text-sm text-muted-foreground">Ảnh trang chủ</div>
                  )}
                  <input ref={coverRef} type="file" accept="image/*" className="hidden" onChange={onCoverChange} />
                  <Button variant="outline" className="mt-3" onClick={onPickCover}>Ảnh trang chủ</Button>
                </div>

                <div className="border-dashed border-2 border-orange-200 rounded p-3 flex flex-col items-center justify-center min-h-[120px]">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="avatar" className="h-20 w-20 object-cover rounded-full" />
                  ) : (
                    <div className="text-sm text-muted-foreground">Ảnh đại diện</div>
                  )}
                  <input ref={avatarRef} type="file" accept="image/*" className="hidden" onChange={onAvatarChange} />
                  <Button variant="outline" className="mt-3" onClick={onPickAvatar}>Ảnh đại diện</Button>
                </div>
              </div>
            </div>

            {/* Fields */}
            <div className="lg:col-span-9">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <div>
                  <Label>Tên quản trị viên</Label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Tên quản trị viên" />
                </div>
                <div>
                  <Label>Số điện thoại</Label>
                  <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Số điện thoại" />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
                </div>

                <div>
                  <Label>Nhóm</Label>
                  <Select value={group} onValueChange={setGroup}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {GROUP_OPTIONS.map((g) => (
                        <SelectItem key={g} value={g}>{g}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Tổng số lớp</Label>
                  <Input type="number" value={String(totalClasses)} onChange={(e) => setTotalClasses(e.target.value === "" ? "" : Number(e.target.value))} />
                </div>

                <div>
                  <Label>Tổng số học sinh</Label>
                  <Input type="number" value={String(totalStudents)} onChange={(e) => setTotalStudents(e.target.value === "" ? "" : Number(e.target.value))} />
                </div>

                <div className="md:col-span-2">
                  <Label>Mật khẩu</Label>
                  <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mật khẩu" />
                </div>

                <div>
                  <Label>Link Facebook</Label>
                  <Input value={facebookLink} onChange={(e) => setFacebookLink(e.target.value)} placeholder="https://facebook.com/..." />
                </div>

                <div className="flex items-center gap-4">
                  <Label className="mr-2">Hiển thị profile</Label>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <input
                        id="show-profile"
                        name="showProfile"
                        type="radio"
                        checked={showProfile === "show"}
                        onChange={() => setShowProfile("show")}
                        className="h-4 w-4"
                      />
                      <label htmlFor="show-profile">Hiển thị</label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        id="hide-profile"
                        name="showProfile"
                        type="radio"
                        checked={showProfile === "hide"}
                        onChange={() => setShowProfile("hide")}
                        className="h-4 w-4"
                      />
                      <label htmlFor="hide-profile">Ẩn</label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Short description */}
      <div>
        <Label className="text-orange-600 mb-2 block">Mô tả ngắn</Label>
        <div className="border rounded bg-white">
          <ReactQuill value={shortDesc} onChange={setShortDesc} modules={quillModules} />
        </div>
      </div>

      {/* Full content */}
      <div>
        <Label className="text-orange-600 mb-2 block">Nội dung chi tiết</Label>
        <div className="border rounded bg-white">
          <ReactQuill value={fullContent} onChange={setFullContent} modules={quillModules} />
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-end gap-3 p-2">
        <Button variant="outline" onClick={handleCancel}>HỦY</Button>
        <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={handleSave}>LƯU</Button>
      </div>
    </div>
  );
};

export default AddAdmin;