import React from "react";
import Layout from "@/components/Layout";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { useLocation } from "react-router-dom";
import AddPostPage from "@/components/news/AddPostPage";

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
        return <AddPostPage />;
      case "posts":
        return <AddPostPage />; // reuse list UI for posts view for now
      case "categories":
        return <div className="p-4">Quản lý danh mục (coming soon)</div>;
      case "add-category":
        return <div className="p-4">Thêm danh mục (coming soon)</div>;
      default:
        return <AddPostPage />;
    }
  };

  return (
    <Layout headerTitle={getHeaderTitle()}>
      <div className="flex flex-col gap-6 w-full overflow-x-hidden">
        {renderContent()}
      </div>
      <MadeWithDyad />
    </Layout>
  );
};

export default NewsPage;