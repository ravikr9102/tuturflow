import { DiagramMetadata } from '../types/diagram';
import { class11PhysicsDiagrams } from '../data/diagrams/physics/class11';
import { class11BiologyDiagrams } from '../data/diagrams/biology/class11';
import { class11ChemistryDiagrams } from '../data/diagrams/chemistry/class11';
import { class6HistoryDiagrams } from '../data/diagrams/history/class6';
import { class6GeographyDiagrams } from '../data/diagrams/geography/class6';

export class DiagramService {
  private diagrams: DiagramMetadata[] = [];
  private readonly RELEVANCE_THRESHOLD = 0.3; // Minimum relevance score to consider a match

  constructor() {
    this.loadDiagrams();
  }

  private loadDiagrams() {
    this.diagrams = [
      ...class11PhysicsDiagrams,
      ...class11BiologyDiagrams,
      ...class11ChemistryDiagrams,
      ...class6HistoryDiagrams,
      ...class6GeographyDiagrams,
    ];
  }

  findRelevantDiagrams(query: string, filters?: {
    subject?: string;
    classLevel?: string;
    chapter?: string;
  }): DiagramMetadata[] {
    const keywords = query.toLowerCase().split(' ')
      .filter(word => word.length > 2) // Filter out short words
      .filter(word => !['draw', 'show', 'me', 'the', 'of', 'a', 'an'].includes(word)); // Filter common words
    
    return this.diagrams
      .filter(diagram => {
        // Apply subject filter if provided
        if (filters?.subject && 
            filters.subject.toLowerCase() !== diagram.subject.toLowerCase()) {
          return false;
        }

        // Apply class level filter if provided
        if (filters?.classLevel && diagram.classLevel !== filters.classLevel) {
          return false;
        }

        // Apply chapter filter if provided
        if (filters?.chapter && 
            !diagram.chapter.toLowerCase().includes(filters.chapter.toLowerCase())) {
          return false;
        }

        // Check if diagram matches query keywords
        const diagramText = [
          diagram.title,
          diagram.description,
          ...(diagram.labels || []),
          ...diagram.keywords
        ].join(' ').toLowerCase();

        // Calculate relevance score
        const matchingKeywords = keywords.filter(keyword => 
          diagramText.includes(keyword)
        );

        return matchingKeywords.length > 0;
      })
      .sort((a, b) => {
        // Sort by keyword match relevance
        const aScore = this.calculateRelevanceScore(keywords, a);
        const bScore = this.calculateRelevanceScore(keywords, b);
        return bScore - aScore;
      });
  }

  isRelevantMatch(query: string, diagram: DiagramMetadata): boolean {
    const keywords = query.toLowerCase().split(' ')
      .filter(word => word.length > 2)
      .filter(word => !['draw', 'show', 'me', 'the', 'of', 'a', 'an'].includes(word));
    
    const relevanceScore = this.calculateRelevanceScore(keywords, diagram);
    return relevanceScore >= this.RELEVANCE_THRESHOLD;
  }

  private calculateRelevanceScore(keywords: string[], diagram: DiagramMetadata): number {
    const diagramText = [
      diagram.title,
      diagram.description,
      ...(diagram.labels || []),
      ...diagram.keywords
    ].join(' ').toLowerCase();

    const matchingKeywords = keywords.filter(keyword => 
      diagramText.includes(keyword)
    );

    // Calculate score based on:
    // 1. Proportion of matching keywords
    // 2. Exact matches in title/keywords (weighted higher)
    // 3. Length of continuous matches
    
    const keywordScore = matchingKeywords.length / keywords.length;
    const titleKeywordScore = keywords.filter(k => 
      diagram.title.toLowerCase().includes(k) || 
      diagram.keywords.some(dk => dk.includes(k))
    ).length / keywords.length;

    return (keywordScore * 0.4) + (titleKeywordScore * 0.6);
  }
}