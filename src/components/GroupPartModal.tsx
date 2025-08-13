"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { X } from "lucide-react";
import { toast } from "sonner";
import Sortable from "react-sortablejs";

type GroupType = "Một môn" | "Nhiều môn";

interface SubSubject {
  id: string;
  name: string;
}

interface GroupPart {
  id: string;
  name: string;
  type: GroupType;
  maxSelected: number;
  subSubjects: SubSubject[];
}

interface GroupPartModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (maxGroupSelected: number, groups: GroupPart[]) => void;
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

const GroupPartModal: React.FC<GroupPartModalProps> = ({ isOpen, onClose, onSave }) => {
  const [maxGroupSelected, setMaxGroupSelected] = useState(1);
  const [groups, setGroups] = useState<GroupPart[]>([
    {
      id: `group-${Date.now()}`,
      name: "",
      type: "Một môn",
      maxSelected: 1,
      subSubjects: [],
    },
  ]);
  const [newSubjectSelections, setNewSubjectSelections] = useState<Record<string, string>>({});

  const handleGroupNameChange = (id: string, value: string) => {
    setGroups((prev) =>
      prev.map((g) => (g.id === id ? { ...g, name: value } : g))
    );
  };

  const handleGroupTypeChange = (id: string, value: GroupType) => {
    setGroups((prev) =>
      prev.map((g) =>
        g.id === id
          ? {
              ...g,
              type: value,
              subSubjects: value === "Một môn" && g.subSubjects.length > 1
                ? g.subSubjects.slice(0, 1)
                : g.subSubjects,
              maxSelected: 1,
            }
          : g
      )
    );
  };

  const handleGroupMaxSelectedChange = (id: string, value: number) => {
    setGroups((prev) =>
      prev.map((g) => (g.id === id ? { ...g, maxSelected: value } : g))
    );
  };

  const handleAddGroup = () => {
    setGroups((prev) => [
      ...prev,
      {
        id: `group-${Date.now()}`,
        name: "",
        type: "Một môn",
        maxSelected: 1,
        subSubjects: [],
      },
    ]);
  };

  const handleRemoveGroup = (id: string) => {
    setGroups((prev) => prev.filter((g) => g.id !== id));
    setNewSubjectSelections((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  };

  const handleAddSubSubject = (groupId: string) => {
    try {
      const selectedSubject = newSubjectSelections[groupId];
      if (!selectedSubject) {
        toast.error("Vui lòng chọn môn học để thêm.");
        return;
      }
      setGroups((prev) =>
        prev.map((g) => {
          if (g.id === groupId) {
            if (g.subSubjects.some((ss) => ss.name.toLowerCase() === selectedSubject.toLowerCase())) {
              toast.error("Môn học con đã tồn tại trong nhóm này.");
              return g;
            }
            const newId = `subsubject-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
            const newSubSubject: SubSubject = {
              id: newId,
              name: selectedSubject,
            };
            return { ...g, subSubjects: [...g.subSubjects, newSubSubject] };
          }
          return g;
        })
      );
      setNewSubjectSelections((prev) => ({ ...prev, [groupId]: "" }));
    } catch (error) {
      console.error("Lỗi khi thêm môn học con:", error);
      toast.error("Đã xảy ra lỗi khi thêm môn học. Vui lòng thử lại.");
    }
  };

  const handleRemoveSubSubject = (groupId: string, subSubjectId: string) => {
    setGroups((prev) =>
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
    setGroups((prev) =>
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

  const handleSingleSubjectChange = (groupId: string, subjectName: string) => {
    setGroups((prev) =>
      prev.map((g) => {
        if (g.id === groupId) {
          const newSubSubject: SubSubject = {
            id: g.subSubjects.length > 0 ? g.subSubjects[0].id : `subsubject-${Date.now()}`,
            name: subjectName,
          };
          return { ...g, subSubjects: [newSubSubject] };
        }
        return g;
      })
    );
  };

  const handleSortSubSubjects = (groupId: string, newOrder: string[]) => {
    setGroups((prev) =>
      prev.map((g) => {
        if (g.id === groupId) {
          const newSubSubjects = newOrder.map(id => g.subSubjects.find(ss => ss.id === id)!).filter(Boolean);
          return { ...g, subSubjects: newSubSubjects };
        }
        return g;
      })
    );
  };

  const handleSave = () => {
    if (maxGroupSelected < 1) {
      toast.error("Số nhóm chủ đề tối đa phải lớn hơn hoặc bằng 1.");
      return;
    }
    for (const g of groups) {
      if (!g.name.trim()) {
        toast.error("Tên nhóm chủ đề không được để trống.");
        return;
      }
      if (g.maxSelected < 1) {
        toast.error(`Số nhóm tối đa được chọn trong nhóm "${g.name}" phải lớn hơn hoặc bằng 1.`);
        return;
      }
      if (g.type === "Một môn" && g.subSubjects.length > 1) {
        toast.error(`Nhóm "${g.name}" là 'Một môn' nên chỉ được có tối đa 1 môn học con.`);
        return;
      }
    }
    onSave(maxGroupSelected, groups);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-w-3xl w-full p-8 bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-y-auto max-h-[80vh]">
        <DialogHeader className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-6">
          <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Cài đặt Nhóm Chủ Đề
          </DialogTitle>
        </DialogHeader>

        <div className="mb-6">
          <Label htmlFor="maxGroupSelected" className="mb-2 block font-semibold text-gray-700 dark:text-gray-300">
            Số nhóm chủ đề tối đa được chọn
          </Label>
          <Input
            id="maxGroupSelected"
            type="number"
            min={1}
            value={maxGroupSelected}
            onChange={(e) => setMaxGroupSelected(Number(e.target.value))}
            className="w-24"
          />
        </div>

        <div className="space-y-6 bg-blue-50 dark:bg-blue-900 p-6 rounded-md">
          <Label className="mb-4 block font-semibold text-gray-700 dark:text-gray-300">Nhóm chủ đề</Label>
          {groups.map((group, idx) => {
            const selectedSubjectNames = group.subSubjects.map(ss => ss.name.toLowerCase());
            return (
              <div key={group.id} className="border rounded-md bg-white dark:bg-gray-800 p-4 relative">
                <button
                  type="button"
                  onClick={() => handleRemoveGroup(group.id)}
                  className="absolute top-3 right-3 text-red-600 hover:bg-red-50 rounded-full p-1"
                  aria-label="Xóa nhóm chủ đề"
                >
                  <X className="h-5 w-5" />
                </button>
                <div className="grid grid-cols-[4fr_3fr_2fr] gap-4 mb-4 items-center">
                  <Input
                    placeholder="Tên nhóm chủ đề"
                    value={group.name}
                    onChange={(e) => handleGroupNameChange(group.id, e.target.value)}
                    className=""
                  />
                  <Select
                    value={group.type}
                    onValueChange={(val) => handleGroupTypeChange(group.id, val as GroupType)}
                  >
                    <SelectTrigger className="w-full min-w-[150px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Một môn">Một môn</SelectItem>
                      <SelectItem value="Nhiều môn">Nhiều môn</SelectItem>
                    </SelectContent>
                  </Select>
                  {group.type === "Nhiều môn" && (
                    <div className="flex flex-col items-start">
                      <Label htmlFor={`maxSelected-${group.id}`} className="text-sm font-medium mb-1">
                        Chọn tối đa
                      </Label>
                      <Input
                        id={`maxSelected-${group.id}`}
                        type="number"
                        min={1}
                        value={group.maxSelected}
                        onChange={(e) => handleGroupMaxSelectedChange(group.id, Number(e.target.value))}
                        className="w-16"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Chọn {group.maxSelected} trong {group.subSubjects.length} môn
                      </p>
                    </div>
                  )}
                </div>

                {group.type === "Một môn" ? (
                  <div>
                    <Label className="mb-1 block font-medium text-gray-700 dark:text-gray-300">Môn học con</Label>
                    <Select
                      value={group.subSubjects.length > 0 ? group.subSubjects[0].name : ""}
                      onValueChange={(val) => handleSingleSubjectChange(group.id, val)}
                      className="w-48"
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
                  </div>
                ) : (
                  <div>
                    <Label className="mb-1 block font-medium text-gray-700 dark:text-gray-300">Môn học con</Label>
                    {group.subSubjects.length === 0 ? (
                      <p className="text-sm text-muted-foreground mb-2">Chưa có môn học con.</p>
                    ) : (
                      <Sortable
                        tag="div"
                        list={group.subSubjects}
                        setList={(newList) => {
                          setGroups((prev) =>
                            prev.map((g) => (g.id === group.id ? { ...g, subSubjects: newList } : g))
                          );
                        }}
                        animation={150}
                        className="space-y-2"
                      >
                        {group.subSubjects.map((sub) => (
                          <div
                            key={sub.id}
                            className="flex items-center gap-2 mb-2 cursor-move select-none"
                            aria-label={`Kéo thả để sắp xếp môn học ${sub.name}`}
                          >
                            <Input
                              value={sub.name}
                              onChange={(e) => handleSubSubjectNameChange(group.id, sub.id, e.target.value)}
                              className="flex-1"
                            />
                            <Button
                              variant="ghost"
                              className="text-red-600 hover:bg-red-50"
                              onClick={() => handleRemoveSubSubject(group.id, sub.id)}
                              size="sm"
                              aria-label="Xóa môn học con"
                            >
                              <X className="h-5 w-5" />
                            </Button>
                          </div>
                        ))}
                      </Sortable>
                    )}
                    <div className="flex gap-2 mt-2">
                      <Select
                        value={newSubjectSelections[group.id] || ""}
                        onValueChange={(val) =>
                          setNewSubjectSelections((prev) => ({ ...prev, [group.id]: val }))
                        }
                        className="flex-1 w-48"
                      >
                        <SelectTrigger className="w-full min-w-[150px]">
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
                        onClick={() => handleAddSubSubject(group.id)}
                        size="sm"
                      >
                        + Thêm môn
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleAddGroup}>
            + Thêm nhóm
          </Button>
        </div>

        <DialogFooter className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-4">
          <Button variant="outline" onClick={onClose} className="px-4 py-2 text-sm">
            HỦY
          </Button>
          <Button onClick={handleSave} className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 text-sm">
            LƯU
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GroupPartModal;