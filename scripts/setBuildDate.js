const fs = require("fs");
const path = require("path");

// Get current date in ISO format
const buildDate = new Date().toISOString();

// Create or update .env.local with the build date
fs.writeFileSync(path.join(process.cwd(), ".env.local"), `NEXT_PUBLIC_BUILD_DATE=${buildDate}\n`, { flag: "a" });
