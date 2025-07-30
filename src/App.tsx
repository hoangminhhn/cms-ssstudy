import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import BookManagement from "./pages/BookManagement";
import ExamManagement from "./pages/ExamManagement";
import WordExamUploadPage from "./pages/WordExamUploadPage";
import ScoreReportPage from "./pages/ScoreReportPage";
import WordExamEditorPage from "./pages/WordExamEditorPage"; // New page import

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/books" element={<BookManagement />} />
          <Route path="/exams" element={<ExamManagement />} />
          <Route path="/word-exam-upload" element={<WordExamUploadPage />} />
          <Route path="/word-exam-editor" element={<WordExamEditorPage />} /> {/* New route */}
          <Route path="/score-reports/:examId" element={<ScoreReportPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;