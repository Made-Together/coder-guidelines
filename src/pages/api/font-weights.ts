import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

// Map common weight names to numeric values
const weightMap: Record<string, number> = {
  thin: 100,
  extralight: 200,
  light: 300,
  regular: 400,
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
  black: 900
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { directory } = req.query;

  if (!directory || typeof directory !== 'string') {
    return res.status(400).json({ message: 'Directory parameter is required' });
  }

  try {
    const fontsDir = path.join(process.cwd(), 'public', 'fonts', directory);
    console.log('\n=== Font Weight Detection ===');
    console.log('Directory requested:', directory);
    console.log('Full path:', fontsDir);

    // First check if directory exists
    if (!fs.existsSync(fontsDir)) {
      console.log('Directory does not exist!');
      throw new Error(`Directory ${directory} does not exist`);
    }

    // List all files in directory
    const allFiles = fs.readdirSync(fontsDir);
    console.log('\nAll files in directory:', allFiles);

    // Get all .woff2 files in the directory
    const fontFiles = allFiles.filter(file => file.endsWith('.woff2'));
    console.log('\nFound .woff2 files:', fontFiles);
    console.log('Number of font files:', fontFiles.length);

    if (fontFiles.length === 0) {
      console.log('No .woff2 files found in directory!');
      throw new Error('No font files found');
    }

    // Parse weights from filenames
    const weights = fontFiles.map(file => {
      console.log('\nProcessing file:', file);

      // Remove file extension
      const fileNameWithoutExt = file.replace('.woff2', '');

      // Split by hyphen and get the last part which should contain the weight
      const parts = fileNameWithoutExt.split('-');
      console.log('Filename parts:', parts);

      const lastPart = parts[parts.length - 1].toLowerCase();
      console.log('Weight part:', lastPart);

      // Try to find an exact match first
      let weightName = Object.keys(weightMap).find(name => lastPart === name);
      console.log('Exact match found:', weightName || 'none');

      // If no exact match, try partial match
      if (!weightName) {
        weightName = Object.keys(weightMap).find(name => lastPart.includes(name));
        console.log('Partial match found:', weightName || 'none');
      }

      // Default to regular if no match found
      weightName = weightName || 'regular';
      const weightValue = weightMap[weightName];

      const result = {
        name: weightName.charAt(0).toUpperCase() + weightName.slice(1),
        weight: weightValue,
        style: file.toLowerCase().includes('italic') ? 'italic' : 'normal'
      };

      console.log('Final weight data:', result);
      return result;
    });

    // Sort weights by their numeric value
    const sortedWeights = weights.sort((a, b) => a.weight - b.weight);
    console.log('\nFinal sorted weights:', sortedWeights);
    console.log('Total weights found:', sortedWeights.length);

    res.status(200).json({ weights: sortedWeights });
  } catch (error) {
    console.error('\nError getting font weights:', error);
    res.status(500).json({
      message: 'Error getting font weights',
      error: error instanceof Error ? error.message : 'Unknown error',
      weights: [
        { name: 'Regular', weight: 400, style: 'normal' },
        { name: 'Medium', weight: 500, style: 'normal' }
      ]
    });
  }
}