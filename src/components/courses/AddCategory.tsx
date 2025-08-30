import React, { useRef, useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";

const AddCategory: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [order, setOrder] = useState<number>(0);
  const [showOnHomepage, setShowOnHomepage] = useState<"show" | "hide">("hide");
  const [status, setStatus] = useState<"active" | "hidden">("active");

  // image and banner
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const bannerInputRef = useRef<HTMLInputElement | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);

  useEffect(() => {
    return () => {
      // revoke object URLs if any
      if (imagePreview) URL.revokeObjectURL(imagePreview);
      if (bannerPreview) URL.revokeObjectURL(bannerPreview);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onPickImage = () => imageInputRef.current?.click();
  const onPickBanner = () => bannerInputRef.current?.click();

  const onImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setImageFile(f);
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
      setImagePreview(null);
    }
    if (f) {
      const url = URL.createObjectURL(f);
      setImagePreview(url);
    }
  };

  const onBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setBannerFile(f);
    if (bannerPreview) {
      URL.revokeObjectURL(bannerPreview);
      setBannerPreview(null);
    }
    if (f) {
      const url = URL.createObjectURL(f);
      setBannerPreview(url);
    }
  };

  const handleSave = () => {
    const trimmed = name.trim();
    if (!trimmed) {
      toast.error("Vui lòng nhập tên danh mục.");
      return;
    }

    // Build payload (demo)
    const payload = {
      id: `cat-${Date.now()}`,
      name: trimmed,
      order,
      showOnHomepage,
      status,
      imageFileName: imageFile?.name ?? null,
      bannerFileName: bannerFile?.name ?? null,
      updatedAt: new Date().toLocaleString(),
    };

    console.log("Save category payload:", payload);
    toast.success("Đã lưu danh mục.");
    // Reset form (optional)
    setName("");
    setOrder(0);
    setShowOnHomepage("hide");
    setStatus("active");
    setImageFile(null);
    setBannerFile(null);
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
      setImagePreview(null);
    }
    if (bannerPreview) {
      URL.revokeObjectURL(bannerPreview);
      setBannerPreview(null);
    }
    if (imageInputRef.current) imageInputRef.current.value = "";
    if (bannerInputRef.current) bannerInputRef.current.value = "";
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Thêm mới Danh mục lớp</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left column */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="category-name">Tên</Label>
                <Input
                  id="category-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nhập tên danh mục"
                />
              </div>

              <div>
                <Label>Hình ảnh</Label>
                <div className="flex items-center gap-4">
                  <div>
                    <input
                      ref={imageInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={onImageChange}
                    />
                    <Button variant="outline" onClick={onPickImage}>Choose File</Button>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {imageFile?.name ?? "No file chosen"}
                  </div>
                </div>

                {imagePreview && (
                  <div className="mt-2">
                    <img src={imagePreview} alt="preview" className="max-h-28 rounded border" />
                  </div>
                )}
              </div>

              <div>
                <Label className="mb-2 block">Hiện ở trang chủ</Label>
                <RadioGroup value={showOnHomepage} onValueChange={(v) => setShowOnHomepage(v as "show" | "hide")}>
                  <div className="flex items-center gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <RadioGroupItem value="show" id="homepage-show" />
                      <span className="text-sm">Hiển thị</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <RadioGroupItem value="hide" id="homepage-hide" />
                      <span className="text-sm">Ẩn</span>
                    </label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label className="mb-2 block">Trạng thái</Label>
                <RadioGroup value={status} onValueChange={(v) => setStatus(v as "active" | "hidden")}>
                  <div className="flex items-center gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <RadioGroupItem value="active" id="status-active" />
                      <span className="text-sm">Hiển thị</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <RadioGroupItem value="hidden" id="status-hidden" />
                      <span className="text-sm">Ẩn</span>
                    </label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            {/* Right column */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="order">Thứ tự</Label>
                <Input
                  id="order"
                  type="number"
                  value={order}
                  onChange={(e) => setOrder(Number(e.target.value || 0))}
                />
              </div>

              <div>
                <Label>Banner</Label>
                <div className="flex items-center gap-4">
                  <div>
                    <input
                      ref={bannerInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={onBannerChange}
                    />
                    <Button variant="outline" onClick={onPickBanner}>Choose File</Button>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {bannerFile?.name ?? "No file chosen"}
                  </div>
                </div>

                {bannerPreview && (
                  <div className="mt-2">
                    <img src={bannerPreview} alt="banner preview" className="max-h-28 rounded border" />
                  </div>
                )}
              </div>

              {/* spacer for alignment */}
              <div className="h-24" />
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={handleSave}>Lưu</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddCategory;