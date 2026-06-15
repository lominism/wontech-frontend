import fs from "fs";
import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import path from "path";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  // Get all subfolders in messages
  const messagesDir = path.resolve(process.cwd(), "messages");
  const subfolders = fs
    .readdirSync(messagesDir)
    .filter((f) => fs.statSync(path.join(messagesDir, f)).isDirectory());

  // Dynamically import all locale JSON files from each subfolder
  const messages: Record<string, unknown> = {};
  await Promise.all(
    subfolders.map(async (folder) => {
      const filePath = path.join(messagesDir, folder, `${locale}.json`);
      if (fs.existsSync(filePath)) {
        const fileContent = fs.readFileSync(filePath, "utf-8");
        const mod = JSON.parse(fileContent);
        messages[folder] = mod.default || mod;
      }
    })
  );

  return {
    locale,
    messages,
  };
});
