import { ContentService } from './content.service';
import { physicsBooks } from '../../data/physics';

export class PhysicsContentService {
  private contentService: ContentService;

  constructor(apiKey: string) {
    this.contentService = new ContentService(apiKey);
  }

  async loadAllContent() {
    try {
      await this.contentService.initialize();
      
      // Load Class 11 content
      for (const chapter of physicsBooks.class11.part1.chapters) {
        await this.contentService.addChapter(chapter);
      }
      for (const chapter of physicsBooks.class11.part2.chapters) {
        await this.contentService.addChapter(chapter);
      }

      // Load Class 12 content
      for (const chapter of physicsBooks.class12.part1.chapters) {
        await this.contentService.addChapter(chapter);
      }
      for (const chapter of physicsBooks.class12.part2.chapters) {
        await this.contentService.addChapter(chapter);
      }

      console.log('Physics content loaded successfully');
    } catch (error) {
      console.error('Error loading Physics content:', error);
      throw error;
    }
  }

  async searchContent(query: string, classLevel?: '11th' | '12th', part?: 'Part-1' | 'Part-2') {
    return await this.contentService.getRelevantContent(query, {
      subject: 'Physics',
      classLevel,
      bookPart: part
    });
  }
}