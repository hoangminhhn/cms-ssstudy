import React from 'react';
import Layout from '@/components/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BookTable from '@/components/BookTable';
import { MadeWithDyad } from '@/components/made-with-dyad';

const BookManagement: React.FC = () => {
  return (
    <Layout>
      <div className="flex flex-col gap-6">
        <h1 className="text-2xl font-semibold">Quản lý sách</h1>
        <Tabs defaultValue="all-books" className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="all-books">Tất cả sách</TabsTrigger>
            <TabsTrigger value="add-book">Thêm sách</TabsTrigger>
            <TabsTrigger value="book-categories">Danh mục sách</TabsTrigger>
            <TabsTrigger value="add-category">Thêm danh mục</TabsTrigger>
            <TabsTrigger value="book-reviews">Đánh giá sách</TabsTrigger>
            <TabsTrigger value="add-review">Thêm đánh giá sách</TabsTrigger>
          </TabsList>
          <TabsContent value="all-books">
            <BookTable />
          </TabsContent>
          {/* Other tabs content can be added here later */}
        </Tabs>
      </div>
      <MadeWithDyad />
    </Layout>
  );
};

export default BookManagement;