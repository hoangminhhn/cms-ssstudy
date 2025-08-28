import React, { useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Plus } from "lucide-react";

interface VideoItem {
  id: string;
  title: string;
  link: string;
  duration: string;
}

interface LessonPayload {
  id: string;
  title: string;
  free: boolean;
  freeFrom?: string;
  freeTo?: string;
  maxViews: number;
  subject: string;
  chapter: string;
  linkWithAnswer?: string;
  linkWithoutAnswer?: string;
  videos: VideoItem[];
  exam?: string;
  description?: string;
}

interface AddLessonModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (lesson: LessonPayload) => void;
  defaultSubject?: string;
  defaultChapter?: string;
}

const subjects = ["-- Chọn môn học --", "Toán", "Văn", "Tiếng Anh", "Vật lí", "Sinh học"];
const chaptersMock = ["-- Chọn chương học --", "Chương 1", "Chương 2", "Chương 3"];
const examsMock = ["-- Chọn đề thi --", "Đề thi 1", "Đề thi 2", "Đề thi 3"];

const AddLessonModal: React.FC<AddLessonModalProps> = ({ open, onOpenChange, onSave, defaultSubject, defaultChapter }) => {
  const [title, setTitle] = React.useState("");
  const [free, setFree] = React.useState(false);
  const [freeFrom, setFreeFrom] = React.useState<string>("");
  const [freeTo, setFreeTo] = React.useState<string>("");
  const [maxViews, setMaxViews] = React.useState<number>(0);
  const [subject, setSubject] = React.useState<string>(defaultSubject ?? subjects[0]);
  const [chapter, setChapter] = React.useState<string>(defaultChapter ?? chaptersMock[0]);
  const [linkWithAnswer, setLinkWithAnswer] = React.useState<string>("");
  const [linkWithoutAnswer, setLinkWithoutAnswer] = React.useState<string>("");
  const [videos, setVideos] = React.useState<VideoItem[]>([]);
  const [videoTitle, setVideoTitle] = React.useState<string>("");
  const [videoLink, setVideoLink] = React.useState<string>("");
  const [videoDuration, setVideoDuration] = React.useState<string>("");
  const [selectedExam, setSelectedExam] = React.useState<string>(examsMock[0]);
  const [description, setDescription] = React.useState<string>("");

  useEffect(() => {
    if (open) {
      // reset minimal fields when modal opens
      setTitle("");
      setFree(false);
      setFreeFrom("");
      setFreeTo("");
      setMaxViews(0);
      setSubject(defaultSubject ?? subjects[0]);
      setChapter(defaultChapter ?? chaptersMock[0]);
      setLinkWithAnswer("");
      setLinkWithoutAnswer("");
      setVideos([]);
      setVideoTitle("");
      setVideoLink("");
      setVideoDuration("");
      setSelectedExam(examsMock[0]);
      setDescription("");
    }
  }, [open, defaultSubject, defaultChapter]);

  const addVideo = () => {
    if (!videoTitle.trim() || !videoLink.trim()) {
      toast.error("Vui lòng nhập tiêu đề và link video.");
      return;
    }
    const v: VideoItem = {
      id: `v-${Date.now()}`,
      title: videoTitle.trim(),
      link: videoLink.trim(),
      duration: videoDuration.trim(),
    };
    setVideos((prev) => [...prev, v]);
    setVideoTitle("");
    setVideoLink("");
    setVideoDuration("");
    toast.success("Đã thêm video.");
  };

  const removeVideo = (id: string) => {
    setVideos((prev) => prev.filter((v) => v.id !== id));
  };

  const handleSave = () => {
    if (!title.trim()) {
      toast.error("Vui lòng nhập tên bài học.");
      return;
    }
    if (subject === subjects[0]) {
      toast.error("Vui lòng chọn môn học.");
      return;
    }
    if (chapter === chaptersMock[0]) {
      toast.error("Vui lòng chọn chương học.");
      return;
    }

    const payload: LessonPayload = {
      id: `lesson-${Date.now()}`,
      title: title.trim(),
      free,
      freeFrom: free ? freeFrom || undefined : undefined,
      freeTo: free ? freeTo || undefined : undefined,
      maxViews: Number(maxViews) || 0,
      subject,
      chapter,
      linkWithAnswer: linkWithAnswer || undefined,
      linkWithoutAnswer: linkWithoutAnswer || undefined,
      videos,
      exam: selectedExam === examsMock[0] ? undefined : selectedExam,
      description,
    };

    onSave(payload);
    onOpenChange(false);
    toast.success("Đã thêm bài học.");
  };

  return (
    <Dialog open={open} onOpenChange={(o) => onOpenChange(o)}>
      <DialogContent className="max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-xl text-orange-600 font-semibold">Thông tin bài học</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label className="text-xs">TÊN BÀI HỌC</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Tên bài học" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
            <div className="flex items-center gap-3">
              <Label className="text-sm">Miễn phí</Label>
              <div className="flex items-center gap-2">
                <label className="flex items-center gap-2">
                  <input type="radio" name="free" checked={free === true} onChange={() => setFree(true)} />
                  <span>Có</span>
                </label>
                <label className="flex items-center gap-2 ml-3">
                  <input type="radio" name="free" checked={free === false} onChange={() => setFree(false)} />
                  <span>Không</span>
                </label>
              </div>
            </div>

            <div className="flex gap-2 items-center">
              <Label className="text-sm">Thời gian miễn phí</Label>
              <Input type="date" value={freeFrom} onChange={(e) => setFreeFrom(e.target.value)} disabled={!free} />
              <Input type="date" value={freeTo} onChange={(e) => setFreeTo(e.target.value)} disabled={!free} />
            </div>

            <div>
              <Label className="text-sm">Lượt xem tối đa</Label>
              <Input type="number" value={String(maxViews)} onChange={(e) => setMaxViews(Number(e.target.value || 0))} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <Label className="text-sm">Môn học</Label>
              <Select value={subject} onValueChange={setSubject}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm">Chương học</Label>
              <Select value={chapter} onValueChange={setChapter}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {chaptersMock.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 gap-2">
              <div>
                <Label className="text-sm">Link đề có đáp án</Label>
                <Input value={linkWithAnswer} onChange={(e) => setLinkWithAnswer(e.target.value)} placeholder="URL (có đáp án)" />
              </div>
              <div>
                <Label className="text-sm">Link đề không có đáp án</Label>
                <Input value={linkWithoutAnswer} onChange={(e) => setLinkWithoutAnswer(e.target.value)} placeholder="URL (không đáp án)" />
              </div>
            </div>
          </div>

          {/* Video list */}
          <div>
            <div className="flex items-center justify-between">
              <div className="text-orange-600 font-medium">Danh sách video</div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Livestream</span>
                <Switch checked={false} onCheckedChange={() => toast.info("Livestream toggle (mô phỏng)")} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mt-3 items-end">
              <div>
                <Label className="text-sm">Tiêu đề</Label>
                <Input value={videoTitle} onChange={(e) => setVideoTitle(e.target.value)} placeholder="Tiêu đề" />
              </div>
              <div>
                <Label className="text-sm">Link video</Label>
                <Input value={videoLink} onChange={(e) => setVideoLink(e.target.value)} placeholder="https://..." />
              </div>
              <div>
                <Label className="text-sm">Thời gian (phút)</Label>
                <Input value={videoDuration} onChange={(e) => setVideoDuration(e.target.value)} placeholder="Ví dụ: 15" />
              </div>
              <div>
                <Button className="bg-orange-500 hover:bg-orange-600 text-white w-full" onClick={addVideo}>
                  <Plus className="mr-2" /> Thêm video
                </Button>
              </div>
            </div>

            {videos.length > 0 && (
              <div className="mt-4 border-t pt-3 space-y-2">
                <div className="grid grid-cols-4 gap-2 text-sm font-medium text-muted-foreground">
                  <div>Tiêu đề</div>
                  <div>Link video</div>
                  <div>Thời gian</div>
                  <div>Thao tác</div>
                </div>
                {videos.map((v) => (
                  <div key={v.id} className="grid grid-cols-4 gap-2 items-center py-2">
                    <div className="truncate">{v.title}</div>
                    <div className="truncate"><a className="text-blue-600" href={v.link} target="_blank" rel="noreferrer">{v.link}</a></div>
                    <div>{v.duration}</div>
                    <div>
                      <Button variant="ghost" className="text-red-600" onClick={() => removeVideo(v.id)}>Xóa</Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Exam select */}
          <div className="mt-4">
            <div className="text-orange-600 font-medium mb-2">Đề thi</div>
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <Select value={selectedExam} onValueChange={setSelectedExam}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {examsMock.map((e) => (
                      <SelectItem key={e} value={e}>{e}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={() => toast.info("Thêm đề thi (mô phỏng)")} >
                  Thêm đề thi
                </Button>
              </div>
            </div>
          </div>

          {/* Description rich text */}
          <div>
            <div className="text-orange-600 font-medium mb-2">Mô tả bài học</div>
            <div className="border rounded">
              <ReactQuill value={description} onChange={setDescription} placeholder="Nhập mô tả bài học..." />
            </div>
          </div>
        </div>

        <DialogFooter className="flex justify-end gap-3 mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>HỦY</Button>
          <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={handleSave}>LƯU</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddLessonModal;