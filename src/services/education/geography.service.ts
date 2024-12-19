import { ContentService } from './content.service';
import { geographyBooks } from '../../data/geography';

export class GeographyContentService {
  private contentService: ContentService;

  constructor(apiKey: string) {
    this.contentService = new ContentService(apiKey);
  }

  async loadAllContent() {
    try {
      await this.contentService.initialize();
      
      // Load content for classes 6-10
      for (const chapter of geographyBooks.class6.chapters) {
        await this.contentService.addChapter(chapter);
      }
      for (const chapter of geographyBooks.class7.chapters) {
        await this.contentService.addChapter(chapter);
      }
      for (const chapter of geographyBooks.class8.chapters) {
        await this.contentService.addChapter(chapter);
      }
      for (const chapter of geographyBooks.class9.chapters) {
        await this.contentService.addChapter(chapter);
      }
      for (const chapter of geographyBooks.class10.chapters) {
        await this.contentService.addChapter(chapter);
      }

      // Load Class 11 content
      for (const chapter of geographyBooks.class11.physical.chapters) {
        await this.contentService.addChapter(chapter);
      }
      for (const chapter of geographyBooks.class11.india.chapters) {
        await this.contentService.addChapter(chapter);
      }
      for (const chapter of geographyBooks.class11.practical.chapters) {
        await this.contentService.addChapter(chapter);
      }

      // Load Class 12 content
      for (const chapter of geographyBooks.class12.human.chapters) {
        await this.contentService.addChapter(chapter);
      }
      for (const chapter of geographyBooks.class12.india.chapters) {
        await this.contentService.addChapter(chapter);
      }

      console.log('Geography content loaded successfully');
    } catch (error) {
      console.error('Error loading Geography content:', error);
      throw error;
    }
  }

  async searchContent(query: string, classLevel?: string) {
    return await this.contentService.getRelevantContent(query, {
      subject: 'Geography',
      classLevel
    });
  }
}