import { OpenAIEmbeddings } from '@langchain/openai';
import { Chapter } from '../../types/education';
import { processChapterContent } from '../../utils/content-processor';
import { chunkContent } from '../../utils/content-chunker';

export class ContentService {
  private embeddings: OpenAIEmbeddings;
  private documents: Array<{
    embedding: number[];
    document: Chapter;
  }>;

  constructor(apiKey: string) {
    this.embeddings = new OpenAIEmbeddings({ openAIApiKey: apiKey });
    this.documents = [];
  }

  async initialize() {
    return this;
  }

  async addChapter(chapter: Chapter) {
    try {
      // Process chapter content before embedding
      const processedChapter = processChapterContent(chapter);
      
      // Split content into chunks for better processing
      const chunks = chunkContent(processedChapter.content);
      
      // Create embeddings for each chunk
      for (const chunk of chunks) {
        const embedding = await this.embeddings.embedQuery(chunk);
        this.documents.push({
          embedding,
          document: { ...processedChapter, content: chunk }
        });
      }
    } catch (error) {
      console.error('Error adding chapter:', error);
      throw error;
    }
  }

  private cosineSimilarity(a: number[], b: number[]): number {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    
    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }
    
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  async getRelevantContent(query: string, filters?: {
    subject?: string;
    classLevel?: string;
    bookPart?: string;
  }) {
    try {
      const queryEmbedding = await this.embeddings.embedQuery(query);
      
      let results = this.documents
        .map(doc => ({
          similarity: this.cosineSimilarity(queryEmbedding, doc.embedding),
          document: doc.document
        }))
        .filter(result => {
          if (!filters) return true;
          return (!filters.subject || result.document.subject === filters.subject) &&
                 (!filters.classLevel || result.document.classLevel === filters.classLevel) &&
                 (!filters.bookPart || result.document.bookPart === filters.bookPart);
        })
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, 3);

      return {
        documents: results.map(r => r.document.content),
        metadatas: results.map(r => ({
          id: r.document.id,
          subject: r.document.subject,
          classLevel: r.document.classLevel,
          title: r.document.title,
          bookPart: r.document.bookPart
        }))
      };
    } catch (error) {
      console.error('Error searching content:', error);
      throw error;
    }
  }
}