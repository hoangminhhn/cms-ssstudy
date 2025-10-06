import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import BookManagement from "@/pages/BookManagement";
import ExamManagement from "@/pages/ExamManagement";
import WordExamUploadPage from "@/pages/WordExamUploadPage";
import ScoreReportPage from "@/pages/ScoreReportPage";
import CourseManagement from "@/pages/CourseManagement";
import LessonManagement from "@/pages/LessonManagement";
import QuizManagement from "@/pages/QuizManagement";
import DocumentManagement from "@/pages/DocumentManagement";
import MemberManagement from "@/pages/MemberManagement";
import OrderManagement from "@/pages/OrderManagement";
import PromotionManagement from "@/pages/PromotionManagement";
import NewsPage from "@/pages/NewsPage";
import NotificationManagement from "@/pages/NotificationManagement";
import ViewManagement from "@/pages/ViewManagement";

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
          <Route path="/score-reports/:examId" element={<ScoreReportPage />} />
          <Route path="/courses" element={<CourseManagement />} />
          <Route path="/lessons" element={<LessonManagement />} />
          <Route path="/quizzes" element={<QuizManagement />} />
          <Route path="/documents" element={<DocumentManagement />} />
          <Route path="/members" element={<MemberManagement />} />
          <Route path="/orders" element={<OrderManagement />} />
          <Route path="/promotions" element={<PromotionManagement />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/notifications" element={<NotificationManagement />} />
          <Route path="/view-management" element={<ViewManagement />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;