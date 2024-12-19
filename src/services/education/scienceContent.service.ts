import { ContentService } from './content.service';
import { chapter1 } from '../../data/science/class8/chapter1';

export class ScienceContentService {
  private contentService: ContentService;

  constructor(apiKey: string) {
    this.contentService = new ContentService(apiKey);
  }

  async loadClass8Content() {
    try {
      await this.contentService.initialize();
      
      // Load Chapter 1
      await this.contentService.addChapter(chapter1);

      console.log('Class 8 Science content loaded successfully');
    } catch (error) {
      console.error('Error loading Class 8 Science content:', error);
      throw error;
    }
  }

  async searchContent(query: string) {
    return await this.contentService.getRelevantContent(query, {
      subject: 'Science',
      classLevel: '8th'
    });
  }
}