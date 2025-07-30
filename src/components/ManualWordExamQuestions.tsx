import React from 'react';
import ExamPartQuestions from './ExamPartQuestions';
import { toast } from 'sonner';

interface Question {
  id: string;
  correctAnswer: string;
  solution: string;
  documentLink?: string;
  videoLink?: string;
  uploadDate: string;
}

interface ExamPart {
  id: string;
  name: string;
  questions: Question[];
}

interface ManualWordExamQuestionsProps {
  parts: ExamPart[];
  onDeleteAll: () => void;
  onDeleteQuestion: (partId: string, questionId: string) => void;
}

const ManualWordExamQuestions: React.FC<ManualWordExamQuestionsProps> = ({
  parts,
  onDeleteAll,
  onDeleteQuestion,
}) => {
  return (
    <div>
      <ExamPartQuestions
        parts={parts}
        onDeleteAll={onDeleteAll}
        onDeleteQuestion={onDeleteQuestion}
      />
    </div>
  );
};

export default ManualWordExamQuestions;