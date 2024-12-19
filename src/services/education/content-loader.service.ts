import { Book, Chapter } from '../../types/education';
import { processChapterContent } from '../../utils/content-processor';
import { ContentService } from './content.service';

export class ContentLoaderService {
  constructor(private contentService: ContentService) {}

  async loadBook(book: Book) {
    console.log(`Loading ${book.title}...`);
    
    for (const chapter of book.chapters) {
      await this.loadChapter(chapter);
    }
  }

  private async loadChapter(chapter: Chapter) {
    try {
      // Process chapter content before adding to vector store
      const processedChapter = processChapterContent(chapter);
      await this.contentService.addChapter(processedChapter);
      console.log(`Loaded chapter: ${chapter.title}`);
    } catch (error) {
      console.error(`Error loading chapter ${chapter.title}:`, error);
      throw error;
    }
  }
}