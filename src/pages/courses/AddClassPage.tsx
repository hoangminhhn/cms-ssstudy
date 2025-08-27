import React from "react";
import AddClass from "@/components/courses/AddClass";

const AddClassPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-semibold mb-4">Thêm lớp</h1>
        <AddClass />
      </div>
    </div>
  );
};

export default AddClassPage;