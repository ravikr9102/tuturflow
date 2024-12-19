import { Chapter } from '../types/education';
import { chunkContent } from './content-chunker';
import { extractScientificTerms } from './science-utils';
import { extractPhysicsFormulas } from './physics-utils';
import { extractHistoricalTerms } from './history-utils';
import { extractGeographicTerms } from './geography-utils';

/**
 * Processes chapter content to optimize for vector storage and retrieval
 */
export const processChapterContent = (chapter: Chapter): Chapter => {
  // Extract relevant terms based on subject
  let extractedTerms: string[] = [];
  switch (chapter.subject) {
    case 'Science':
      extractedTerms = extractScientificTerms(chapter);
      break;
    case 'Physics':
      extractedTerms = extractPhysicsFormulas(chapter);
      break;
    case 'History':
      extractedTerms = extractHistoricalTerms(chapter);
      break;
    case 'Geography':
      extractedTerms = extractGeographicTerms(chapter);
      break;
    // Add other subjects as needed
  }

  // Split content into manageable chunks
  const contentChunks = chunkContent(chapter.content);
  
  // Join chunks with special separator for better context preservation
  const processedContent = contentChunks.join('\n---\n');

  return {
    ...chapter,
    content: processedContent,
    keywords: [
      ...chapter.keywords,
      ...extractedTerms,
      chapter.title.toLowerCase(),
      `class ${chapter.classLevel}`,
      chapter.subject.toLowerCase()
    ]
  };
};