import OpenAI from 'openai';
import { DiagramService } from './diagram.service';
import { extractDiagramContext, formatDiagramResponse } from '../utils/diagram.utils';
import { SYSTEM_PROMPT } from './ai/prompts';
import { EducationalContentService } from './education';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

const diagramService = new DiagramService();
const educationalContent = new EducationalContentService(import.meta.env.VITE_OPENAI_API_KEY);

// Initialize content on service start
educationalContent.loadAllContent().catch(console.error);

// Helper function to check if message requests a diagram/image
const shouldGenerateImage = (message: string): boolean => {
  const visualKeywords = [
    'draw',
    'show me',
    'picture',
    'image',
    'diagram',
    'illustration',
    'visualize',
    'visual',
    'sketch',
    'demonstrate'
  ];
  const hasVisualKeyword = visualKeywords.some(keyword => message.toLowerCase().includes(keyword));
  
  // Additional check to avoid triggering on phrases like "let me demonstrate" or "I'll show you"
  const isRequestingVisual = hasVisualKeyword && 
    !message.toLowerCase().includes("let me") && 
    !message.toLowerCase().includes("i'll show");
    
  return isRequestingVisual;
};

export const generateChatResponse = async (messages: { role: 'user' | 'assistant' | 'system'; content: string }[]) => {
  try {
    const userMessage = messages[messages.length - 1].content;
    const isDiagramRequest = shouldGenerateImage(userMessage);

    // Extract context for filtering relevant content
    const context = extractDiagramContext(userMessage);
    
    // Get relevant educational content
    const relevantContent = await educationalContent.searchContent(userMessage, {
      subject: context.subject,
      classLevel: context.classLevel
    });

    // If it's a diagram request, try to find a relevant NCERT diagram first
    if (isDiagramRequest) {
      const relevantDiagrams = diagramService.findRelevantDiagrams(userMessage, {
        subject: context.subject,
        classLevel: context.classLevel,
        chapter: context.chapter
      });

      // Only proceed with diagram if we have a highly relevant match
      if (relevantDiagrams.length > 0 && diagramService.isRelevantMatch(userMessage, relevantDiagrams[0])) {
        return formatDiagramResponse(relevantDiagrams[0]);
      }

      // If no relevant diagrams found or match isn't strong enough, return a helpful message
      return `I apologize, but I couldn't find a relevant diagram in your NCERT textbooks for "${userMessage}". 

The diagrams I can show you are limited to those available in your NCERT textbooks. This helps ensure accuracy and alignment with your curriculum.

Would you like me to:
1. Explain this concept textually instead?
2. Show you the available diagrams from your textbooks?
3. Help you find where this topic is covered in your curriculum?

Please let me know how I can help you understand this topic better!`;
    }

    // For non-diagram requests, proceed with text response
    const contextEnrichedMessages = [
      {
        role: 'system',
        content: `${SYSTEM_PROMPT}\n\nRelevant NCERT content:\n${relevantContent.documents.join('\n\n')}`
      },
      ...messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }))
    ];

    const completion = await openai.chat.completions.create({
      messages: contextEnrichedMessages,
      model: 'gpt-3.5-turbo',
      temperature: 0.7,
      max_tokens: 1000,
    });

    return completion.choices[0].message.content || 'I apologize, but I could not generate a response.';
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw new Error('Failed to generate response');
  }
};