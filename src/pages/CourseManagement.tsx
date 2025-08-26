import React from "react";
import Layout from "@/components/Layout";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { useLocation } from "react-router-dom";
import OnlineClasses from "@/components/courses/OnlineClasses";
import OfflineClasses from "@/components/courses/OfflineClasses";
import AddClass from "@/components/courses/AddClass";
import Subjects from "@/components/courses/Subjects";
import AddSubject from "@/components/courses/AddSubject";
import Categories from "@/components/courses/Categories";
import AddCategory from "@/components/courses/AddCategory";
import CourseReviews from "@/components/courses/CourseReviews";
import AddCourseReview from "@/components/courses/AddCourseReview";

const CourseManagement: React.FC = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const activeTab = searchParams.get("tab") || "online-classes";

  const renderContent = () => {
    switch (activeTab) {
      case "online-classes":
        return <OnlineClasses />;
      case "offline-classes":
        return <OfflineClasses />;
      case "add-class":
        return <AddClass />;
      case "subjects":
        return <Subjects />;
      case "add-subject":
        return <AddSubject />;
      case "categories":
        return <Categories />;
      case "add-category":
        return <AddCategory />;
      case "course-reviews":
        return <CourseReviews />;
      case "add-course-review":
        return <AddCourseReview />;
      default:
        return <OnlineClasses />;
    }
  };

  return (
    <Layout headerTitle="Quản lý khóa học">
      <div className="flex flex-col gap-6 w-full overflow-x-hidden">
        {/* Mobile header placeholder for submenu */}
        <div className="lg:hidden w-full overflow-x-hidden">
          <div className="flex items-center justify-between px-4 py-2 border-b bg-gray-50 dark:bg-gray-800">
            <h2 className="text-lg font-semibold">Quản lý khóa học</h2>
            <div className="w-16" />
          </div>
        </div>

        {renderContent()}
      </div>
      <MadeWithDyad />
    </Layout>
  );
};

export default CourseManagement;