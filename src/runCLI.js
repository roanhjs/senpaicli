import chalk from "chalk";
import { loadModules } from "./modules/loadModules.js";

export async function runCLI(args) {
  const [modulo, url] = args;
  if (!modulo || !url) {
    console.error(`${chalk.red("✗")} Uso: senpaidl <modulo> <url>`);
    process.exit(1);
  }

  const modulos = await loadModules();

  if (modulos.has(modulo)) {
    const module = modulos.get(modulo);
    await module.execute({ url });
  } else {
    console.error(`${chalk.red("✗")} Módulo "${modulo}" no encontrado.`);
    process.exit(1);
  }
}
