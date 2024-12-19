import React from 'react';
import { SuggestedQuestion } from '../../types';

interface SuggestedQuestionsProps {
  questions: SuggestedQuestion[];
  onQuestionClick: (question: string) => void;
}

export const SuggestedQuestions: React.FC<SuggestedQuestionsProps> = ({
  questions,
  onQuestionClick,
}) => {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {questions.map((question) => (
        <button
          key={question.id}
          onClick={() => onQuestionClick(question.text)}
          className="px-4 py-2 bg-purple-50 text-purple-700 rounded-full text-sm hover:bg-purple-100 transition-colors"
        >
          {question.text} {question.emoji}
        </button>
      ))}
    </div>
  );
};