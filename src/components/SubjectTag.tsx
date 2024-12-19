import React from 'react';
import { Subject } from '../types';
import { generatePastelColor, subjectColors } from '../utils/colorUtils';

interface SubjectTagProps {
  subject: Subject;
  onClick?: () => void;
  active?: boolean;
  disabled?: boolean;
}

export const SubjectTag: React.FC<SubjectTagProps> = ({ 
  subject, 
  onClick, 
  active,
  disabled 
}) => {
  const isDefaultSubject = subject in subjectColors;
  const colors = isDefaultSubject 
    ? subjectColors[subject]
    : generatePastelColor(subject);

  return (
    <span
      onClick={disabled ? undefined : onClick}
      className={`
        px-3 py-1 rounded-full text-sm font-medium cursor-pointer transition-all
        ${isDefaultSubject 
          ? `${colors.bg} ${colors.text}` 
          : 'transition-colors'}
        ${active ? 'ring-2 ring-offset-2 ring-indigo-500' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-80'}
      `}
      style={!isDefaultSubject ? {
        backgroundColor: colors.bg,
        color: colors.text
      } : undefined}
    >
      {subject}
    </span>
  );
};