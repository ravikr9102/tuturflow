import { z } from 'zod';

export const SubjectSchema = z.enum([
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'History',
  'Geography',
  'Economics',
  'Political Science',
  'Sociology',
  'Science',
  'Art and Culture'
]);

export const ClassLevelSchema = z.enum([
  '6th',
  '7th',
  '8th',
  '9th',
  '10th',
  '11th',
  '12th'
]);

export const BookPartSchema = z.enum(['Part-1', 'Part-2', 'Part-3']);

export const ChapterSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  subject: SubjectSchema,
  classLevel: ClassLevelSchema,
  bookPart: BookPartSchema.optional(),
  keywords: z.array(z.string()),
  examples: z.array(z.string()).optional(),
  exercises: z.array(z.string()).optional(),
  summary: z.string().optional(),
  keyTerms: z.array(z.string()).optional(),
  diagrams: z.array(z.string()).optional()
});

export const BookSchema = z.object({
  id: z.string(),
  title: z.string(),
  class: ClassLevelSchema,
  subject: SubjectSchema,
  part: BookPartSchema.optional(),
  chapters: z.array(ChapterSchema)
});

export type Subject = z.infer<typeof SubjectSchema>;
export type ClassLevel = z.infer<typeof ClassLevelSchema>;
export type BookPart = z.infer<typeof BookPartSchema>;
export type Chapter = z.infer<typeof ChapterSchema>;
export type Book = z.infer<typeof BookSchema>;