import { Chapter } from '../types/education';

export const extractArtTerms = (chapter: Chapter): string[] => {
  const artTermPatterns = [
    /Art Terms?:/i,
    /Artistic Elements?:/i,
    /Techniques?:/i,
    /Materials Used?:/i,
    /Traditional Methods?:/i
  ];

  let artTerms: string[] = [];
  
  for (const pattern of artTermPatterns) {
    const match = chapter.content.match(new RegExp(`${pattern.source}([^#]*?)(?=\\n\\n|$)`, 'i'));
    if (match && match[1]) {
      const terms = match[1]
        .split(/[,\n]/)
        .map(term => term.trim())
        .filter(term => term.length > 0);
      artTerms = [...artTerms, ...terms];
    }
  }

  return [...new Set(artTerms)];
};

export const extractCraftTechniques = (chapter: Chapter): string[] => {
  const craftPatterns = [
    /Traditional Techniques?:/i,
    /Craft Methods?:/i,
    /Production Process?:/i
  ];

  let techniques: string[] = [];
  
  for (const pattern of craftPatterns) {
    const match = chapter.content.match(new RegExp(`${pattern.source}([^#]*?)(?=\\n\\n|$)`, 'i'));
    if (match && match[1]) {
      const terms = match[1]
        .split(/[,\n]/)
        .map(term => term.trim())
        .filter(term => term.length > 0);
      techniques = [...techniques, ...terms];
    }
  }

  return [...new Set(techniques)];
};