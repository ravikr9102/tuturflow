import { Subject, ClassLevel } from './education';

export interface DiagramMetadata {
  id: string;
  title: string;
  description: string;
  subject: Subject;
  classLevel: ClassLevel;
  chapter: string;
  url: string;
  labels?: string[];
  keywords: string[];
}

export interface DiagramCollection {
  [subject: string]: {
    [classLevel: string]: {
      [chapter: string]: DiagramMetadata[];
    };
  };
}