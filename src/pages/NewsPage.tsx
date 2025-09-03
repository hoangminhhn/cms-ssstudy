import React from "react";
import Layout from "@/components/Layout";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { useLocation } from "react-router-dom";
import AddPostPage from "@/components/news/AddPostPage";
import CreatePostForm from "@/components/news/CreatePostForm";
import CategoriesList from "@/components/news/CategoriesList";
import AddCategoryForm from "@/components/news/AddCategoryForm";

const NewsPage: React.FC = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const activeTab = searchParams.get("tab") || "posts";

  const getHeaderTitle = () => {
    switch (activeTab) {
      case "posts":
        return "Bài viết";
      case "add-post":
        return "Thêm bài viết";
      case "categories":
        return "Danh mục bài viết";
      case "add-category":
        return "Thêm danh mục";
      default:
        return "Tin tức";
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "add-post":
        return <CreatePostForm />;
      case "posts":
        return <AddPostPage />;
      case "categories":
        return <CategoriesList />;
      case "add-category":
        return <AddCategoryForm />;
      default:
        return <AddPostPage />;
    }
  };

  return (
    <Layout headerTitle={getHeaderTitle()}>
      <div className="flex flex-col gap-6 w-full overflow-x-hidden">
        {/* Mobile content placeholder */}
        <div className="lg:hidden w-full overflow-x-hidden">
          <div className="flex items-center justify-between px-4 py-2 border-b bg-gray-50 dark:bg-gray-800">
            <h2 className="text-lg font-semibold">{getHeaderTitle()}</h2>
            <div className="w-16" />
          </div>
        </div>
        {renderContent()}
      </div>
      <MadeWithDyad />
    </Layout>
  );
};

export default NewsPage;