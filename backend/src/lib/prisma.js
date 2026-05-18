/* Prisma client singleton - perdoret nga te gjitha routes */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  log: ["error", "warn"], // logo vetem errors dhe warnings
});

export default prisma;
