// Generate pastel colors that are visually pleasing and readable
export const generatePastelColor = (seed: string): { bg: string; text: string } => {
  // Use string hash to generate a consistent color for the same tag
  const hash = seed.split('').reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);

  // Generate HSL values for pastel colors
  const hue = Math.abs(hash % 360);
  const saturation = 70 + (hash % 20); // 70-90%
  const lightness = 85 + (hash % 10); // 85-95%

  // Generate a darker version of the same hue for text
  const textLightness = 30 + (hash % 20); // 30-50%

  return {
    bg: `hsl(${hue}, ${saturation}%, ${lightness}%)`,
    text: `hsl(${hue}, ${saturation}%, ${textLightness}%)`
  };
};

// Predefined color combinations for default subjects
export const subjectColors: Record<string, { bg: string; text: string }> = {
  'Mathematics': { bg: 'bg-blue-100', text: 'text-blue-700' },
  'Physics': { bg: 'bg-purple-100', text: 'text-purple-700' },
  'Chemistry': { bg: 'bg-green-100', text: 'text-green-700' },
  'Biology': { bg: 'bg-pink-100', text: 'text-pink-700' },
  'History': { bg: 'bg-yellow-100', text: 'text-yellow-700' },
  'Literature': { bg: 'bg-red-100', text: 'text-red-700' },
  'Computer Science': { bg: 'bg-indigo-100', text: 'text-indigo-700' }
};