export interface StudyNote {
  id: string;
  content: string;
  subject: string;
  timestamp: string;
  userId: string;
}

export interface UserNotes {
  notes: StudyNote[];
}