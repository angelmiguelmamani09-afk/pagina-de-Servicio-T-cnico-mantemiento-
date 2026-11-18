import "dotenv/config";
import bcrypt from "bcrypt";
import readline from "node:readline/promises";
import { stdin, stdout } from "node:process";
import { PrismaClient, Rol } from "@prisma/client";

const prisma = new PrismaClient();

const rl = readline.createInterface({
  input: stdin,
  output: stdout
});

async function askHidden(question) {
  if (!stdin.isTTY || !stdout.isTTY) {
    throw new Error("Ejecuta este script desde una terminal interactiva.");
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
  console.log("\n=== Inicialización del administrador TecnoFix ===\n");

  const adminRole = await prisma.rolSistema.upsert({
    where: { nombre: Rol.ADMINISTRADOR },
    update: {},
    create: { nombre: Rol.ADMINISTRADOR }
  });

  await prisma.rolSistema.upsert({
    where: { nombre: Rol.TECNICO },
    update: {},
    create: { nombre: Rol.TECNICO }
  });

  await prisma.rolSistema.upsert({
    where: { nombre: Rol.CLIENTE },
    update: {},
    create: { nombre: Rol.CLIENTE }
  });

  const existingAdmin = await prisma.usuario.findFirst({
    where: {
      rolId: adminRole.id
    }
  });

  if (existingAdmin) {
    console.log("Ya existe un administrador. No se creó otro.");
    return;
  }

  const nombre = (await rl.question("Nombre del administrador: ")).trim();

  const email = (
    await rl.question("Correo electrónico: ")
  ).trim().toLowerCase();

  rl.close();

  const password = await askHidden("Contraseña: ");
  const confirmation = await askHidden("Confirmar contraseña: ");

  if (!nombre || !email || password.length < 12) {
    throw new Error(
      "Datos inválidos. La contraseña debe tener al menos 12 caracteres."
    );
  }

  if (password !== confirmation) {
    throw new Error("Las contraseñas no coinciden.");
  }

  const existingUser = await prisma.usuario.findUnique({
    where: { email }
  });

  if (existingUser) {
    throw new Error("Ese correo ya está registrado.");
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const admin = await prisma.usuario.create({
    data: {
      nombre,
      email,
      passwordHash,
      rolId: adminRole.id
    },
    select: {
      id: true,
      nombre: true,
      email: true
    }
  });

  console.log("\nAdministrador creado correctamente.");
  console.log("Nombre:", admin.nombre);
  console.log("Correo:", admin.email);
  console.log("ID:", admin.id);
}

main()
  .catch((error) => {
    console.error("\nNo se pudo crear el administrador:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    rl.close();
    await prisma.$disconnect();
  });