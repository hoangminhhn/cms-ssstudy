import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { UploadCloud } from 'lucide-react';

const WordExamUpload: React.FC = () => {
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [selectedTemplate, setSelectedTemplate] = React.useState<string>('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    } else {
      setSelectedFile(null);
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      console.log('Uploading file:', selectedFile.name);
      console.log('Selected template:', selectedTemplate);
      // TODO: Implement actual file upload and backend processing here
      alert('Chức năng tải lên và xử lý file Word sẽ được triển khai ở phía backend sau khi tích hợp cơ sở dữ liệu (ví dụ: Supabase).');
    } else {
      alert('Vui lòng chọn một file Word để tải lên.');
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Tạo đề thi từ file Word</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="word-file">Chọn file Word (.docx)</Label>
              <div className="flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 text-center min-h-[120px] relative">
                <Input
                  id="word-file"
                  type="file"
                  accept=".docx"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={handleFileChange}
                />
                <div className="flex flex-col items-center">
                  <UploadCloud className="h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Kéo và thả file vào đây hoặc <span className="text-orange-600 font-medium">nhấp để chọn file</span>
                  </p>
                  {selectedFile && (
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                      Đã chọn: {selectedFile.name}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="exam-template">Chọn template đề thi</Label>
              <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                <SelectTrigger id="exam-template">
                  <SelectValue placeholder="-- Chọn template --" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="template-a">Template A (Kỳ thi THPT Quốc gia)</SelectItem>
                  <SelectItem value="template-b">Template B (Kỳ thi Học sinh giỏi)</SelectItem>
                  <SelectItem value="template-c">Template C (Đề kiểm tra định kỳ)</SelectItem>
                  {/* Add more templates as needed */}
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground mt-2">
                Template sẽ giúp hệ thống nhận diện cấu trúc câu hỏi và đáp án trong file Word của bạn.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {selectedTemplate === 'template-a' && (
        <Card>
          <CardHeader>
            <CardTitle>Cấu trúc đề thi THPT Quốc gia</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border rounded-md p-4 bg-gray-50 dark:bg-gray-800">
                <h3 className="font-semibold text-lg mb-2">Phần 1: Nghe hiểu</h3>
                <p className="text-sm text-muted-foreground">
                  (Placeholder cho các tùy chọn cấu hình hoặc thông tin về phần này)
                </p>
              </div>
              <div className="border rounded-md p-4 bg-gray-50 dark:bg-gray-800">
                <h3 className="font-semibold text-lg mb-2">Phần 2: Đọc hiểu</h3>
                <p className="text-sm text-muted-foreground">
                  (Placeholder cho các tùy chọn cấu hình hoặc thông tin về phần này)
                </p>
              </div>
              <div className="border rounded-md p-4 bg-gray-50 dark:bg-gray-800">
                <h3 className="font-semibold text-lg mb-2">Phần 3: Viết</h3>
                <p className="text-sm text-muted-foreground">
                  (Placeholder cho các tùy chọn cấu hình hoặc thông tin về phần này)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Footer Buttons */}
      <div className="flex justify-end gap-2 p-4 border-t bg-gray-50 dark:bg-gray-800">
        <Button variant="outline">HỦY</Button>
        <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={handleUpload}>
          TẢI LÊN VÀ XỬ LÝ
        </Button>
      </div>
    </div>
  );
};

export default WordExamUpload;