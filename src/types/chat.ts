export interface ChatSession {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  messages: {
    id: string;
    content: string;
    sender: 'user' | 'ai';
    timestamp: string;
  }[];
}

export interface UserChats {
  sessions: ChatSession[];
  activeSessionId: string | null;
}