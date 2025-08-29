import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Upload } from 'lucide-react';
import { toast } from 'sonner';

const categories = ['Giáo trình', 'Bài tập', 'Tài liệu ôn thi'];
const subjects = ['Toán', 'Văn', 'Hóa học', 'Vật lý', 'Tiếng Anh'];
const grades = ['Lớp 10', 'Lớp 11', 'Lớp 12'];

const AddDocumentForm: React.FC = () => {
  const [title, setTitle] = React.useState('');
  const [category, setCategory] = React.useState('');
  const [subject, setSubject] = React.useState('');
  const [grade, setGrade] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [file, setFile] = React.useState<File | null>(null);
  const [isActive, setIsActive] = React.useState(true);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error('Vui lòng nhập tiêu đề tài liệu');
      return;
    }
    
    if (!category) {
      toast.error('Vui lòng chọn danh mục');
      return;
    }
    
    if (!subject) {
      toast.error('Vui lòng chọn môn học');
      return;
    }
    
    if (!grade) {
      toast.error('Vui lòng chọn lớp');
      return;
    }
    
    if (!file) {
      toast.error('Vui lòng chọn tài liệu để tải lên');
      return;
    }

    // In a real app, you would upload the file and save the document data
    console.log({
      title,
      category,
      subject,
      grade,
      description,
      fileName: file?.name,
      fileSize: file?.size,
      isActive
    });

    toast.success('Tài liệu đã được thêm thành công');
    
    // Reset form
    setTitle('');
    setCategory('');
    setSubject('');
    setGrade('');
    setDescription('');
    setFile(null);
    setIsActive(true);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Thông tin tài liệu</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Tiêu đề</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Nhập tiêu đề tài liệu"
                />
              </div>
              
              <div>
                <Label htmlFor="category">Danh mục</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn danh mục" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="subject">Môn học</Label>
                <Select value={subject} onValueChange={setSubject}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn môn học" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((sub) => (
                      <SelectItem key={sub} value={sub}>
                        {sub}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="grade">Lớp</Label>
                <Select value={grade} onValueChange={setGrade}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn lớp" />
                  </SelectTrigger>
                  <SelectContent>
                    {grades.map((gr) => (
                      <SelectItem key={gr} value={gr}>
                        {gr}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label htmlFor="description">Mô tả</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Nhập mô tả tài liệu"
                rows={3}
              />
            </div>
            
            <div>
              <Label htmlFor="file">Tài liệu</Label>
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="file"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-2 text-gray-500" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">PDF, DOC, DOCX, PPT (MAX. 50MB)</p>
                  </div>
                  <input
                    id="file"
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx,.ppt"
                  />
                </label>
              </div>
              {file && (
                <div className="mt-2 text-sm text-gray-600">
                  Đã chọn: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="active"
                checked={isActive}
                onCheckedChange={setIsActive}
              />
              <Label htmlFor="active">Kích hoạt</Label>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline">
                Hủy
              </Button>
              <Button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white">
                Lưu
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddDocumentForm;