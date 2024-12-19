export interface StudyNote {
  id: string;
  content: string;
  subject: string;
  timestamp: string;
}

export type Subject = 
  | 'Mathematics'
  | 'Physics'
  | 'Chemistry'
  | 'Biology'
  | 'History'
  | 'Literature'
  | 'Computer Science'
  | string;

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  imageUrl?: string; // For DALL-E generated images
}

export interface SuggestedQuestion {
  id: string;
  text: string;
  emoji?: string;
}