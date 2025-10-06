"use client";

import React from "react";
import RoomsFilters from "./RoomsFilters";
import RoomsTable from "./RoomsTable";
import { toast } from "sonner";
import type { RoomRowData } from "./RoomRow";

/**
 * Updated RoomsTab: uses RoomsFilters + RoomsTable.
 * - Filters control local state (search/status/course/grade/subject/teacher)
 * - RoomsTable receives filtered list and action handlers
 */

const initialRooms: RoomRowData[] = [
  {
    id: "RM1020",
    code: "RM1020",
    title: "Toán - Tổ hợp & Xác suất: Hoán vị, chỉnh hợp và ứng dụng",
    datetime: "25/09/2025 00:50",
    course: "Toán 12 - Luyện thi ĐH",
    courseSub: "Tổ hợp & Xác suất",
    owner: "Nguyễn Tiến Đạt",
    status: "running",
    ccu: 556,
    participants: 74,
    messages: 4497,
    // new metadata
    grade: "Lớp 12",
    subject: "Toán",
    teacher: "Nguyễn Tiến Đạt",
  },
  {
    id: "RM1017",
    code: "RM1017",
    title: "Toán - Hàm số: Tiệm cận, khảo sát đồ thị nâng cao",
    datetime: "07/10/2025 00:50",
    course: "Toán 12 - Luyện thi ĐH",
    courseSub: "Hàm số & Ứng dụng",
    owner: "Trần Bình",
    status: "running",
    ccu: 514,
    participants: 10,
    messages: 4026,
    grade: "Lớp 12",
    subject: "Toán",
    teacher: "Trần Bình",
  },
  {
    id: "RM1006",
    code: "RM1006",
    title: "Vật Lý - Điện xoay chiều: Mạch RLC và hiện tượng cộng hưởng",
    datetime: "03/10/2025 00:50",
    course: "Vật Lý 12 - Luyện thi ĐH",
    courseSub: "Điện xoay chiều",
    owner: "Vũ Đình Phúc",
    status: "running",
    ccu: 454,
    participants: 97,
    messages: 3889,
    grade: "Lớp 12",
    subject: "Vật Lý",
    teacher: "Vũ Đình Phúc",
  },
  {
    id: "RM1005",
    code: "RM1005",
    title: "Vật Lý - Dao động & Sóng: Bài toán dao động điều hòa",
    datetime: "29/09/2025 00:50",
    course: "Vật Lý 12 - Luyện thi ĐH",
    courseSub: "Dao động & Sóng",
    owner: "Lâm Gia",
    status: "running",
    ccu: 427,
    participants: 104,
    messages: 4030,
    grade: "Lớp 12",
    subject: "Vật Lý",
    teacher: "Lâm Gia",
  },
  {
    id: "RM1009",
    code: "RM1009",
    title: "Hóa Học - Hữu cơ: Este, ancol và phản ứng tạo thành",
    datetime: "20/09/2025 19:00",
    course: "Hóa 12 - Luyện thi ĐH",
    courseSub: "Hữu cơ - Este",
    owner: "Cô Mai",
    status: "running",
    ccu: 338,
    participants: 5,
    messages: 2992,
    grade: "Lớp 12",
    subject: "Hóa",
    teacher: "Cô Mai",
  },
  {
    id: "RM1012",
    code: "RM1012",
    title: "Hóa Học - Vật liệu & Polime: Tính chất và điều chế",
    datetime: "18/09/2025 18:30",
    course: "Hóa 12 - Luyện thi ĐH",
    courseSub: "Polime & vật liệu",
    owner: "Thầy Huy",
    status: "running",
    ccu: 290,
    participants: 111,
    messages: 3351,
    grade: "Lớp 12",
    subject: "Hóa",
    teacher: "Thầy Huy",
  },
];

const RoomsTab: React.FC = () => {
  const [query, setQuery] = React.useState("");
  const [status, setStatus] = React.useState<string>("all");
  const [course, setCourse] = React.useState<string>("all");
  const [grade, setGrade] = React.useState<string>("all");
  const [subject, setSubject] = React.useState<string>("all");
  const [teacher, setTeacher] = React.useState<string>("all");
  const [rooms, setRooms] = React.useState<RoomRowData[]>(initialRooms);

  const applyFilters = () => {
    toast.info("Áp dụng bộ lọc (demo).");
    // In a real app you'd fetch filtered data; here we keep local filtering on render
  };

  const filteredRooms = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return rooms.filter((r: any) => {
      if (status !== "all" && r.status !== status) return false;
      if (course !== "all" && course) {
        if (!r.course?.toLowerCase().includes(course.replace(/\d+/g, "").trim())) {
          // naive match for demo
          return false;
        }
      }
      if (grade !== "all" && grade) {
        // grade values in mock are like "Lớp 12", grade filter values are 'lop12' etc.
        const mapGrade = {
          lop10: "Lớp 10",
          lop11: "Lớp 11",
          lop12: "Lớp 12",
        };
        if (mapGrade[grade] && r.grade !== mapGrade[grade]) return false;
      }
      if (subject !== "all" && subject) {
        const mapSub: Record<string, string> = { toan: "Toán", vatly: "Vật Lý", hoahoc: "Hóa" };
        if (mapSub[subject] && r.subject !== mapSub[subject]) return false;
      }
      if (teacher !== "all" && teacher) {
        const mapTeacher: Record<string, string> = {
          "gv-nguyen": "Nguyễn Tiến Đạt",
          "gv-tran": "Trần Bình",
          "gv-phuc": "Vũ Đình Phúc",
        };
        if (mapTeacher[teacher] && r.teacher !== mapTeacher[teacher]) return false;
      }

      if (!q) return true;
      return (
        (r.title && r.title.toLowerCase().includes(q)) ||
        (r.code && r.code.toLowerCase().includes(q)) ||
        (r.course && r.course.toLowerCase().includes(q)) ||
        (r.owner && r.owner.toLowerCase().includes(q))
      );
    });
  }, [rooms, query, status, course, grade, subject, teacher]);

  const handleOpen = (id: string) => {
    toast.info(`Mở phòng ${id} (demo).`);
  };

  const handleEdit = (id: string) => {
    toast.info(`Chỉnh sửa phòng ${id} (demo).`);
  };

  const handleDelete = (id: string) => {
    if (!confirm("Bạn có chắc muốn xóa phòng này?")) return;
    setRooms((prev) => prev.filter((r) => r.id !== id));
    toast.success("Đã xóa phòng (demo).");
  };

  return (
    <div className="space-y-4">
      <RoomsFilters
        query={query}
        setQuery={setQuery}
        status={status}
        setStatus={setStatus}
        course={course}
        setCourse={setCourse}
        grade={grade}
        setGrade={setGrade}
        subject={subject}
        setSubject={setSubject}
        teacher={teacher}
        setTeacher={setTeacher}
        onApply={applyFilters}
      />

      <RoomsTable rooms={filteredRooms} onOpen={handleOpen} onEdit={handleEdit} onDelete={handleDelete} itemsPerPage={10} />
    </div>
  );
};

export default RoomsTab;