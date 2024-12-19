import { ContentService } from './content.service';
import { sociologyBooks } from '../../data/sociology';

export class SociologyContentService {
  private contentService: ContentService;

  constructor(apiKey: string) {
    this.contentService = new ContentService(apiKey);
  }

  async loadClass11Content() {
    try {
      await this.contentService.initialize();
      
      // Load Book 1 chapters
      for (const chapter of sociologyBooks.class11.introducingSociology.chapters) {
        await this.contentService.addChapter(chapter);
      }

      // Load Book 2 chapters when added
      for (const chapter of sociologyBooks.class11.understandingSociety.chapters) {
        await this.contentService.addChapter(chapter);
      }

      console.log('Class 11 Sociology content loaded successfully');
    } catch (error) {
      console.error('Error loading Class 11 Sociology content:', error);
      throw error;
    }
  }

  async loadClass12Content() {
    try {
      await this.contentService.initialize();
      
      // Load Book 1 chapters when added
      for (const chapter of sociologyBooks.class12.indianSociety.chapters) {
        await this.contentService.addChapter(chapter);
      }

      // Load Book 2 chapters when added
      for (const chapter of sociologyBooks.class12.socialChange.chapters) {
        await this.contentService.addChapter(chapter);
      }

      console.log('Class 12 Sociology content loaded successfully');
    } catch (error) {
      console.error('Error loading Class 12 Sociology content:', error);
      throw error;
    }
  }

  async searchContent(query: string, classLevel?: '11th' | '12th') {
    return await this.contentService.getRelevantContent(query, {
      subject: 'Sociology',
      classLevel
    });
  }
}