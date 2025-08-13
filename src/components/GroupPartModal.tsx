"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface GroupPartModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (groupPartName: string, maxSelected?: number) => void;
}

const GroupPartModal: React.FC<GroupPartModalProps> = ({ isOpen, onClose, onSave }) => {
  const [groupName, setGroupName] = useState("");
  const [maxSelected, setMaxSelected] = useState(1);

  const handleSave = () => {
    if (!groupName.trim()) {
      toast.error("Tên nhóm chủ đề không được để trống.");
      return;
    }
    onSave(groupName.trim(), maxSelected);
    setGroupName("");
    setMaxSelected(1);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-w-md p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Cài đặt Nhóm Chủ Đề</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="groupName">Tên nhóm chủ đề</Label>
            <Input
              id="groupName"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Nhập tên nhóm chủ đề"
            />
          </div>
          <div>
            <Label htmlFor="maxSelected">Số nhóm tối đa được chọn</Label>
            <Input
              id="maxSelected"
              type="number"
              min={1}
              value={maxSelected}
              onChange={(e) => setMaxSelected(Number(e.target.value))}
            />
          </div>
        </div>
        <DialogFooter className="mt-6 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>HỦY</Button>
          <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={handleSave}>LƯU</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GroupPartModal;