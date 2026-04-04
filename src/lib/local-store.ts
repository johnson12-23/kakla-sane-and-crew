import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";

const DATA_DIR = path.join(process.cwd(), ".data");

async function ensureDataDir() {
  await mkdir(DATA_DIR, { recursive: true });
}

async function readJson<T>(fileName: string, fallback: T): Promise<T> {
  try {
    await ensureDataDir();
    const filePath = path.join(DATA_DIR, fileName);
    const raw = await readFile(filePath, "utf-8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

async function writeJson<T>(fileName: string, payload: T) {
  await ensureDataDir();
  const filePath = path.join(DATA_DIR, fileName);
  await writeFile(filePath, JSON.stringify(payload, null, 2), "utf-8");
}

export async function readCollection<T>(fileName: string) {
  return readJson<T[]>(fileName, []);
}

export async function writeCollection<T>(fileName: string, payload: T[]) {
  await writeJson<T[]>(fileName, payload);
}

export async function readNumericSetting(fileName: string, key: string, fallback: number) {
  const settings = await readJson<Record<string, number>>(fileName, {});
  const value = Number(settings[key]);
  return Number.isFinite(value) && value >= 1 ? value : fallback;
}

export async function writeNumericSetting(fileName: string, key: string, value: number) {
  const settings = await readJson<Record<string, number>>(fileName, {});
  settings[key] = Math.max(1, Math.floor(Number(value)));
  await writeJson(fileName, settings);
  return settings[key];
}
