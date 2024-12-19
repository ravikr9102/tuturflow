import { Chapter } from '../types/education';

/**
 * Utility functions specific to Physics content
 */

export const extractPhysicsFormulas = (chapter: Chapter): string[] => {
  const formulaPatterns = [
    /Formulas?:/i,
    /Equations?:/i,
    /Mathematical Relations?:/i,
    /Laws?:/i
  ];

  let formulas: string[] = [];
  
  for (const pattern of formulaPatterns) {
    const match = chapter.content.match(new RegExp(`${pattern.source}([^#]*?)(?=\\n\\n|$)`, 'i'));
    if (match && match[1]) {
      const terms = match[1]
        .split(/\n/)
        .map(formula => formula.trim())
        .filter(formula => formula.length > 0);
      formulas = [...formulas, ...terms];
    }
  }

  return [...new Set(formulas)];
};

export const extractPhysicalConstants = (chapter: Chapter): {
  name: string;
  symbol: string;
  value: string;
  unit: string;
}[] => {
  const constantPattern = /Constants?:|Physical Constants?:/i;
  const constants: Array<{
    name: string;
    symbol: string;
    value: string;
    unit: string;
  }> = [];

  const match = chapter.content.match(new RegExp(`${constantPattern.source}([^#]*?)(?=\\n\\n|$)`, 'i'));
  if (match && match[1]) {
    const lines = match[1].split('\n').filter(line => line.trim().length > 0);
    
    for (const line of lines) {
      const parts = line.split(',').map(part => part.trim());
      if (parts.length >= 4) {
        constants.push({
          name: parts[0],
          symbol: parts[1],
          value: parts[2],
          unit: parts[3]
        });
      }
    }
  }

  return constants;
};