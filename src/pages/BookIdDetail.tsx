"use client";

import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import AddBookForm from "@/components/AddBookForm";
import { Button } from "@/components/ui/button";

const BookIdDetail: React.FC = () => {
  const { bookId } = useParams<{ bookId: string }>();
  const navigate = useNavigate();

  return (
    <Layout headerTitle={`Sách ID — Chi tiết ${bookId ?? ""}`}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold">Chi tiết Sách ID</h2>
          <p className="text-sm text-muted-foreground">Mã sách: <span className="font-medium">{bookId ?? "—"}</span></p>
        </div>
        <div>
          <Button variant="outline" onClick={() => navigate(-1)}>Quay lại</Button>
        </div>
      </div>

      {/* Reuse the AddBookForm UI to show the same sections as when adding a book.
          In a real app you'd pass the fetched book data as props to a form component.
      */}
      <AddBookForm />

    </Layout>
  );
};

export default BookIdDetail;