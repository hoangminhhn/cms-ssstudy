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
      <DialogContent className="max-w-md w-full p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Cài đặt Nhóm Chủ Đề
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <div>
            <Label htmlFor="groupName" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Tên nhóm chủ đề
            </Label>
            <Input
              id="groupName"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Nhập tên nhóm chủ đề"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="maxSelected" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Số nhóm tối đa được chọn
            </Label>
            <Input
              id="maxSelected"
              type="number"
              min={1}
              value={maxSelected}
              onChange={(e) => setMaxSelected(Number(e.target.value))}
              className="mt-1 w-24"
            />
          </div>
        </div>
        <DialogFooter className="mt-6 flex justify-end gap-2 border-t border-gray-200 dark:border-gray-700 pt-4">
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