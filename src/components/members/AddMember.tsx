import React, { useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { Calendar } from "lucide-react";

const AddMember: React.FC = () => {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [avatar, setAvatar] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState<string>("");
  const [school, setSchool] = useState("");
  const [className, setClassName] = useState("");
  const [parentName, setParentName] = useState("");
  const [parentPhone, setParentPhone] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState<"male" | "female">("male");

  const onPickAvatar = () => fileRef.current?.click();

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => setAvatar(String(reader.result));
    reader.readAsDataURL(f);
  };

  const handleCancel = () => {
    setAvatar(null);
    setName("");
    setEmail("");
    setPhone("");
    setDob("");
    setSchool("");
    setClassName("");
    setParentName("");
    setParentPhone("");
    setPassword("");
    setGender("male");
    if (fileRef.current) fileRef.current.value = "";
    toast.info("Đã hủy thay đổi.");
  };

  const handleSave = () => {
    // Minimal validation
    if (!name.trim()) {
      toast.error("Vui lòng nhập tên học sinh.");
      return;
    }
    if (!email.trim()) {
      toast.error("Vui lòng nhập email.");
      return;
    }
    if (!phone.trim()) {
      toast.error("Vui lòng nhập số điện thoại.");
      return;
    }

    const payload = {
      avatar,
      name,
      email,
      phone,
      dob,
      school,
      className,
      parentName,
      parentPhone,
      password,
      gender,
    };

    console.log("Saving member:", payload);
    toast.success("Đã thêm thành viên (demo).");
    handleCancel();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-orange-600">Thông tin chung</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-6 items-start">
            {/* Avatar column */}
            <div>
              <div className="border border-dashed border-orange-300 rounded-md p-4 h-full flex flex-col items-center justify-center">
                <Avatar className="h-36 w-36 mb-3">
                  {avatar ? (
                    <AvatarImage src={avatar} alt={name || "avatar"} />
                  ) : (
                    <AvatarFallback>HS</AvatarFallback>
                  )}
                </Avatar>

                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={onFileChange}
                />

                <div className="w-full">
                  <Button className="w-full bg-white border-orange-300 text-orange-600 hover:bg-orange-50" onClick={onPickAvatar}>
                    Thêm avatar
                  </Button>
                </div>
              </div>
            </div>

            {/* Fields column */}
            <div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-1">
                  <Label htmlFor="name">Tên học sinh</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Họ và tên" />
                </div>
                <div className="md:col-span-1">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@domain.com" />
                </div>
                <div className="md:col-span-1">
                  <Label htmlFor="phone">Số điện thoại</Label>
                  <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="09xxxxxxxx" />
                </div>

                <div className="md:col-span-1">
                  <Label htmlFor="dob">Ngày sinh</Label>
                  <div className="relative">
                    <Input id="dob" type="date" value={dob} onChange={(e) => setDob(e.target.value)} />
                    <Calendar className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
                <div className="md:col-span-1">
                  <Label htmlFor="school">Trường</Label>
                  <Input id="school" value={school} onChange={(e) => setSchool(e.target.value)} placeholder="Tên trường" />
                </div>
                <div className="md:col-span-1">
                  <Label htmlFor="class">Lớp</Label>
                  <Input id="class" value={className} onChange={(e) => setClassName(e.target.value)} placeholder="Lớp" />
                </div>

                <div className="md:col-span-1">
                  <Label htmlFor="parentName">Họ và tên phụ huynh</Label>
                  <Input id="parentName" value={parentName} onChange={(e) => setParentName(e.target.value)} placeholder="Họ tên phụ huynh" />
                </div>
                <div className="md:col-span-1">
                  <Label htmlFor="parentPhone">Số điện thoại phụ huynh</Label>
                  <Input id="parentPhone" value={parentPhone} onChange={(e) => setParentPhone(e.target.value)} placeholder="SĐT phụ huynh" />
                </div>
                <div className="md:col-span-1">
                  <Label htmlFor="password">Mật khẩu</Label>
                  <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mật khẩu" />
                </div>
              </div>

              <div className="mt-4">
                <Label className="mb-2 block">Giới tính</Label>
                <RadioGroup value={gender} onValueChange={(v) => setGender(v as "male" | "female")} className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="male" id="gender-male" />
                    <Label htmlFor="gender-male" className="cursor-pointer select-none">Nam</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="female" id="gender-female" />
                    <Label htmlFor="gender-female" className="cursor-pointer select-none">Nữ</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Footer buttons */}
      <div className="flex justify-end gap-3 p-4 bg-gray-50 rounded-b">
        <Button variant="outline" onClick={handleCancel}>HỦY</Button>
        <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={handleSave}>THÊM THÀNH VIÊN</Button>
      </div>
    </div>
  );
};

export default AddMember;