import type { NextApiRequest, NextApiResponse } from 'next';
import { generateFontFaces } from '~/utils/fontLoader';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const css = await generateFontFaces();

    if (!css) {
      console.warn('No font faces were generated');
      return res.status(404).json({ message: 'No fonts found' });
    }

    // Cache the response for 1 hour
    res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600');
    res.setHeader('Content-Type', 'text/css');
    res.status(200).send(css);
  } catch (error) {
    console.error('Error serving font faces:', error);
    res.status(500).json({ message: 'Error generating font faces' });
  }
}