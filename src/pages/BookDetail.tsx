"use client";

import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import AddBookForm from "@/components/AddBookForm";
import { Button } from "@/components/ui/button";

const BookDetail: React.FC = () => {
  const { bookId } = useParams<{ bookId: string }>();
  const navigate = useNavigate();

  return (
    <Layout headerTitle={`Sách — Chi tiết ${bookId ?? ""}`}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold">Chi tiết Sách</h2>
          <p className="text-sm text-muted-foreground">ID sách: <span className="font-medium">{bookId ?? "—"}</span></p>
        </div>
        <div>
          <Button variant="outline" onClick={() => navigate(-1)}>Quay lại</Button>
        </div>
      </div>

      {/* Reuse the AddBookForm layout to display all relevant sections */}
      <AddBookForm />
    </Layout>
  );
};

export default BookDetail;