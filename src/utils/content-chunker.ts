/**
 * Splits content into smaller chunks for efficient processing
 * while maintaining context and readability
 */
export const chunkContent = (content: string, maxChunkSize: number = 1000): string[] => {
  // Split by paragraphs first
  const paragraphs = content.split(/\n\n+/);
  const chunks: string[] = [];
  let currentChunk = '';

  for (const paragraph of paragraphs) {
    if (currentChunk.length + paragraph.length > maxChunkSize && currentChunk.length > 0) {
      chunks.push(currentChunk.trim());
      currentChunk = '';
    }
    
    currentChunk += (currentChunk ? '\n\n' : '') + paragraph;
  }

  if (currentChunk.length > 0) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
};