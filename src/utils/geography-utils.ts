import { Chapter } from '../types/education';

/**
 * Utility functions specific to Geography content
 */

export const extractGeographicTerms = (chapter: Chapter): string[] => {
  const geographicTermPatterns = [
    /Geographic Terms?:/i,
    /Key Features?:/i,
    /Landforms?:/i,
    /Climate Patterns?:/i,
    /Geographic Concepts?:/i
  ];

  let geographicTerms: string[] = [];
  
  for (const pattern of geographicTermPatterns) {
    const match = chapter.content.match(new RegExp(`${pattern.source}([^#]*?)(?=\\n\\n|$)`, 'i'));
    if (match && match[1]) {
      const terms = match[1]
        .split(/[,\n]/)
        .map(term => term.trim())
        .filter(term => term.length > 0);
      geographicTerms = [...geographicTerms, ...terms];
    }
  }

  return [...new Set(geographicTerms)];
};

export const extractMapData = (chapter: Chapter): {
  maps: string[];
  locations: string[];
  regions: string[];
} => {
  const patterns = {
    maps: /Maps?:|Map References?:/i,
    locations: /Important Locations?:|Places?:/i,
    regions: /Regions?:|Geographic Regions?:/i
  };

  const result = {
    maps: [] as string[],
    locations: [] as string[],
    regions: [] as string[]
  };

  // Extract maps
  const mapsMatch = chapter.content.match(new RegExp(`${patterns.maps.source}([^#]*?)(?=\\n\\n|$)`, 'i'));
  if (mapsMatch && mapsMatch[1]) {
    result.maps = mapsMatch[1]
      .split(/\n/)
      .map(map => map.trim())
      .filter(map => map.length > 0);
  }

  // Extract locations
  const locationsMatch = chapter.content.match(new RegExp(`${patterns.locations.source}([^#]*?)(?=\\n\\n|$)`, 'i'));
  if (locationsMatch && locationsMatch[1]) {
    result.locations = locationsMatch[1]
      .split(/\n/)
      .map(location => location.trim())
      .filter(location => location.length > 0);
  }

  // Extract regions
  const regionsMatch = chapter.content.match(new RegExp(`${patterns.regions.source}([^#]*?)(?=\\n\\n|$)`, 'i'));
  if (regionsMatch && regionsMatch[1]) {
    result.regions = regionsMatch[1]
      .split(/\n/)
      .map(region => region.trim())
      .filter(region => region.length > 0);
  }

  return result;
};