import { Chapter } from '../types/education';

/**
 * Utility functions specific to History content
 */

export const extractHistoricalTerms = (chapter: Chapter): string[] => {
  const historicalTermPatterns = [
    /Historical Terms?:/i,
    /Key Events?:/i,
    /Important Dates?:/i,
    /Historical Figures?:/i,
    /Historical Concepts?:/i
  ];

  let historicalTerms: string[] = [];
  
  for (const pattern of historicalTermPatterns) {
    const match = chapter.content.match(new RegExp(`${pattern.source}([^#]*?)(?=\\n\\n|$)`, 'i'));
    if (match && match[1]) {
      const terms = match[1]
        .split(/[,\n]/)
        .map(term => term.trim())
        .filter(term => term.length > 0);
      historicalTerms = [...historicalTerms, ...terms];
    }
  }

  return [...new Set(historicalTerms)];
};

export const extractTimelineData = (chapter: Chapter): {
  events: string[];
  dates: string[];
  periods: string[];
} => {
  const patterns = {
    events: /Important Events?:|Key Events?:/i,
    dates: /Important Dates?:|Timeline?:/i,
    periods: /Historical Periods?:|Eras?:/i
  };

  const result = {
    events: [] as string[],
    dates: [] as string[],
    periods: [] as string[]
  };

  // Extract events
  const eventsMatch = chapter.content.match(new RegExp(`${patterns.events.source}([^#]*?)(?=\\n\\n|$)`, 'i'));
  if (eventsMatch && eventsMatch[1]) {
    result.events = eventsMatch[1]
      .split(/\n/)
      .map(event => event.trim())
      .filter(event => event.length > 0);
  }

  // Extract dates
  const datesMatch = chapter.content.match(new RegExp(`${patterns.dates.source}([^#]*?)(?=\\n\\n|$)`, 'i'));
  if (datesMatch && datesMatch[1]) {
    result.dates = datesMatch[1]
      .split(/\n/)
      .map(date => date.trim())
      .filter(date => date.length > 0);
  }

  // Extract periods
  const periodsMatch = chapter.content.match(new RegExp(`${patterns.periods.source}([^#]*?)(?=\\n\\n|$)`, 'i'));
  if (periodsMatch && periodsMatch[1]) {
    result.periods = periodsMatch[1]
      .split(/\n/)
      .map(period => period.trim())
      .filter(period => period.length > 0);
  }

  return result;
};