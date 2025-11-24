import chalk from "chalk";
import { loadModules } from "./modules/loadModules.js";
import inquirer from "inquirer";

export async function runCLI() {
  const questions = [
    {
      type: "list",
      name: "modulo",
      message: "nombre del modulo:",
      choices: ["mangasin"],
    },
    {
      type: "input",
      name: "url",
      message: "url del capitulo:",
    },
  ];

  const res = await inquirer.prompt(questions);

  if (!res?.modulo || !res?.url) {
    console.error(`${chalk.red("✗")} Uso: senpaidl <modulo> <url>`);
    process.exit(1);
  }

  const modulos = await loadModules();

  if (modulos.has(res?.modulo)) {
    const module = modulos.get(res.modulo);
    await module.execute({ url: res.url });
  } else {
    console.error(`${chalk.red("✗")} Módulo "${res.modulo}" no encontrado.`);
    process.exit(1);
  }
}
