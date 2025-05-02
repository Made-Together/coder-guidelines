import { NextApiRequest, NextApiResponse } from 'next';
import { promises as fs } from 'fs';
import { join } from 'path';
import yaml from 'js-yaml';

type GlobalConfig = {
  masthead: {
    image: string;
    alt: string;
  };
  footer: {
    image: string;
    alt: string;
    width: number;
    height: number;
    copyright: string;
    credit: {
      text: string;
      link: {
        text: string;
        url: string;
      };
    };
  };
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Get the content directory path
    const contentDir = join(process.cwd(), 'content');
    const filePath = join(contentDir, 'global.yaml');

    // Check if file exists
    try {
      await fs.access(filePath);
    } catch (error) {
      console.error('Global config file not found:', filePath);
      return res.status(404).json({ error: 'Global config file not found' });
    }

    // Read and parse the file
    const content = await fs.readFile(filePath, 'utf8');
    const data = yaml.load(content) as GlobalConfig;

    // Validate the data structure
    if (!data || typeof data !== 'object') {
      console.error('Invalid global config data:', data);
      return res.status(500).json({ error: 'Invalid global config data' });
    }

    if (!data.masthead || !data.footer) {
      console.error('Missing required fields in global config:', data);
      return res.status(500).json({ error: 'Missing required fields in global config' });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error('Error reading global config:', error);
    res.status(500).json({ error: 'Failed to load global config' });
  }
}