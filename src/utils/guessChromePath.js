import fs from "node:fs";
import os from "node:os";

export function guessChromePath() {
  const p = os.platform();
  if (p === "win32") {
    return "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
  }
  if (p === "darwin") {
    return "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
  }
  const linux = [
    "/usr/bin/google-chrome",
    "/usr/bin/chromium-browser",
    "/usr/bin/chromium",
  ];
  return linux.find(fs.existsSync) || null;
}
