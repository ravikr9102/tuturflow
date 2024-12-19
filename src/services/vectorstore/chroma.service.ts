import { Chapter } from '../../types/education';
import { OpenAIEmbeddings } from '@langchain/openai';

interface DocumentWithEmbedding {
  embedding: number[];
  document: Chapter;
}

export class ChromaService {
  private embeddings: OpenAIEmbeddings;
  private documents: DocumentWithEmbedding[];

  constructor(apiKey: string) {
    this.embeddings = new OpenAIEmbeddings({ openAIApiKey: apiKey });
    this.documents = [];
  }

  async initialize() {
    return this;
  }

  async addChapter(chapter: Chapter) {
    try {
      const embedding = await this.embeddings.embedQuery(chapter.content);
      this.documents.push({
        embedding,
        document: chapter
      });
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

  async searchSimilarContent(query: string, filters?: {
    subject?: string;
    classLevel?: string;
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
                 (!filters.classLevel || result.document.classLevel === filters.classLevel);
        })
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, 3);

      return {
        documents: results.map(r => r.document.content),
        metadatas: results.map(r => ({
          id: r.document.id,
          subject: r.document.subject,
          classLevel: r.document.classLevel,
          title: r.document.title
        }))
      };
    } catch (error) {
      console.error('Error searching content:', error);
      throw error;
    }
  }
}