import { Chapter, ChapterSchema } from '../types/education';
import { ContentService } from '../services/education/content.service';

export async function loadEducationalContent(contentService: ContentService) {
  try {
    await contentService.initialize();

    // Example of how to structure and load a chapter
    const sampleChapter: Chapter = {
      id: '1',
      title: 'Introduction to Algebra',
      subject: 'Mathematics',
      classLevel: '6th',
      content: `
        Algebra is a branch of mathematics that uses letters and symbols to represent numbers and quantities.
        
        Key Concepts:
        1. Variables
        2. Constants
        3. Expressions
        4. Equations
        
        Examples:
        - If x = 5, then 2x = 10
        - If y = 3, then y + 2 = 5
      `,
      keywords: ['algebra', 'variables', 'constants', 'expressions', 'equations'],
      examples: [
        'If x = 5, then 2x = 10',
        'If y = 3, then y + 2 = 5'
      ]
    };

    // Validate the chapter data
    ChapterSchema.parse(sampleChapter);

    // Add the chapter to the vector store
    await contentService.addChapter(sampleChapter);

    console.log('Educational content loaded successfully');
  } catch (error) {
    console.error('Error loading educational content:', error);
    throw error;
  }
}