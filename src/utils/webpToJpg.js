import sharp from "sharp";

export async function webpToJpg({ buffer }) {
  try {
    const convertWebpToJpg = sharp(buffer).toFormat("jpeg");
    const toBuffer = await convertWebpToJpg.toBuffer();
    return toBuffer;
  } catch (error) {
    console.error("Error converting WebP to JPG:", error);
  }
}
