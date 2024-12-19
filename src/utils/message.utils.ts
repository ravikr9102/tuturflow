import { Message } from '../types';

export const createMessage = (
  content: string,
  sender: 'user' | 'ai',
  id = Date.now().toString(),
  imageUrl?: string
): Message => ({
  id,
  content: content || 'Error: No content provided',
  sender,
  timestamp: new Date(),
  imageUrl
});

export const formatMessagesForOpenAI = (messages: Message[]) => 
  messages.map(msg => ({
    role: msg.sender === 'user' ? 'user' as const : 'assistant' as const,
    content: msg.content
  }));

export const createInitialMessage = (userName?: string | null): Message => 
  createMessage(
    userName
      ? `Hello ${userName}! I'm your AI tutor. How can I help you with your studies today? Feel free to ask me to show you diagrams or illustrations to help explain concepts.`
      : "Hello! I'm your AI tutor. How can I help you with your studies today? Feel free to ask me to show you diagrams or illustrations to help explain concepts.",
    'ai'
  );