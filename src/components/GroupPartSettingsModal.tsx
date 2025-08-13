"use client";

import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X } from "lucide-react";

type GroupType = "Một môn" | "Nhiều môn";

interface SubSubject {
  id: string;
  name: string;
}

interface GroupTopic {
  id: string;
  name: string;
  type: GroupType;
  maxSubGroupsSelected?: number;
  subSubjects: SubSubject[];
}

interface GroupPartSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  maxGroupsSelected: number;
  onMaxGroupsSelectedChange: (value: number) => void;
  groups: GroupTopic[];
  onGroupsChange: (groups: GroupTopic[]) => void;
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

const GroupPartSettingsModal: React.FC<GroupPartSettingsModalProps> = ({
  isOpen,
  onClose,
  maxGroupsSelected,
  onMaxGroupsSelectedChange,
  groups,
  onGroupsChange,
}) => {
  const [localGroups, setLocalGroups] = useState<GroupTopic[]>(groups);
  const [localMaxGroupsSelected, setLocalMaxGroupsSelected] = useState<number>(maxGroupsSelected);

  useEffect(() => {
    setLocalGroups(groups);
  }, [groups]);

  useEffect(() => {
    setLocalMaxGroupsSelected(maxGroupsSelected);
  }, [maxGroupsSelected]);

  const handleGroupNameChange = (id: string, value: string) => {
    setLocalGroups((prev) =>
      prev.map((g) => (g.id === id ? { ...g, name: value } : g))
    );
  };

  const handleGroupTypeChange = (id: string, value: GroupType) => {
    setLocalGroups((prev) =>
      prev.map((g) =>
        g.id === id
          ? {
              ...g,
              type: value,
              subSubjects: value === "Một môn" && g.subSubjects.length > 1 ? [g.subSubjects[0]] : g.subSubjects,
            }
          : g
      )
    );
  };

  const handleMaxSubGroupsSelectedChange = (id: string, value: number) => {
    setLocalGroups((prev) =>
      prev.map((g) => (g.id === id ? { ...g, maxSubGroupsSelected: value } : g))
    );
  };

  const handleAddGroup = () => {
    const newGroup: GroupTopic = {
      id: `group-${Date.now()}`,
      name: "Nhóm chủ đề mới",
      type: "Nhiều môn",
      maxSubGroupsSelected: 1,
      subSubjects: [],
    };
    setLocalGroups((prev) => [...prev, newGroup]);
  };

  const handleDeleteGroup = (id: string) => {
    setLocalGroups((prev) => prev.filter((g) => g.id !== id));
  };

  const handleAddSubSubject = (groupId: string, subjectName: string) => {
    if (!subjectName) return;
    setLocalGroups((prev) =>
      prev.map((g) => {
        if (g.id === groupId) {
          if (g.subSubjects.some((ss) => ss.name.toLowerCase() === subjectName.toLowerCase())) {
            return g; // Already exists
          }
          const newSubSubject: SubSubject = {
            id: `subsubject-${Date.now()}`,
            name: subjectName,
          };
          return { ...g, subSubjects: [...g.subSubjects, newSubSubject] };
        }
        return g;
      })
    );
  };

  const handleDeleteSubSubject = (groupId: string, subSubjectId: string) => {
    setLocalGroups((prev) =>
      prev.map((g) => {
        if (g.id === groupId) {
          return {
            ...g,
            subSubjects: g.subSubjects.filter((ss) => ss.id !== subSubjectId),
          };
        }
        return g;
      })
    );
  };

  const handleSubSubjectNameChange = (groupId: string, subSubjectId: string, value: string) => {
    setLocalGroups((prev) =>
      prev.map((g) => {
        if (g.id === groupId) {
          return {
            ...g,
            subSubjects: g.subSubjects.map((ss) =>
              ss.id === subSubjectId ? { ...ss, name: value } : ss
            ),
          };
        }
        return g;
      })
    );
  };

  const handleSave = () => {
    onGroupsChange(localGroups);
    onMaxGroupsSelectedChange(localMaxGroupsSelected);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-w-3xl w-full max-h-[80vh] overflow-y-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Cấu hình phần thi nhóm chủ đề
          </DialogTitle>
        </DialogHeader>

        <div className="mb-4">
          <Label htmlFor="max-groups-selected" className="mb-1 block font-medium">
            Số nhóm chủ đề tối đa được chọn
          </Label>
          <Input
            id="max-groups-selected"
            type="number"
            min={1}
            value={localMaxGroupsSelected}
            onChange={(e) => setLocalMaxGroupsSelected(Number(e.target.value))}
            className="w-24"
          />
        </div>

        <div className="space-y-6">
          {localGroups.length === 0 && (
            <p className="text-muted-foreground text-center">Chưa có nhóm chủ đề nào.</p>
          )}
          {localGroups.map((group) => {
            const selectedSubjectNames = group.subSubjects.map((ss) => ss.name.toLowerCase());
            return (
              <div key={group.id} className="border rounded-md p-4 bg-gray-50 dark:bg-gray-700 relative">
                <Button
                  variant="ghost"
                  className="absolute top-2 right-2 text-red-600 hover:bg-red-50"
                  onClick={() => handleDeleteGroup(group.id)}
                  size="sm"
                  aria-label="Xóa nhóm chủ đề"
                >
                  <X className="h-5 w-5" />
                </Button>
                <div className="flex items-center gap-4 mb-4">
                  <Input
                    value={group.name}
                    onChange={(e) => handleGroupNameChange(group.id, e.target.value)}
                    placeholder="Tên nhóm chủ đề"
                    className="flex-1"
                  />
                  <Select
                    value={group.type}
                    onValueChange={(val) => handleGroupTypeChange(group.id, val as GroupType)}
                  >
                    <SelectTrigger className="w-[120px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Một môn">Một môn</SelectItem>
                      <SelectItem value="Nhiều môn">Nhiều môn</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {group.type === "Nhiều môn" && (
                  <div className="mb-4">
                    <Label htmlFor={`maxSubGroupsSelected-${group.id}`} className="block mb-1 font-medium">
                      Chọn tối đa
                    </Label>
                    <Input
                      id={`maxSubGroupsSelected-${group.id}`}
                      type="number"
                      min={1}
                      value={group.maxSubGroupsSelected ?? 1}
                      onChange={(e) => handleMaxSubGroupsSelectedChange(group.id, Number(e.target.value))}
                      className="w-24"
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      Chọn {group.maxSubGroupsSelected ?? 1} trong {group.subSubjects.length} môn
                    </p>
                  </div>
                )}
                <div>
                  <Label className="mb-1 block font-medium">Môn học con</Label>
                  {group.type === "Một môn" ? (
                    <Select
                      value={group.subSubjects.length > 0 ? group.subSubjects[0].name : ""}
                      onValueChange={(val) => {
                        if (!val) {
                          setLocalGroups((prev) =>
                            prev.map((g) =>
                              g.id === group.id ? { ...g, subSubjects: [] } : g
                            )
                          );
                        } else {
                          setLocalGroups((prev) =>
                            prev.map((g) =>
                              g.id === group.id
                                ? { ...g, subSubjects: [{ id: `subsubject-${Date.now()}`, name: val }] }
                                : g
                            )
                          );
                        }
                      }}
                      className="w-full"
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Lựa chọn môn" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableSubjects.map((subject) => (
                          <SelectItem key={subject} value={subject}>
                            {subject}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <>
                      {group.subSubjects.length > 0 ? (
                        group.subSubjects.map((subSubject) => (
                          <div key={subSubject.id} className="flex items-center gap-2 mb-1">
                            <Input
                              value={subSubject.name}
                              onChange={(e) => handleSubSubjectNameChange(group.id, subSubject.id, e.target.value)}
                              placeholder="Tên môn học con"
                              className="flex-1"
                            />
                            <Button
                              variant="ghost"
                              className="text-red-600 hover:bg-red-50"
                              onClick={() => handleDeleteSubSubject(group.id, subSubject.id)}
                              size="sm"
                              aria-label="Xóa môn học con"
                            >
                              <X className="h-5 w-5" />
                            </Button>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground">Chưa có môn học con.</p>
                      )}
                      <div className="flex gap-2 mt-1">
                        <Select
                          value=""
                          onValueChange={(val) => {
                            if (val && !selectedSubjectNames.includes(val.toLowerCase())) {
                              handleAddSubSubject(group.id, val);
                            }
                          }}
                          className="flex-1"
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Lựa chọn môn" />
                          </SelectTrigger>
                          <SelectContent>
                            {availableSubjects.map((subject) => {
                              const isSelected = selectedSubjectNames.includes(subject.toLowerCase());
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
                          onClick={() => {
                            // Add via select onValueChange, button is just UI
                          }}
                          size="sm"
                        >
                          + Thêm môn
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            );
          })}
          <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleAddGroup}>
            + Thêm nhóm
          </Button>
        </div>

        <DialogFooter className="flex justify-end gap-2 pt-6 border-t border-gray-200 dark:border-gray-700">
          <Button variant="outline" onClick={onClose}>Hủy</Button>
          <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={handleSave}>
            Lưu
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GroupPartSettingsModal;