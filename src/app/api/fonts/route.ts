import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

type FontWeight = {
  name: string;
  weight: number;
  style: string;
};

const normalizeFontName = (fontName: string): string => {
  return fontName
    .toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/[^a-z0-9-]/g, ''); // Remove any non-alphanumeric characters except hyphens
};

const scanFontDirectory = (fontFamily: string): FontWeight[] => {
  const publicDir = path.join(process.cwd(), 'public');
  const normalizedFontName = normalizeFontName(fontFamily);
  const fontsDir = path.join(publicDir, 'fonts', normalizedFontName);

  console.log('Scanning directory:', fontsDir);

  if (!fs.existsSync(fontsDir)) {
    console.log('Directory not found:', fontsDir);
    return [];
  }

  const fontFiles = fs.readdirSync(fontsDir)
    .filter(file => file.endsWith('.woff2') || file.endsWith('.woff') || file.endsWith('.ttf'));

  console.log('Found font files:', fontFiles);

  return fontFiles.map(file => {
    const nameWithoutExt = path.basename(file, path.extname(file));
    const [, style] = nameWithoutExt.split('-');

    const weightMap: Record<string, number> = {
      Thin: 100,
      ExtraLight: 200,
      Light: 300,
      Regular: 400,
      Medium: 500,
      SemiBold: 600,
      Bold: 700,
      ExtraBold: 800,
      Black: 900
    };

    const baseWeight = style?.replace('Italic', '') || 'Regular';
    const weight = weightMap[baseWeight] || 400;
    const isItalic = style?.includes('Italic') || false;

    return {
      name: style || 'Regular',
      weight,
      style: isItalic ? 'italic' : 'normal'
    };
  });
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const fontFamily = searchParams.get('family');

  if (!fontFamily) {
    return NextResponse.json({ error: 'Font family is required' }, { status: 400 });
  }

  const weights = scanFontDirectory(fontFamily);
  console.log('Found weights for', fontFamily, ':', weights);

  return NextResponse.json({ weights });
}