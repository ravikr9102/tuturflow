import { Chapter } from '../types/education';

/**
 * Utility functions specific to Science content
 */

export const extractScientificTerms = (chapter: Chapter): string[] => {
  const scientificTermPatterns = [
    /Scientific Terms?:/i,
    /Key Concepts?:/i,
    /Definitions?:/i,
    /Important Terms?:/i,
    /Scientific Principles?:/i
  ];

  let scientificTerms: string[] = [];
  
  for (const pattern of scientificTermPatterns) {
    const match = chapter.content.match(new RegExp(`${pattern.source}([^#]*?)(?=\\n\\n|$)`, 'i'));
    if (match && match[1]) {
      const terms = match[1]
        .split(/[,\n]/)
        .map(term => term.trim())
        .filter(term => term.length > 0);
      scientificTerms = [...scientificTerms, ...terms];
    }
  }

  return [...new Set(scientificTerms)];
};

export const extractExperiments = (chapter: Chapter): {
  title: string;
  materials: string[];
  procedure: string[];
  observations: string[];
}[] => {
  const experimentPattern = /Experiment:([^#]*?)(?=\n\n|$)/gi;
  const experiments: Array<{
    title: string;
    materials: string[];
    procedure: string[];
    observations: string[];
  }> = [];

  let match;
  while ((match = experimentPattern.exec(chapter.content)) !== null) {
    const experimentContent = match[1];
    
    // Extract experiment components
    const titleMatch = experimentContent.match(/Title:(.*?)(?=\n|$)/i);
    const materialsMatch = experimentContent.match(/Materials Required:(.*?)(?=\n\n|$)/is);
    const procedureMatch = experimentContent.match(/Procedure:(.*?)(?=\n\n|$)/is);
    const observationsMatch = experimentContent.match(/Observations:(.*?)(?=\n\n|$)/is);

    if (titleMatch) {
      experiments.push({
        title: titleMatch[1].trim(),
        materials: materialsMatch ? 
          materialsMatch[1].split('\n').map(m => m.trim()).filter(m => m.length > 0) : [],
        procedure: procedureMatch ?
          procedureMatch[1].split('\n').map(p => p.trim()).filter(p => p.length > 0) : [],
        observations: observationsMatch ?
          observationsMatch[1].split('\n').map(o => o.trim()).filter(o => o.length > 0) : []
      });
    }
  }

  return experiments;
};

export const extractDiagrams = (chapter: Chapter): {
  title: string;
  description: string;
  labels?: string[];
}[] => {
  const diagramPattern = /Figure \d+:(.*?)(?=\n\n|$)/gi;
  const diagrams: Array<{
    title: string;
    description: string;
    labels?: string[];
  }> = [];

  let match;
  while ((match = diagramPattern.exec(chapter.content)) !== null) {
    const diagramContent = match[1];
    
    // Extract diagram components
    const titleMatch = diagramContent.match(/(.*?)(?=\n|$)/);
    const descriptionMatch = diagramContent.match(/Description:(.*?)(?=\n\n|$)/is);
    const labelsMatch = diagramContent.match(/Labels:(.*?)(?=\n\n|$)/is);

    if (titleMatch) {
      diagrams.push({
        title: titleMatch[1].trim(),
        description: descriptionMatch ? descriptionMatch[1].trim() : '',
        labels: labelsMatch ? 
          labelsMatch[1].split(',').map(l => l.trim()).filter(l => l.length > 0) : undefined
      });
    }
  }

  return diagrams;
};