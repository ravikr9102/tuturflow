import { ContentService } from './content.service';
import { artAndCultureBooks } from '../../data/art-culture';

export class ArtAndCultureContentService {
  private contentService: ContentService;

  constructor(apiKey: string) {
    this.contentService = new ContentService(apiKey);
  }

  async loadAllContent() {
    try {
      await this.contentService.initialize();
      
      // Load Class 11 content
      for (const chapter of artAndCultureBooks.class11.art.chapters) {
        await this.contentService.addChapter(chapter);
      }
      for (const chapter of artAndCultureBooks.class11.craft.chapters) {
        await this.contentService.addChapter(chapter);
      }

      // Load Class 12 content
      for (const chapter of artAndCultureBooks.class12.craft.chapters) {
        await this.contentService.addChapter(chapter);
      }

      console.log('Art & Culture content loaded successfully');
    } catch (error) {
      console.error('Error loading Art & Culture content:', error);
      throw error;
    }
  }

  async searchContent(query: string, classLevel?: '11th' | '12th') {
    return await this.contentService.getRelevantContent(query, {
      subject: 'Art and Culture',
      classLevel
    });
  }
}