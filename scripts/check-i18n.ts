import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const localesDir = path.resolve(__dirname, "../i18n/locales");
const appDir = path.resolve(__dirname, "../app");

interface LocaleData {
  keys: Set<string>;
  file: string;
}

// Helper to recursively get all keys from an object
function getKeys(obj: any, prefix = ""): string[] {
  let keys: string[] = [];
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      const value = obj[key];
      keys.push(fullKey);
      if (value && typeof value === "object") {
        keys = keys.concat(getKeys(value, fullKey));
      }
    }
  }
  return keys;
}

// Helper to recursively find all files with specific extensions
function findFiles(dir: string, extensions: string[]): string[] {
  let results: string[] = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(findFiles(filePath, extensions));
    } else if (extensions.some((ext) => file.endsWith(ext))) {
      results.push(filePath);
    }
  }
  return results;
}

// Read all JSON files in the locales directory
function checkTranslations(): void {
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

  const locales: Record<string, LocaleData> = {};
  const allDefinedKeys = new Set<string>();

  for (const file of files) {
    const localeCode = path.basename(file, ".json");
    const filePath = path.join(localesDir, file);
    try {
      const content = JSON.parse(fs.readFileSync(filePath, "utf8"));
      const keys = getKeys(content);
      locales[localeCode] = {
        keys: new Set(keys),
        file,
      };
      keys.forEach((k) => allDefinedKeys.add(k));
    } catch (err) {
      console.error(`Failed to parse ${file}:`, err);
      process.exit(1);
    }
  }

  let hasMismatch = false;
  const localeCodes = Object.keys(locales);

  // 1. Compare every pair of locales for key parity
  for (let i = 0; i < localeCodes.length; i++) {
    for (let j = 0; j < localeCodes.length; j++) {
      if (i === j) continue;
      const codeA = localeCodes[i];
      const codeB = localeCodes[j];
      const localeA = locales[codeA];
      const localeB = locales[codeB];

      const missingKeys: string[] = [];
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

  // 2. Scan codebase (app directory) for key usages and verify they exist in all locales
  const codebaseFiles = findFiles(appDir, [".vue", ".ts"]);
  const topLevelKeys = Array.from(allDefinedKeys).map((k) => k.split(".")[0]);
  const uniqueTopLevelKeys = Array.from(new Set(topLevelKeys));
  const namespacePattern = uniqueTopLevelKeys.join("|");
  const keyRegex = new RegExp(
    `(['"\`]((${namespacePattern})\\.[a-zA-Z0-9_.-]*))`,
    "g",
  );

  const missingFromCodebase: Record<string, Set<string>> = {}; // localeCode -> missing keys

  for (const filePath of codebaseFiles) {
    const content = fs.readFileSync(filePath, "utf8");
    let match;
    while ((match = keyRegex.exec(content)) !== null) {
      const fullMatch = match[1]; // includes quote, e.g. "home.footer.copyrightNotice
      const matchedKey = match[2]; // e.g. home.footer.copyrightNotice
      const quote = fullMatch.charAt(0);

      // Determine if this is a template literal prefix followed by a dynamic parameter (e.g. `home.faq.q${i}`)
      // or if it ends with a dot (e.g. 'ticket.tiers.' + tier.id)
      const isFollowedByTemplateParam =
        quote === "`" &&
        content.substring(
          match.index + fullMatch.length,
          match.index + fullMatch.length + 2,
        ) === "${";
      const isEndsWithDot = matchedKey.endsWith(".");
      const isPrefix = isFollowedByTemplateParam || isEndsWithDot;

      for (const localeCode of localeCodes) {
        const locale = locales[localeCode];
        if (isPrefix) {
          // Check if at least one defined key starts with this prefix
          const hasMatchingKey = Array.from(locale.keys).some((k) =>
            k.startsWith(matchedKey),
          );
          if (!hasMatchingKey) {
            if (!missingFromCodebase[localeCode]) {
              missingFromCodebase[localeCode] = new Set();
            }
            missingFromCodebase[localeCode].add(`${matchedKey}*`);
          }
        } else {
          // Exact match
          if (!locale.keys.has(matchedKey)) {
            if (!missingFromCodebase[localeCode]) {
              missingFromCodebase[localeCode] = new Set();
            }
            missingFromCodebase[localeCode].add(matchedKey);
          }
        }
      }
    }
  }

  // Report missing keys found in codebase
  for (const localeCode of localeCodes) {
    const missingKeysSet = missingFromCodebase[localeCode];
    if (missingKeysSet && missingKeysSet.size > 0) {
      hasMismatch = true;
      console.error(
        `\x1b[31mError: Locale '${localeCode}' (${locales[localeCode].file}) is missing the following keys used in code:\x1b[0m`,
      );
      Array.from(missingKeysSet)
        .sort()
        .forEach((key) => {
          console.error(`  - ${key}`);
        });
      console.error();
    }
  }

  if (hasMismatch) {
    console.error(
      "\x1b[31mi18n check failed: Mismatched or missing translation keys found.\x1b[0m",
    );
    process.exit(1);
  } else {
    console.log(
      "\x1b[32mAll i18n locale files and codebase usages are fully in sync!\x1b[0m",
    );
    process.exit(0);
  }
}

checkTranslations();
