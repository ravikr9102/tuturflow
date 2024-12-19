import { Book } from '../../../types/education';
import { chapter1 } from './chapter1';
// Import other chapters as they are added

export const class8Science: Book = {
  id: 'class8_science',
  title: 'Science - Class 8',
  class: '8th',
  subject: 'Science',
  chapters: [
    chapter1,
  ]
};