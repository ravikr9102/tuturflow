import { marked } from 'marked';

// Configure marked options for safe rendering
marked.setOptions({
  gfm: true, // GitHub Flavored Markdown
  breaks: true, // Convert \n to <br>
  sanitize: false, // Don't sanitize HTML tags to allow images
  smartLists: true,
  smartypants: true,
  mangle: false,
  headerIds: false
});

export const formatMarkdown = (text: string): string => {
  if (!text || typeof text !== 'string') {
    console.error('Invalid markdown input:', text);
    return 'Error formatting message';
  }

  try {
    // Clean up the text by removing excessive newlines and spaces
    const cleanText = text
      .replace(/\n{3,}/g, '\n\n') // Replace 3+ newlines with 2
      .replace(/!\[Generated Diagram\]/g, '![AI Generated Diagram]') // Standardize image alt text
      .trim();

    // Parse markdown to HTML
    const html = marked(cleanText);
    
    return html;
  } catch (error) {
    console.error('Error formatting markdown:', error);
    return String(text);
  }
};