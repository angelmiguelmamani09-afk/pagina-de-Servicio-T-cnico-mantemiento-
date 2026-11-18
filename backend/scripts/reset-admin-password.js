import "dotenv/config";
import bcrypt from "bcrypt";
import readline from "node:readline/promises";
import { stdin, stdout } from "node:process";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function askHidden(question) {
  if (!stdin.isTTY || !stdout.isTTY) {
    throw new Error("Ejecuta el script desde una terminal interactiva.");
  }

  return new Promise((resolve, reject) => {
    stdout.write(question);
    stdin.setRawMode(true);
    stdin.resume();

    let value = "";

    function cleanup() {
      stdin.removeListener("data", onData);
      stdin.setRawMode(false);
      stdout.write("\n");
    }

    function onData(chunk) {
      for (const char of chunk.toString("utf8")) {
        if (char === "\u0003") {
          cleanup();
          reject(new Error("Operación cancelada."));
          return;
        }

        if (char === "\r" || char === "\n") {
          cleanup();
          resolve(value);
          return;
        }

        if (char === "\u007f" || char === "\b") {
          value = value.slice(0, -1);
        } else if (char >= " ") {
          value += char;
        }
      }
    }

    stdin.on("data", onData);
  });
}

async function main() {
  const email = "admin@tecnofix.com";

  const admin = await prisma.usuario.findUnique({
    where: { email },
    include: { rol: true }
  });

  if (!admin) {
    throw new Error("No existe el administrador con ese correo.");
  }

  if (admin.rol.nombre !== "ADMINISTRADOR") {
    throw new Error("La cuenta encontrada no tiene rol de administrador.");
  }

  if (!admin.activo) {
    throw new Error("La cuenta está desactivada. No se modificó.");
  }

  console.log("Administrador encontrado:", admin.email);

  const password = await askHidden("Nueva contraseña (mínimo 12 caracteres): ");
  const confirmation = await askHidden("Confirma la nueva contraseña: ");

  if (password.length < 12) {
    throw new Error("La contraseña debe tener al menos 12 caracteres.");
  }

  if (password !== confirmation) {
    throw new Error("Las contraseñas no coinciden.");
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.usuario.update({
    where: { id: admin.id },
    data: { passwordHash }
  });

  console.log("\nContraseña del administrador actualizada correctamente.");
  console.log("Correo:", admin.email);
}

main()
  .catch(error => {
    console.error("\nError:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
