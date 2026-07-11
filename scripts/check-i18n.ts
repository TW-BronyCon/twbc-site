import { createI18NReport } from "vue-i18n-extract";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const localesDir = path.resolve(__dirname, "../i18n/locales");

// Helper to get nested value from object using dotted path
function getNestedValue(obj: any, keyPath: string): any {
  return keyPath.split(".").reduce((acc, part) => acc && acc[part], obj);
}

async function runCheck() {
  // Generate report using vue-i18n-extract (this returns a Promise)
  const report = await createI18NReport({
    vueFiles: "./app/**/*.?(js|ts|vue)",
    languageFiles: "./i18n/locales/*.json",
  });

  // Load the locale files into memory to verify false positives
  const localesData: Record<string, any> = {};
  const jsonFiles = fs
    .readdirSync(localesDir)
    .filter((f) => f.endsWith(".json"));
  for (const file of jsonFiles) {
    const code = path.basename(file, ".json");
    const content = JSON.parse(
      fs.readFileSync(path.join(localesDir, file), "utf8"),
    );
    localesData[code] = content;
  }

  // Filter missing keys to exclude false positives (like array/object namespaces)
  const actualMissingKeys = report.missingKeys.filter((item: any) => {
    const localeContent = localesData[item.language];
    if (localeContent) {
      const value = getNestedValue(localeContent, item.path);
      if (value !== undefined) {
        // It exists in the locale file (e.g. home.quotes array), so it is not missing
        return false;
      }
    }
    return true;
  });

  // Output report and exit with appropriate code
  if (actualMissingKeys.length > 0) {
    console.error("\n\x1b[31mError: Found missing translation keys:\x1b[0m");
    actualMissingKeys.forEach((item: any) => {
      console.error(
        `  - Key '${item.path}' is missing from '${item.language}' (used in ${item.file}:${item.line})`,
      );
    });
    process.exit(1);
  } else {
    console.log(
      "\n\x1b[32mAll i18n keys are fully defined in all locale files!\x1b[0m",
    );
    process.exit(0);
  }
}

runCheck().catch((err) => {
  console.error(err);
  process.exit(1);
});
