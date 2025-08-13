"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";

type GroupType = "Một môn" | "Nhiều môn";

interface SubSubject {
  id: string;
  name: string;
}

interface Group {
  id: string;
  name: string;
  type: GroupType;
  maxSelected: number;
  subSubjects: SubSubject[];
}

interface GroupPartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const availableSubjects = [
  "Toán",
  "Văn",
  "Tiếng Anh",
  "Vật lí",
  "Sinh học",
  "Hóa học",
  "Lịch sử",
  "Địa lý",
];

const GroupPartModal: React.FC<GroupPartModalProps> = ({ isOpen, onClose }) => {
  const [maxGroupsSelected, setMaxGroupsSelected] = useState<number>(1);
  const [groups, setGroups] = useState<Group[]>([
    {
      id: "group-1",
      name: "Khoa học",
      type: "Nhiều môn",
      maxSelected: 1,
      subSubjects: [],
    },
  ]);
  const [newSubjectSelections, setNewSubjectSelections] = useState<Record<string, string>>({});

  const handleAddGroup = () => {
    const newGroup: Group = {
      id: `group-${Date.now()}`,
      name: "",
      type: "Nhiều môn",
      maxSelected: 1,
      subSubjects: [],
    };
    setGroups((prev) => [...prev, newGroup]);
  };

  const handleDeleteGroup = (groupId: string) => {
    setGroups((prev) => prev.filter((g) => g.id !== groupId));
  };

  const handleGroupNameChange = (groupId: string, value: string) => {
    setGroups((prev) =>
      prev.map((g) => (g.id === groupId ? { ...g, name: value } : g))
    );
  };

  const handleGroupTypeChange = (groupId: string, value: GroupType) => {
    setGroups((prev) =>
      prev.map((g) =>
        g.id === groupId
          ? {
              ...g,
              type: value,
              subSubjects: value === "Một môn" && g.subSubjects.length > 1
                ? g.subSubjects.slice(0, 1)
                : g.subSubjects,
            }
          : g
      )
    );
  };

  const handleMaxSelectedChange = (groupId: string, value: number) => {
    setGroups((prev) =>
      prev.map((g) => (g.id === groupId ? { ...g, maxSelected: value } : g))
    );
  };

  const handleSubSubjectNameChange = (
    groupId: string,
    subSubjectId: string,
    value: string
  ) => {
    setGroups((prev) =>
      prev.map((g) => {
        if (g.id === groupId) {
          const updatedSubs = g.subSubjects.map((ss) =>
            ss.id === subSubjectId ? { ...ss, name: value } : ss
          );
          return { ...g, subSubjects: updatedSubs };
        }
        return g;
      })
    );
  };

  const handleDeleteSubSubject = (groupId: string, subSubjectId: string) => {
    setGroups((prev) =>
      prev.map((g) => {
        if (g.id === groupId) {
          const filteredSubs = g.subSubjects.filter((ss) => ss.id !== subSubjectId);
          return { ...g, subSubjects: filteredSubs };
        }
        return g;
      })
    );
  };

  const handleNewSubjectSelectionChange = (groupId: string, value: string) => {
    setNewSubjectSelections((prev) => ({ ...prev, [groupId]: value }));
  };

  const handleAddSubSubject = (groupId: string) => {
    const selectedSubject = newSubjectSelections[groupId];
    if (!selectedSubject) return;

    setGroups((prev) =>
      prev.map((g) => {
        if (g.id === groupId) {
          if (
            g.subSubjects.some(
              (ss) => ss.name.toLowerCase() === selectedSubject.toLowerCase()
            )
          ) {
            return g; // Không thêm trùng
          }
          const newSub: SubSubject = {
            id: `subsubject-${Date.now()}`,
            name: selectedSubject,
          };
          return { ...g, subSubjects: [...g.subSubjects, newSub] };
        }
        return g;
      })
    );
    setNewSubjectSelections((prev) => ({ ...prev, [groupId]: "" }));
  };

  const handleMaxGroupsSelectedChange = (value: number) => {
    setMaxGroupsSelected(value);
  };

  const handleSave = () => {
    // Xử lý lưu dữ liệu nhóm chủ đề
    // Bạn có thể gọi API hoặc truyền dữ liệu lên cha
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-w-3xl w-full p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg space-y-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Cài đặt nhóm chủ đề
          </DialogTitle>
        </DialogHeader>

        <div>
          <Label htmlFor="max-groups-selected" className="mb-2 block font-medium">
            Số nhóm chủ đề tối đa được chọn
          </Label>
          <Input
            id="max-groups-selected"
            type="number"
            min={1}
            value={maxGroupsSelected}
            onChange={(e) => handleMaxGroupsSelectedChange(Number(e.target.value))}
            className="w-24"
          />
        </div>

        <div className="space-y-6">
          {groups.map((group, idx) => (
            <div
              key={group.id}
              className="border rounded-md p-4 bg-blue-50 dark:bg-blue-900 relative"
            >
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 text-red-600 hover:bg-red-50"
                onClick={() => handleDeleteGroup(group.id)}
                aria-label="Xóa nhóm chủ đề"
              >
                <X className="h-5 w-5" />
              </Button>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <Label className="mb-1 block font-medium">Tên nhóm chủ đề</Label>
                  <Input
                    value={group.name}
                    onChange={(e) => handleGroupNameChange(group.id, e.target.value)}
                    placeholder="Nhập tên nhóm chủ đề"
                  />
                </div>
                <div>
                  <Label className="mb-1 block font-medium">Loại nhóm</Label>
                  <Select
                    value={group.type}
                    onValueChange={(val) => handleGroupTypeChange(group.id, val as GroupType)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Một môn">Một môn</SelectItem>
                      <SelectItem value="Nhiều môn">Nhiều môn</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="mb-1 block font-medium">Chọn tối đa</Label>
                  <Input
                    type="number"
                    min={1}
                    value={group.maxSelected}
                    onChange={(e) => handleMaxSelectedChange(group.id, Number(e.target.value))}
                    className="w-24"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Chọn {group.maxSelected} trong {group.subSubjects.length} môn
                  </p>
                </div>
              </div>

              <div>
                <Label className="mb-1 block font-medium">Môn học con</Label>
                {group.subSubjects.length === 0 ? (
                  <p className="text-sm text-muted-foreground mb-2">Chưa có môn học con.</p>
                ) : (
                  group.subSubjects.map((sub) => (
                    <div key={sub.id} className="flex items-center gap-2 mb-1">
                      <Input
                        value={sub.name}
                        onChange={(e) =>
                          handleSubSubjectNameChange(group.id, sub.id, e.target.value)
                        }
                        placeholder="Tên môn học con"
                        className="flex-1"
                      />
                      <Button
                        variant="ghost"
                        className="text-red-600 hover:bg-red-50"
                        onClick={() => handleDeleteSubSubject(group.id, sub.id)}
                        size="sm"
                        aria-label="Xóa môn học con"
                      >
                        <X className="h-5 w-5" />
                      </Button>
                    </div>
                  ))
                )}
                <div className="flex gap-2 mt-1">
                  <Select
                    value={newSubjectSelections[group.id] || ""}
                    onValueChange={(val) => handleNewSubjectSelectionChange(group.id, val)}
                    className="flex-1"
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Lựa chọn môn" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableSubjects.map((subject) => {
                        const isSelected = group.subSubjects.some(
                          (ss) => ss.name.toLowerCase() === subject.toLowerCase()
                        );
                        return (
                          <SelectItem
                            key={subject}
                            value={subject}
                            disabled={isSelected}
                            className={isSelected ? "opacity-50 italic" : ""}
                          >
                            {subject} {isSelected && "(Đã sử dụng)"}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  <Button
                    className="bg-green-500 hover:bg-green-600 text-white"
                    onClick={() => handleAddSubSubject(group.id)}
                    size="sm"
                  >
                    + Thêm môn
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleAddGroup}>
          + Thêm nhóm
        </Button>

        <DialogFooter className="flex justify-end gap-2 pt-6 border-t border-gray-200 dark:border-gray-700">
          <Button variant="outline" onClick={onClose}>
            HỦY
          </Button>
          <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={handleSave}>
            LƯU
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GroupPartModal;