import { Subject, ClassLevel, Chapter } from '../types/education';

/**
 * Utility functions for working with educational content
 */

export const getSubjectColor = (subject: Subject): string => {
  const colors: Record<Subject, string> = {
    'Mathematics': 'blue',
    'Physics': 'purple',
    'Chemistry': 'green',
    'Biology': 'pink',
    'History': 'yellow',
    'Geography': 'orange',
    'Economics': 'red',
    'Political Science': 'indigo',
    'Sociology': 'teal',
    'Science': 'cyan',
    'Art and Culture': 'rose'
  };
  return colors[subject] || 'gray';
};

export const getClassRange = (subject: Subject): ClassLevel[] => {
  const ranges: Partial<Record<Subject, ClassLevel[]>> = {
    'Science': ['6th', '7th', '8th', '9th', '10th'],
    'Physics': ['11th', '12th'],
    'Chemistry': ['11th', '12th'],
    'Biology': ['11th', '12th'],
    'Political Science': ['6th', '7th', '8th', '9th', '10th', '11th', '12th']
  };
  return ranges[subject] || ['6th', '7th', '8th', '9th', '10th', '11th', '12th'];
};

export const extractKeyTerms = (chapter: Chapter): string[] => {
  // Extract key terms from chapter content using regex patterns
  const keyTermPatterns = [
    /Key Terms?:/i,
    /Important Concepts?:/i,
    /Definitions?:/i
  ];

  let keyTerms: string[] = [];
  
  for (const pattern of keyTermPatterns) {
    const match = chapter.content.match(new RegExp(`${pattern.source}([^#]*?)(?=\\n\\n|$)`, 'i'));
    if (match && match[1]) {
      const terms = match[1]
        .split(/[,\n]/)
        .map(term => term.trim())
        .filter(term => term.length > 0);
      keyTerms = [...keyTerms, ...terms];
    }
  }

  return [...new Set(keyTerms)]; // Remove duplicates
};