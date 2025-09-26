import fs from "node:fs";
import { configPath, setup } from "./setup.js";
import { runCLI } from "./runCLI.js";
export async function main() {
  if (!fs.existsSync(configPath)) {
    await setup();
  }
  await runCLI(process.argv.slice(2));
}
