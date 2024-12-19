import { generateImage } from '../dalle.service';
import { IMAGE_GENERATION_PROMPT, getImageResponseText } from './prompts';

export const shouldGenerateImage = (message: string): boolean => {
  const visualKeywords = [
    'draw',
    'show me',
    'picture',
    'image',
    'diagram',
    'illustration',
    'visualize',
    'visual',
    'sketch',
    'demonstrate'
  ];
  return visualKeywords.some(keyword => message.toLowerCase().includes(keyword));
};

export const generateImageResponse = async (
  openai: any,
  userMessage: string
): Promise<string | null> => {
  try {
    // Generate an optimized image prompt
    const imagePromptResponse = await openai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: IMAGE_GENERATION_PROMPT
        },
        {
          role: 'user',
          content: userMessage
        }
      ],
      model: 'gpt-3.5-turbo',
      temperature: 0.7,
      max_tokens: 100,
    });

    const imagePrompt = imagePromptResponse.choices[0].message.content;
    if (imagePrompt) {
      const imageUrl = await generateImage(imagePrompt);
      return imageUrl;
    }
    return null;
  } catch (error) {
    console.error('Error generating image:', error);
    return null;
  }
};

export const formatFinalResponse = (
  textResponse: string,
  imageUrl: string | null,
  topic: string
): string => {
  if (!imageUrl) {
    return textResponse;
  }

  // Extract the topic from the user's request
  const cleanTopic = topic.replace(/^(draw|show|create|make|generate)\s+(a|an|the)\s+/i, '');
  
  // Combine the response with the image
  return `${getImageResponseText(cleanTopic)}\n\n![Generated Diagram](${imageUrl})\n\n${textResponse}`;
};