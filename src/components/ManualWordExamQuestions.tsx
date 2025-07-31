import React from 'react';
import ExamPartQuestions from './ExamPartQuestions';

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
  onDeletePart: (partId: string) => void;
  renderPartHeader?: (partId: string) => React.ReactNode; // New prop
}

const ManualWordExamQuestions: React.FC<ManualWordExamQuestionsProps> = ({
  parts,
  onDeleteAll,
  onDeleteQuestion,
  onDeletePart,
  renderPartHeader,
}) => {
  return (
    <div>
      <ExamPartQuestions
        parts={parts}
        onDeleteAll={onDeleteAll}
        onDeleteQuestion={onDeleteQuestion}
        onDeletePart={onDeletePart}
        renderPartHeader={renderPartHeader}
      />
    </div>
  );
};

export default ManualWordExamQuestions;