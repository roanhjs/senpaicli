import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

export async function loadModules() {
  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const cmd = new Map();

    const modules = await fs.promises.readdir(__dirname);

    for (const dir of modules) {
      const stats = await fs.promises.stat(path.join(__dirname, dir));
      if (!stats.isDirectory()) continue;

      const submodules = await fs.promises.readdir(path.join(__dirname, dir));
      for (const submodule of submodules) {
        if (submodule === "index.js") {
          const modulePath = path.join(__dirname, dir, submodule);
          const imported = await import(pathToFileURL(modulePath).href);
          cmd.set(imported.default.name, imported.default);
        }
      }
    }

    return cmd;
  } catch (error) {
    console.error(error);
  }
}
