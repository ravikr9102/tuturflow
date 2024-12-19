import { ContentService } from './content.service';
import { economicsBooks } from '../../data/economics';

export class EconomicsContentService {
  private contentService: ContentService;

  constructor(apiKey: string) {
    this.contentService = new ContentService(apiKey);
  }

  async loadAllContent() {
    try {
      await this.contentService.initialize();
      
      // Load Class 9 content
      for (const chapter of economicsBooks.class9.chapters) {
        await this.contentService.addChapter(chapter);
      }

      // Load Class 10 content
      for (const chapter of economicsBooks.class10.chapters) {
        await this.contentService.addChapter(chapter);
      }

      // Load Class 11 content
      for (const chapter of economicsBooks.class11.chapters) {
        await this.contentService.addChapter(chapter);
      }

      // Load Class 12 content
      for (const chapter of economicsBooks.class12.macro.chapters) {
        await this.contentService.addChapter(chapter);
      }
      for (const chapter of economicsBooks.class12.micro.chapters) {
        await this.contentService.addChapter(chapter);
      }

      console.log('Economics content loaded successfully');
    } catch (error) {
      console.error('Error loading Economics content:', error);
      throw error;
    }
  }

  async searchContent(query: string, classLevel?: '9th' | '10th' | '11th' | '12th') {
    return await this.contentService.getRelevantContent(query, {
      subject: 'Economics',
      classLevel
    });
  }
}