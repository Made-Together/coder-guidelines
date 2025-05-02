import tailwindConfig from "tailwind.config.js";
import resolveConfig from "tailwindcss/resolveConfig";
import type { Config } from "tailwindcss";


const fullConfig = resolveConfig(tailwindConfig as unknown as Config);

type FontWeight = {
  name: string;
  weight: number;
  style: string;
};

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

// Helper function to extract weight from font name
function extractWeightFromName(fontName: string): { name: string; weight: number; style: string } {
  // Remove file extension if present
  const nameWithoutExt = fontName.replace(/\.[^/.]+$/, "");

  // Split by common separators (hyphen, space)
  const parts = nameWithoutExt.split(/[-\s]/);

  // The weight is typically the last part
  const lastPart = parts[parts.length - 1].toLowerCase();

  // Check if the last part is a known weight
  const weight = weightMap[lastPart] || 400;

  // Style is always normal for now (could be extended to detect italic)
  const style = "normal";

  // Name is the original font name
  const name = lastPart.charAt(0).toUpperCase() + lastPart.slice(1);

  return { name, weight, style };
}

export default async function getFontInfo() {
  const { theme } = fullConfig;

  const getWeightsForFont = async (dirName: string) => {
    try {
      const response = await fetch(`/api/font-weights?directory=${encodeURIComponent(dirName)}`);
      const data = await response.json();

      if (!response.ok) {
        console.warn('Error response from font weights API:', data);
        return [
          { name: 'Regular', weight: 400, style: 'normal' },
          { name: 'Medium', weight: 500, style: 'normal' }
        ];
      }

      // Process each font name to extract weight information
      return data.weights.map((weight: FontWeight) => {
        const extracted = extractWeightFromName(weight.name);
        return {
          ...weight,
          name: extracted.name,
          weight: extracted.weight,
          style: extracted.style
        };
      });
    } catch (error) {
      console.error('Error getting font weights:', error);
      return [
        { name: 'Regular', weight: 400, style: 'normal' },
        { name: 'Medium', weight: 500, style: 'normal' }
      ];
    }
  };

  // Access the font families from the resolved theme
  const fontFamilies = theme?.fontFamily as Record<string, string[]> || {};

  const headingsFont = fontFamilies.headings?.[0] || 'Inter';
  const bodyFont = fontFamilies.body?.[0] || 'Inter';
  const googleFont = fontFamilies.google?.[0] || 'Inter';
  const google2Font = fontFamilies.google2?.[0] || 'Inter';


  const [headingsWeights, bodyWeights, googleWeights, google2Weights] = await Promise.all([
    getWeightsForFont('headings'),
    getWeightsForFont('body'),
    getWeightsForFont('google'),
    getWeightsForFont('google2')
  ]);


  const result = {
    headings: {
      family: headingsFont,
      weights: headingsWeights.map(w => w.name)
    },
    body: {
      family: bodyFont,
      weights: bodyWeights.map(w => w.name)
    },
    google: {
      family: googleFont,
      weights: googleWeights.map(w => w.name)
    },
    google2: {
      family: google2Font,
      weights: google2Weights.map(w => w.name)
    }
  };

  // console.log('Final font info:', result);
  return result;
};