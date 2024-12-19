import { DiagramMetadata } from '../types/diagram';
import { diagramContexts } from '../data/diagrams/physics/class11';
import { biologyDiagramContexts } from '../data/diagrams/biology/class11';
import { Subject, ClassLevel } from '../types/education';

interface DiagramContext {
  subject?: Subject;
  classLevel?: ClassLevel;
  chapter?: string;
}

export const extractDiagramContext = (message: string): DiagramContext => {
  const context: DiagramContext = {};

  // Extract subject with improved matching
  const subjectKeywords = {
    physics: ['physics', 'force', 'motion', 'energy', 'atom'],
    biology: ['biology', 'plant', 'animal', 'cell', 'photosynthesis'],
    chemistry: ['chemistry', 'reaction', 'molecule', 'compound'],
    mathematics: ['math', 'algebra', 'geometry', 'calculus'],
  };

  for (const [subject, keywords] of Object.entries(subjectKeywords)) {
    if (keywords.some(keyword => message.toLowerCase().includes(keyword))) {
      context.subject = subject.charAt(0).toUpperCase() + subject.slice(1) as Subject;
      break;
    }
  }

  // Extract class level
  const classMatches = message.match(/\b(class\s+)?(6|7|8|9|10|11|12)(th)?\b/i);
  if (classMatches) {
    context.classLevel = `${classMatches[2]}th` as ClassLevel;
  }

  // Extract chapter context
  const chapterKeywords = [
    'chapter',
    'unit',
    'topic',
    'section'
  ];

  for (const keyword of chapterKeywords) {
    const chapterMatch = message.match(new RegExp(`\\b${keyword}\\s+([\\w\\s]+)\\b`, 'i'));
    if (chapterMatch) {
      context.chapter = chapterMatch[1].trim();
      break;
    }
  }

  return context;
};

export const formatDiagramResponse = (diagram: DiagramMetadata): string => {
  if (!diagram) {
    return "I apologize, but I couldn't find a relevant diagram in your NCERT textbooks for this topic. Would you like me to explain the concept textually instead?";
  }

  // Get the appropriate context based on subject
  const context = diagram.subject === 'Biology' 
    ? biologyDiagramContexts[diagram.id]
    : diagramContexts[diagram.id];
  
  const response = `Here's a relevant diagram from your NCERT ${diagram.subject} textbook (Class ${diagram.classLevel}, ${diagram.chapter}):

![${diagram.title}](${diagram.url})

${diagram.description}

${context?.theoreticalContext || ''}

${diagram.labels ? '\nKey components:\n' + diagram.labels.map(label => `- ${label}`).join('\n') : ''}

${context?.process ? '\nProcess:\n' + context.process : ''}
${context?.importance ? '\nImportance:\n' + context.importance : ''}`;

  return response.trim();
};