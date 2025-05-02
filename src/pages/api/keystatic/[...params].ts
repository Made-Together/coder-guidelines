import { makeAPIRouteHandler } from "@keystatic/next/api";
import keystaticConfig from "@/keystatic.config";
import { NextApiRequest, NextApiResponse } from "next";

// Create the API route handler
const handler = makeAPIRouteHandler({
  config: keystaticConfig,
});

// Configure the API route to handle larger files
export const config = {
  api: {
    bodyParser: false,
    responseLimit: '10mb'
  }
};

// Wrap the handler to properly handle raw body data
export default async function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Get the raw body as text
    const body = await new Promise<string>((resolve) => {
      let data = '';
      req.on('data', chunk => {
        data += chunk;
      });
      req.on('end', () => {
        resolve(data);
      });
    });

    // Parse the body if it's JSON
    if (req.headers['content-type']?.includes('application/json')) {
      try {
        req.body = JSON.parse(body);
      } catch (e) {
        // If parsing fails, keep the raw body
        req.body = body;
      }
    } else {
      req.body = body;
    }

    // Call the original handler
    return handler(req, res);
  } catch (error) {
    console.error('Error handling request:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}