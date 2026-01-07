import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

export async function m3u8ToMp4({ m3u8Url }) {
  return new Promise((resolve, reject) => {
    const outputPath = path.join(
      process.cwd(),
      `.cache/video-${Date.now()}.mp4`,
    );

    const ffmpeg = spawn("ffmpeg", [
      "-i",
      m3u8Url,
      "-c:v",
      "libx264",
      "-c:a",
      "aac",
      "-y",
      outputPath,
    ]);

    ffmpeg.on("error", reject);
    ffmpeg.on("close", (code) => {
      if (code === 0) {
        const buffer = fs.readFileSync(outputPath);
        resolve(buffer);
      } else {
        reject(new Error(`FFmpeg salió con código ${code}`));
      }
    });
  });
}
