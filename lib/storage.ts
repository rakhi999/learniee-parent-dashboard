import { promises as fs } from "fs";
import path from "path";
import type { UserRecord } from "@/lib/types";

let writeQueue: Promise<void> = Promise.resolve();

function userDataPath() {
  const configured = process.env.DATA_DIR?.trim();
  const dataDir = configured ? path.resolve(configured) : path.join(process.cwd(), "data");
  return path.join(dataDir, "users.json");
}

async function ensureUserStore() {
  const filePath = userDataPath();
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  try {
    await fs.access(filePath);
  } catch {
    await fs.writeFile(filePath, "[]\n", "utf8");
  }
  return filePath;
}

async function readUsersFromDisk(): Promise<UserRecord[]> {
  const filePath = await ensureUserStore();
  const raw = await fs.readFile(filePath, "utf8");
  const parsed: unknown = JSON.parse(raw);
  if (!Array.isArray(parsed)) throw new Error("users.json must contain an array.");
  return parsed as UserRecord[];
}

async function writeUsersToDisk(users: UserRecord[]) {
  const filePath = await ensureUserStore();
  const tempPath = `${filePath}.tmp`;
  await fs.writeFile(tempPath, `${JSON.stringify(users, null, 2)}\n`, "utf8");
  await fs.rename(tempPath, filePath);
}

export async function readUsers(): Promise<UserRecord[]> {
  await writeQueue.catch(() => undefined);
  return readUsersFromDisk();
}

export async function createUserIfAvailable(user: UserRecord) {
  const operation = writeQueue
    .catch(() => undefined)
    .then(async () => {
      const users = await readUsersFromDisk();
      if (users.some((existing) => existing.email === user.email)) return false;
      await writeUsersToDisk([...users, user]);
      return true;
    });

  writeQueue = operation.then(
    () => undefined,
    () => undefined,
  );

  return operation;
}

export async function findUserByEmail(email: string) {
  const users = await readUsers();
  return users.find((user) => user.email === email) ?? null;
}

export async function findUserById(id: string) {
  const users = await readUsers();
  return users.find((user) => user.id === id) ?? null;
}
