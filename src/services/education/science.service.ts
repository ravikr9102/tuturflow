import { ContentService } from './content.service';
import { scienceBooks } from '../../data/science';

export class ScienceContentService {
  private contentService: ContentService;

  constructor(apiKey: string) {
    this.contentService = new ContentService(apiKey);
  }

  async loadAllContent() {
    try {
      await this.contentService.initialize();
      
      // Load content for all classes
      for (const classLevel of Object.values(scienceBooks)) {
        for (const chapter of classLevel.chapters) {
          await this.contentService.addChapter(chapter);
        }
      }

      console.log('Science content loaded successfully');
    } catch (error) {
      console.error('Error loading Science content:', error);
      throw error;
    }
  }

  async searchContent(query: string, classLevel?: string) {
    return await this.contentService.getRelevantContent(query, {
      subject: 'Science',
      classLevel
    });
  }
}