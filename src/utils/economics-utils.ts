import { Chapter } from '../types/education';

/**
 * Utility functions specific to Economics content
 */

export const extractEconomicTerms = (chapter: Chapter): string[] => {
  const economicTermPatterns = [
    /Economic Terms?:/i,
    /Key Concepts?:/i,
    /Definitions?:/i,
    /Important Terms?:/i,
    /Economic Indicators?:/i
  ];

  let economicTerms: string[] = [];
  
  for (const pattern of economicTermPatterns) {
    const match = chapter.content.match(new RegExp(`${pattern.source}([^#]*?)(?=\\n\\n|$)`, 'i'));
    if (match && match[1]) {
      const terms = match[1]
        .split(/[,\n]/)
        .map(term => term.trim())
        .filter(term => term.length > 0);
      economicTerms = [...economicTerms, ...terms];
    }
  }

  return [...new Set(economicTerms)];
};

export const extractEconomicData = (chapter: Chapter): {
  statistics: string[];
  graphs: string[];
  tables: string[];
} => {
  const patterns = {
    statistics: /Statistical Data?:|Economic Data?:/i,
    graphs: /Graphs?:|Charts?:/i,
    tables: /Tables?:|Data Tables?:/i
  };

  const result = {
    statistics: [] as string[],
    graphs: [] as string[],
    tables: [] as string[]
  };

  // Extract statistics
  const statsMatch = chapter.content.match(new RegExp(`${patterns.statistics.source}([^#]*?)(?=\\n\\n|$)`, 'i'));
  if (statsMatch && statsMatch[1]) {
    result.statistics = statsMatch[1]
      .split(/\n/)
      .map(stat => stat.trim())
      .filter(stat => stat.length > 0);
  }

  // Extract graphs
  const graphsMatch = chapter.content.match(new RegExp(`${patterns.graphs.source}([^#]*?)(?=\\n\\n|$)`, 'i'));
  if (graphsMatch && graphsMatch[1]) {
    result.graphs = graphsMatch[1]
      .split(/\n/)
      .map(graph => graph.trim())
      .filter(graph => graph.length > 0);
  }

  // Extract tables
  const tablesMatch = chapter.content.match(new RegExp(`${patterns.tables.source}([^#]*?)(?=\\n\\n|$)`, 'i'));
  if (tablesMatch && tablesMatch[1]) {
    result.tables = tablesMatch[1]
      .split(/\n/)
      .map(table => table.trim())
      .filter(table => table.length > 0);
  }

  return result;
};