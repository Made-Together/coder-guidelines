import { NextApiRequest, NextApiResponse } from 'next';
import { promises as fs } from 'fs';
import { join } from 'path';
import yaml from 'js-yaml';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Get the content directory path
    const contentDir = join(process.cwd(), 'content/chapters');

    // Read all files in the directory
    const files = await fs.readdir(contentDir);

    // Read and parse each YAML file
    const chapters = await Promise.all(
      files
        .filter(file => file.endsWith('.yaml'))
        .map(async file => {
          const content = await fs.readFile(join(contentDir, file), 'utf8');
          return yaml.load(content);
        })
    );

    // Sort chapters by their order field
    const sortedChapters = chapters.sort((a: any, b: any) => {
      // If order is not defined, use a large number to push to the end
      const orderA = typeof a.order === 'number' ? a.order : Number.MAX_SAFE_INTEGER;
      const orderB = typeof b.order === 'number' ? b.order : Number.MAX_SAFE_INTEGER;
      return orderA - orderB;
    });

    res.status(200).json(sortedChapters);
  } catch (error) {
    console.error('Error reading chapters:', error);
    res.status(500).json({ error: 'Failed to load chapters' });
  }
}