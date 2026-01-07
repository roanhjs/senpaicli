import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { chromium } from "playwright";
import ora from "ora";
import chalk from "chalk";
import { configPath } from "../../setup.js";

let spinner;

export default {
  name: "x",
  execute: async ({ url }) => {
    try {
      console.clear();
      // spinner = ora(chalk.white("Iniciando descarga")).start();
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
        "--no-zygote",
        "--single-process",
        "--disable-blink-features=AutomationControlled",
        "--mute-audio",
        "--hide-scrollbars",
        "--disable-breakpad",
        "--disable-renderer-backgrounding",
        "--disable-accelerated-2d-canvas",
        "--disable-accelerated-jpeg-decoding",
        "--disable-accelerated-mjpeg-decode",
        "--disable-web-security",
      ];
      const timeout = 300000;

      // spinner.text = "Abriendo navegador";
      if (config.navegador.ruta === "Default") {
        browser = await chromium.launch({
          headless: true,
          args,
          timeout,
        });
      } else {
        browser = await chromium.launch({
          executablePath: config.navegador.ruta,
          headless: true,
          args,
          timeout,
        });
      }

      // spinner.text = "Cargando página";
      const page = await browser.newPage();
      await page.goto(url);

      // spinner.text = "Obteniendo URL del video";
      await page.waitForResponse(
        (res) => {
          if (res.url().endsWith(".mp4")) {
            console.log(res.url());
          }
        },
        {
          timeout: 60000,
        },
      );
      // console.log(videoUrl.url());

      // spinner.text = "Descargando video";
      // const response = await fetch(videoUrl.url());
      // const buffer = await response.arrayBuffer();

      // const video = Buffer.from(buffer);
      // const fileName = Date.now().toString() + ".mp4";

      // spinner.text = "Guardando video";
      // fs.writeFileSync(
      //   path.join(config.carpetaDeArchivos.ruta, fileName),
      //   video,
      // );

      spinner.text = "Cerrando navegador";
      await browser.close();
      // spinner.succeed(
      //   `Descarga completada: ${chalk.cyan(`${path.join(config.carpetaDeArchivos.ruta, fileName)}`)}`,
      // );
    } catch (err) {
      // spinner.fail("Error al descargar el video:", err);
      process.exit(1);
    }
  },
};
