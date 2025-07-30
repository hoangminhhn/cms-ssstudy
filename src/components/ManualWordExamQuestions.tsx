import React from 'react';
import ExamPartQuestions from './ExamPartQuestions';
import { toast } from 'sonner';

const ManualWordExamQuestions: React.FC = () => {
  // Giả định dữ liệu phần thi và câu hỏi
  const [parts, setParts] = React.useState([
    {
      id: 'part1',
      name: 'Phần 1',
      questions: [
        {
          id: 'Q001',
          correctAnswer: 'A',
          solution: 'Giải thích câu hỏi 1',
          documentLink: 'https://example.com/doc1.pdf',
          videoLink: 'https://example.com/video1.mp4',
          uploadDate: '01/07/2025',
        },
        {
          id: 'Q002',
          correctAnswer: 'B',
          solution: 'Giải thích câu hỏi 2',
          uploadDate: '02/07/2025',
        },
      ],
    },
    {
      id: 'part2',
      name: 'Phần 2',
      questions: [
        {
          id: 'Q003',
          correctAnswer: 'C',
          solution: 'Giải thích câu hỏi 3',
          uploadDate: '03/07/2025',
        },
      ],
    },
    {
      id: 'part3',
      name: 'Phần 3',
      questions: [],
    },
  ]);

  const handleDeleteAll = () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa tất cả câu hỏi?')) {
      setParts((prev) =>
        prev.map((part) => ({ ...part, questions: [] }))
      );
      toast.success('Đã xóa tất cả câu hỏi.');
    }
  };

  const handleDeleteQuestion = (partId: string, questionId: string) => {
    setParts((prev) =>
      prev.map((part) =>
        part.id === partId
          ? {
              ...part,
              questions: part.questions.filter((q) => q.id !== questionId),
            }
          : part
      )
    );
    toast.success('Đã xóa câu hỏi.');
  };

  return (
    <div>
      <ExamPartQuestions
        parts={parts}
        onDeleteAll={handleDeleteAll}
        onDeleteQuestion={handleDeleteQuestion}
      />
    </div>
  );
};

export default ManualWordExamQuestions;