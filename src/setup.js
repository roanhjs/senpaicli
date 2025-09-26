import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { spawn } from "node:child_process";
import inquirer from "inquirer";
import chalk from "chalk";

const configPath = path.join(
  os.homedir(),
  ".config",
  "senpaidl",
  "config.json",
);

export async function setup() {
  const questions = [
    {
      type: "input",
      name: "nombre",
      message: "Nombre de la carpeta donde guardar los archivos:",
      default: "mangas",
    },
    {
      type: "input",
      name: "navegador",
      message: "ruta del navegador:",
      default: "Chromium (Playwright)",
    },
  ];

  const res = await inquirer.prompt(questions);
  const runCommand = async (command, args) => {
    return new Promise((resolve, reject) => {
      const child = spawn(command, args, { stdio: "pipe" });

      child.stdout.on("data", (data) => process.stdout.write(data));
      child.stderr.on("data", (data) => process.stderr.write(data));

      child.on("close", (code) => {
        if (code === 0) resolve();
        else reject(new Error(`Proceso salió con código ${code}`));
      });
    });
  };

  if (res.navegador === "Chromium (Playwright)") {
    await runCommand("pnpx", [
      "playwright",
      "install",
      "--with-deps",
      "--only-shell",
      "chromium",
    ]);
  }

  // archivos
  const ruta = path.join(os.homedir(), res.nombre);
  fs.mkdirSync(ruta, { recursive: true });

  // config
  fs.mkdirSync(path.dirname(configPath), { recursive: true });
  fs.writeFileSync(
    configPath,
    JSON.stringify(
      {
        carpetaDeArchivos: {
          nombre: res.nombre,
          ruta,
        },
        navegador: {
          ruta:
            res.navegador === "Chromium (Playwright)"
              ? "Default"
              : res.navegador,
        },
      },
      null,
      2,
    ),
  );

  console.log(`${chalk.green("✔")} Guardado en: ${chalk.cyan(ruta)}`);
}

export { configPath };
