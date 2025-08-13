import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Upload, Download } from 'lucide-react';
import { toast } from 'sonner';

const examPeriods = [
  'Chọn kỳ thi',
  'Kỳ thi HSA',
  'Kỳ thi TSA',
  'Kỳ thi Tốt Nghiệp',
  'Kỳ thi V-ACT',
];

const partsOptions = [
  { value: '', label: 'Chọn phần thi' },
  { value: 'full', label: 'Đủ 3 Phần' },
  { value: 'part1', label: 'Phần 1' },
  { value: 'part2', label: 'Phần 2' },
  { value: 'part3', label: 'Phần 3' },
];

const testTypes = [
  'Không',
  'Thi giữa kỳ 1',
  'Thi cuối kỳ 1',
  'Thi giữa kỳ 2',
  'Thi cuối kỳ 2',
];

const groups = [
  'Mặc định',
  'Thi thử',
];

const classes = [
  'Lớp 1',
  'Lớp 2',
  'Lớp 3',
  'Lớp 4',
  'Lớp 5',
];

const subjects = [
  'Toán',
  'Văn',
  'Tiếng Anh',
  'Vật lí',
  'Sinh học',
];

const allowRetryOptions = [
  'Không cho phép',
  'Có',
];

const cities = [
  'Chọn thành phố',
  'Hà Nội',
  'Hồ Chí Minh',
  'Đà Nẵng',
  'Hải Phòng',
  'Cần Thơ',
  'Nha Trang',
  'Huế',
  'Vũng Tàu',
  'Quảng Ninh',
  'Bình Dương',
];

const AddWordExamForm: React.FC = () => {
  const [examCode] = useState('Tự động');
  const [examName, setExamName] = useState('');
  const [examPeriod, setExamPeriod] = useState('');
  const [part, setPart] = useState('');
  const [pdfLink, setPdfLink] = useState('');
  const [testType, setTestType] = useState('Không');
  const [group, setGroup] = useState('Mặc định');
  const [classLevel, setClassLevel] = useState('Lớp 1');
  const [subject, setSubject] = useState('Toán');
  const [allowRetry, setAllowRetry] = useState('Không cho phép');
  const [city, setCity] = useState('Chọn thành phố');
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (!selectedFile.name.match(/\.(doc|docx)$/i)) {
        toast.error('Chỉ chấp nhận file .doc hoặc .docx');
        e.target.value = '';
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleUpload = () => {
    if (!file) {
      toast.error('Vui lòng chọn file Word để tải lên');
      return;
    }
    // Thực hiện upload file (giả lập)
    toast.success(`Đã tải lên file: ${file.name}`);
    setFile(null);
  };

  const handleDownloadSample = () => {
    const sampleFileName = 'sample-word-exam.docx';
    const link = document.createElement('a');
    link.href = `/${sampleFileName}`;
    link.download = sampleFileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Đang tải file mẫu...');
  };

  const handleSave = () => {
    // Xử lý lưu thông tin đề thi
    toast.success('Đã lưu đề thi mới!');
  };

  return (
    <div className="space-y-6">
      {/* Thông tin đề thi */}
      <Card>
        <CardHeader>
          <CardTitle>Thông tin đề thi</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-8 gap-4">
          <div>
            <Label htmlFor="exam-code">Mã đề thi</Label>
            <Input id="exam-code" value={examCode} disabled />
          </div>
          <div className="md:col-span-2 lg:col-span-3">
            <Label htmlFor="exam-name">Tên đề thi</Label>
            <Input id="exam-name" value={examName} onChange={(e) => setExamName(e.target.value)} placeholder="Nhập tên đề thi" />
          </div>
          <div>
            <Label htmlFor="exam-period">Kỳ thi</Label>
            <Select value={examPeriod} onValueChange={setExamPeriod}>
              <SelectTrigger id="exam-period">
                <SelectValue placeholder="Chọn kỳ thi" />
              </SelectTrigger>
              <SelectContent>
                {examPeriods.map((period) => (
                  <SelectItem key={period} value={period}>{period}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="part">Phần thi</Label>
            <Select value={part} onValueChange={setPart}>
              <SelectTrigger id="part">
                <SelectValue placeholder="Chọn phần thi" />
              </SelectTrigger>
              <SelectContent>
                {partsOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="pdf-link">Đề thi PDF</Label>
            <Input id="pdf-link" value={pdfLink} onChange={(e) => setPdfLink(e.target.value)} placeholder="Nhập URL PDF" />
          </div>
          <div>
            <Label htmlFor="test-type">Loại bài kiểm tra</Label>
            <Select value={testType} onValueChange={setTestType}>
              <SelectTrigger id="test-type">
                <SelectValue placeholder="Chọn loại bài kiểm tra" />
              </SelectTrigger>
              <SelectContent>
                {testTypes.map((type) => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="group">Nhóm đề</Label>
            <Select value={group} onValueChange={setGroup}>
              <SelectTrigger id="group">
                <SelectValue placeholder="Chọn nhóm đề" />
              </SelectTrigger>
              <SelectContent>
                {groups.map((g) => (
                  <SelectItem key={g} value={g}>{g}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="class-level">Lớp</Label>
            <Select value={classLevel} onValueChange={setClassLevel}>
              <SelectTrigger id="class-level">
                <SelectValue placeholder="Chọn lớp" />
              </SelectTrigger>
              <SelectContent>
                {classes.map((cls) => (
                  <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="subject">Môn học</Label>
            <Select value={subject} onValueChange={setSubject}>
              <SelectTrigger id="subject">
                <SelectValue placeholder="Chọn môn học" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map((subj) => (
                  <SelectItem key={subj} value={subj}>{subj}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="allow-retry">Cho phép làm lại</Label>
            <Select value={allowRetry} onValueChange={setAllowRetry}>
              <SelectTrigger id="allow-retry">
                <SelectValue placeholder="Chọn tùy chọn" />
              </SelectTrigger>
              <SelectContent>
                {allowRetryOptions.map((opt) => (
                  <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="city">Thành phố</Label>
            <Select value={city} onValueChange={setCity}>
              <SelectTrigger id="city">
                <SelectValue placeholder="Chọn thành phố" />
              </SelectTrigger>
              <SelectContent>
                {cities.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tải lên file Word */}
      <Card>
        <CardHeader>
          <CardTitle>Tải lên file Word</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row items-center gap-4">
          <input
            type="file"
            accept=".doc,.docx"
            onChange={handleFileChange}
            className="file-input file-input-bordered file-input-primary w-full max-w-xs"
          />
          <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={handleUpload}>
            <Upload className="mr-2 h-4 w-4" /> Tải lên
          </Button>
          <Button variant="outline" onClick={handleDownloadSample}>
            <Download className="mr-2 h-4 w-4" /> Tải đề thi mẫu
          </Button>
        </CardContent>
        <p className="text-sm text-muted-foreground mt-2 px-4">Chỉ chấp nhận các định dạng .doc, .docx</p>
      </Card>

      {/* Danh sách đề thi (hiện chưa có phần thi nào) */}
      <Card>
        <CardHeader>
          <CardTitle>Đề thi</CardTitle>
        </CardHeader>
        <CardContent className="text-center text-muted-foreground py-8">
          Chưa có phần thi nào.
        </CardContent>
      </Card>

      {/* Footer Buttons */}
      <div className="flex justify-end gap-2 p-4 border-t bg-gray-50 dark:bg-gray-800">
        <Button variant="outline">HỦY</Button>
        <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={handleSave}>LƯU</Button>
      </div>
    </div>
  );
};

export default AddWordExamForm;