import fs from "node:fs";
import pdfkit from "pdfkit";
import { chromium } from "playwright";
import chalk from "chalk";
import ora from "ora";
import { configPath } from "../../setup.js";
import { webpToJpg } from "../../utils/webpToJpg.js";

export default {
  name: "mangasin",
  execute: async ({ url }) => {
    try {
      console.clear();
      const spinner = ora({
        text: `Descargando...`,
        spinner: "line",
      }).start();

      const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
      let browser;
      const args = [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
        "--disable-software-rasterizer",
        "--disable-extensions",
        "--disable-background-networking",
        "--disable-background-timer-throttling",
        "--disable-backgrounding-occluded-windows",
        "--disable-client-side-phishing-detection",
        "--disable-sync",
        "--disable-translate",
        "--disable-popup-blocking",
        "--disable-features=AudioServiceOutOfProcess,MediaFoundationPlatform,TranslateUI",
        "--single-process",
        "--mute-audio",
        "--hide-scrollbars",
        "--disable-breakpad",
        "--no-first-run",
        "--no-zygote",
        "--disable-blink-features=AutomationControlled",
        "--disable-renderer-backgrounding",
        "--disable-accelerated-2d-canvas",
        "--disable-web-security",
        "--disable-accelerated-jpeg-decoding",
        "--disable-accelerated-mjpeg-decode",
      ];

      if (config.navegador.ruta === "Default") {
        browser = await chromium.launch({
          headless: true,
          args,
        });
      } else {
        browser = await chromium.launch({
          executablePath: config.navegador.ruta,
          headless: true,
          args,
        });
      }

      const context = await browser.newContext();

      const page = await context.newPage();
      const timeout = 180000;

      await page.goto(url, { waitUntil: "load", timeout });

      await page.waitForSelector("body", { timeout });

      const title = await page.title();

      const modeAll = page.locator("a#modeALL");
      await modeAll.waitFor({ state: "visible", timeout });
      await modeAll.click();

      await page.waitForSelector("div#all img", { state: "visible", timeout });
      const allDiv = await page.$("div#all");

      const imgHandles = await allDiv.$$("img");
      const imgs = await Promise.all(
        imgHandles.map(async (img) => {
          const src =
            (await img.getAttribute("data-src")) ||
            (await img.getAttribute("src"));
          if (src) return src;
          return null;
        }),
      );

      await browser.close();

      const pdf = new pdfkit();
      pdf.pipe(
        fs.createWriteStream(`${config.carpetaDeArchivos.ruta}/${title}.pdf`),
      );

      for (const img of imgs) {
        const res = await fetch(img, {
          method: "GET",
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            Accept: "image/webp,image/apng,image/*,*/*;q=0.8",
            Referer: url,
            Origin: "https://m440.in",
          },
        });

        const arrayBuffer = await res.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const jpg = await webpToJpg({ buffer });

        pdf.image(jpg, {
          fit: [500, 800],
          align: "center",
          valign: "center",
          margins: 0,
        });

        pdf.addPage();
      }
      pdf.end();
      // console.log(
      //   `${chalk.green("✔")} Descarga completa: ${chalk.cyan(`${config.carpetaDeArchivos.ruta}/${title}.pdf`)}`,
      // );
      spinner.succeed(
        `Descarga completada: ${chalk.cyan(`${config.carpetaDeArchivos.ruta}/${title}.pdf`)}`,
      );
      spinner.stop();
    } catch (err) {
      console.error("Error en dlMangaIn:", err);
      return { title: "", imgs: [] };
    }
  },
};
