import { createReader } from '@keystatic/core/reader';
import config from '@/keystatic.config';

export const reader = createReader(process.cwd(), config);

export async function getChapters() {
  // For now, return an empty array until we figure out how to handle Node.js modules
  return [];
}