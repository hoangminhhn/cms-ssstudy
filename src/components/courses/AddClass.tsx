"use client";

import React from "react";
import ClassGeneralInfo from "@/components/courses/ClassGeneralInfo";
import ClassPricing from "@/components/courses/ClassPricing";
import ClassFees from "@/components/courses/ClassFees";
import ClassOtherInfo from "@/components/courses/ClassOtherInfo";
import ClassHighlights from "@/components/courses/ClassHighlights";
import ClassExtras from "@/components/courses/ClassExtras";
import ClassShortDescription from "@/components/courses/ClassShortDescription";
import ClassContent from "@/components/courses/ClassContent";
import CourseIncludes from "@/components/courses/CourseIncludes";
import { Button } from "@/components/ui/button";

const AddClass: React.FC = () => {
  return (
    <div className="space-y-6">
      <ClassGeneralInfo />

      <ClassPricing />

      <ClassFees />

      <ClassOtherInfo />

      <ClassHighlights />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <ClassShortDescription />
          <div className="mt-4">
            <ClassContent />
          </div>
        </div>

        <div className="space-y-4">
          <CourseIncludes />
          <ClassExtras />
        </div>
      </div>

      <div className="flex justify-end gap-2 p-4 border-t bg-gray-50 dark:bg-gray-800">
        <Button variant="outline">HỦY</Button>
        <Button className="bg-orange-500 hover:bg-orange-600 text-white">LƯU</Button>
      </div>
    </div>
  );
};

export default AddClass;