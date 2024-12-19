import { ContentService } from './content.service';
import { historyBooks } from '../../data/history';

export class HistoryContentService {
  private contentService: ContentService;

  constructor(apiKey: string) {
    this.contentService = new ContentService(apiKey);
  }

  async loadAllContent() {
    try {
      await this.contentService.initialize();
      
      // Load content for classes 6-11
      for (const chapter of historyBooks.class6.chapters) {
        await this.contentService.addChapter(chapter);
      }
      for (const chapter of historyBooks.class7.chapters) {
        await this.contentService.addChapter(chapter);
      }
      for (const chapter of historyBooks.class8.chapters) {
        await this.contentService.addChapter(chapter);
      }
      for (const chapter of historyBooks.class9.chapters) {
        await this.contentService.addChapter(chapter);
      }
      for (const chapter of historyBooks.class10.chapters) {
        await this.contentService.addChapter(chapter);
      }
      for (const chapter of historyBooks.class11.chapters) {
        await this.contentService.addChapter(chapter);
      }

      // Load Class 12 content (all parts)
      for (const chapter of historyBooks.class12.part1.chapters) {
        await this.contentService.addChapter(chapter);
      }
      for (const chapter of historyBooks.class12.part2.chapters) {
        await this.contentService.addChapter(chapter);
      }
      for (const chapter of historyBooks.class12.part3.chapters) {
        await this.contentService.addChapter(chapter);
      }

      console.log('History content loaded successfully');
    } catch (error) {
      console.error('Error loading History content:', error);
      throw error;
    }
  }

  async searchContent(query: string, classLevel?: string) {
    return await this.contentService.getRelevantContent(query, {
      subject: 'History',
      classLevel
    });
  }
}