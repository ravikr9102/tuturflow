export type Board = 'CBSE' | 'ICSE' | 'State Board';
export type ClassLevel = '6th' | '7th' | '8th' | '9th' | '10th' | '11th' | '12th';
export type Medium = 'English' | 'Hindi' | 'Regional';

export interface EducationalInfo {
  board: Board;
  classLevel: ClassLevel;
  medium: Medium;
}