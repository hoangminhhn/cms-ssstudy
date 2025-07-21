import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import BookManagement from "./pages/BookManagement"; // Import the new page

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/books" element={<BookManagement />} /> {/* Main route for Book Management */}
          <Route path="/books/add" element={<div className="p-4">Thêm sách</div>} /> {/* Placeholder for Add Book */}
          <Route path="/books/categories" element={<div className="p-4">Danh mục sách</div>} /> {/* Placeholder for Book Categories */}
          <Route path="/books/categories/add" element={<div className="p-4">Thêm danh mục</div>} /> {/* Placeholder for Add Category */}
          <Route path="/books/reviews" element={<div className="p-4">Đánh giá sách</div>} /> {/* Placeholder for Book Reviews */}
          <Route path="/books/reviews/add" element={<div className="p-4">Thêm đánh giá sách</div>} /> {/* Placeholder for Add Review */}
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;