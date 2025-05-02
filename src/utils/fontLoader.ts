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

// Helper function to format font family name
function formatFontFamilyName(name: string): string {
  // Handle camelCase and PascalCase
  return name
    // Add space before capital letters that are not at the start and not followed by a lowercase letter
    .replace(/([A-Z])(?=[A-Z][a-z])/g, '$1 ')
    // Add space before capital letters that are not at the start
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    // Remove any double spaces that might have been created
    .replace(/\s+/g, ' ')
    .trim();
}

export async function generateFontFaces() {
  const fontsDir = path.join(process.cwd(), 'public', 'fonts');
  let css = '';

  try {
    // Get all font family directories
    const fontFamilies = fs.readdirSync(fontsDir).filter(file =>
      fs.statSync(path.join(fontsDir, file)).isDirectory() &&
      !file.startsWith('.')  // Exclude hidden directories
    );

    // First pass: gather all font families and their files
    const fontData = new Map<string, { files: string[]; familyName: string }>();

    for (const dirName of fontFamilies) {
      const fontFiles = fs.readdirSync(path.join(fontsDir, dirName))
        .filter(file => file.endsWith('.woff2'));

      if (fontFiles.length > 0) {
        // Extract font family name from the first font file
        const firstFile = fontFiles[0];
        const rawFamilyName = firstFile.split('-')[0];
        const familyName = formatFontFamilyName(rawFamilyName);

        // Map the directory name to the correct font family class
        const fontFamilyClass = dirName === 'headings' ? 'font-headings' :
          dirName === 'body' ? 'font-body' :
          dirName === 'google2' ? 'font-google2' : 'font-google';

        fontData.set(dirName, { files: fontFiles, familyName });
      }
    }

    // Convert Map to array for iteration
    const fontEntries = Array.from(fontData.entries());

    // Generate CSS for each font family
    for (const [dirName, { files, familyName }] of fontEntries) {
      for (const fontFile of files) {
        // Parse weight from filename more accurately
        const fileNameWithoutExt = fontFile.replace('.woff2', '');
        const parts = fileNameWithoutExt.split('-');
        const lastPart = parts[parts.length - 1].toLowerCase();

        // Try to find an exact match first
        let weightName = Object.keys(weightMap).find(name => lastPart === name);

        // If no exact match, try partial match
        if (!weightName) {
          weightName = Object.keys(weightMap).find(name => lastPart.includes(name));
        }

        // Default to regular if no match found
        weightName = weightName || 'regular';
        const weightValue = weightMap[weightName];

        const fontFaceRule = `@font-face {
  font-family: '${familyName}';
  src: url('/fonts/${dirName}/${fontFile}') format('woff2');
  font-weight: ${weightValue};
  font-style: ${fontFile.toLowerCase().includes('italic') ? 'italic' : 'normal'};
  font-display: swap;
}\n\n`;

        // console.log(`\nGenerating @font-face for ${fontFile}:`);
        // console.log('Font Family:', familyName);
        // console.log('Weight Name:', weightName);
        // console.log('Weight Value:', weightValue);
        // console.log('Generated CSS:', fontFaceRule);

        css += fontFaceRule;
      }
    }

    return css;
  } catch (error) {
    console.warn('Error generating font faces:', error);
    return '';
  }
}