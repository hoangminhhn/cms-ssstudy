export type BlockType = 'title' | 'section' | 'multiple-choice' | 'essay' | 'image' | 'audio' | 'instructions';

export interface TemplateBlockData {
  id: string;
  type: BlockType;
  label: string; // Display label for the block
  content?: string; // For title, instructions
  questionCount?: number; // For multiple-choice, essay
  pointsPerQuestion?: number;
  src?: string; // For image, audio
  // Add more properties as needed for each block type
}