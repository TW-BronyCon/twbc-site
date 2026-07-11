import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const localesDir = path.resolve(__dirname, "../i18n/locales");

// Helper to recursively get all keys from an object
function getKeys(obj, prefix = "") {
  let keys = [];
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      const value = obj[key];
      if (value && typeof value === "object" && !Array.isArray(value)) {
        keys = keys.concat(getKeys(value, fullKey));
      } else {
        keys.push(fullKey);
      }
    }
  }
  return keys;
}

// Read all JSON files in the locales directory
function checkTranslations() {
  if (!fs.existsSync(localesDir)) {
    console.error(`Locales directory not found: ${localesDir}`);
    process.exit(1);
  }

  const files = fs
    .readdirSync(localesDir)
    .filter((file) => file.endsWith(".json"));

  if (files.length < 2) {
    console.log("Fewer than 2 locale files found. Nothing to compare.");
    process.exit(0);
  }

  const locales = {};
  for (const file of files) {
    const localeCode = path.basename(file, ".json");
    const filePath = path.join(localesDir, file);
    try {
      const content = JSON.parse(fs.readFileSync(filePath, "utf8"));
      locales[localeCode] = {
        keys: new Set(getKeys(content)),
        file,
      };
    } catch (err) {
      console.error(`Failed to parse ${file}:`, err);
      process.exit(1);
    }
  }

  let hasMismatch = false;
  const localeCodes = Object.keys(locales);

  // Compare every pair of locales
  for (let i = 0; i < localeCodes.length; i++) {
    for (let j = 0; j < localeCodes.length; j++) {
      if (i === j) continue;
      const codeA = localeCodes[i];
      const codeB = localeCodes[j];
      const localeA = locales[codeA];
      const localeB = locales[codeB];

      const missingKeys = [];
      for (const key of localeA.keys) {
        if (!localeB.keys.has(key)) {
          missingKeys.push(key);
        }
      }

      if (missingKeys.length > 0) {
        hasMismatch = true;
        console.error(
          `\x1b[31mError: Locale '${codeB}' (${localeB.file}) is missing the following keys defined in '${codeA}' (${localeA.file}):\x1b[0m`,
        );
        missingKeys.sort().forEach((key) => {
          console.error(`  - ${key}`);
        });
        console.error();
      }
    }
  }

  if (hasMismatch) {
    console.error(
      "\x1b[31mi18n check failed: Mismatched translation keys found.\x1b[0m",
    );
    process.exit(1);
  } else {
    console.log("\x1b[32mAll i18n locale files have matching keys!\x1b[0m");
    process.exit(0);
  }
}

checkTranslations();
