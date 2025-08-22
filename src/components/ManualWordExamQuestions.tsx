import React from 'react';
import ExamPartQuestions, { ExamPart } from './ExamPartQuestions';

interface Question {
  id: string;
  correctAnswer: string;
  solution: string;
  documentLink?: string;
  videoLink?: string;
  uploadDate: string;
}

interface ExamPartLocal {
  id: string;
  name: string;
  questions: Question[];
}

interface ManualWordExamQuestionsProps {
  parts: ExamPartLocal[];
  onDeleteAll: () => void;
  onDeleteQuestion: (partId: string, questionId: string) => void;
  onDeletePart: (partId: string) => void;
  renderPartHeader?: (partId: string) => React.ReactNode;
  onAddDefaultPart: () => void;
  onAddGroupPart: () => void;
  onAddOrUpdateQuestion: (partId: string, questionId: string | null, newQuestion: Question) => void;
  onUpdateParts?: (updatedParts: ExamPart[]) => void; // forwarded prop
}

const ManualWordExamQuestions: React.FC<ManualWordExamQuestionsProps> = ({
  parts,
  onDeleteAll,
  onDeleteQuestion,
  onDeletePart,
  renderPartHeader,
  onAddDefaultPart,
  onAddGroupPart,
  onAddOrUpdateQuestion,
  onUpdateParts,
}) => {
  return (
    <div>
      <ExamPartQuestions
        parts={parts}
        onDeleteAll={onDeleteAll}
        onDeleteQuestion={onDeleteQuestion}
        onDeletePart={onDeletePart}
        renderPartHeader={renderPartHeader}
        onAddDefaultPart={onAddDefaultPart}
        onAddGroupPart={onAddGroupPart}
        onAddOrUpdateQuestion={onAddOrUpdateQuestion}
        onUpdateParts={onUpdateParts}
      />
    </div>
  );
};

export default ManualWordExamQuestions;