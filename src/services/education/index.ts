import { ContentService } from './content.service';
import { educationalContent } from '../../data';

export class EducationalContentService {
  private contentService: ContentService;

  constructor(apiKey: string) {
    this.contentService = new ContentService(apiKey);
  }

  async loadAllContent() {
    try {
      await this.contentService.initialize();
      
      // Load Science content (Class 6-10)
      for (const classLevel of Object.values(educationalContent.science)) {
        for (const chapter of classLevel.chapters) {
          await this.contentService.addChapter(chapter);
        }
      }

      // Load Physics content (Class 11-12)
      for (const classLevel of Object.values(educationalContent.physics)) {
        for (const part of Object.values(classLevel)) {
          for (const chapter of part.chapters) {
            await this.contentService.addChapter(chapter);
          }
        }
      }

      // Similar loading for other subjects...
      // This pattern continues for chemistry, biology, history, etc.

      console.log('All educational content loaded successfully');
    } catch (error) {
      console.error('Error loading educational content:', error);
      throw error;
    }
  }

  async searchContent(query: string, filters?: {
    subject?: string;
    classLevel?: string;
    bookPart?: string;
  }) {
    return await this.contentService.getRelevantContent(query, filters);
  }
}