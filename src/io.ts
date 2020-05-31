import { homedir } from "https://deno.land/std/node/os.ts";
import { ensureFile, readJson, writeJson } from 'https://deno.land/std/fs/mod.ts';

const dotoFilePath = `${homedir()}/.doto/dotos.json`;

export enum DotoStatus {
  DUE = "DUE",
  OVERDUE = "OVERDUE",
  DONE = "DONE"
}

export interface Doto {
  text: string;
  status: DotoStatus;
  dueBy: string;
}

export interface DotoFile {
  dotoList: Array<Doto>
}

export async function writeDotos(content: DotoFile) {
  return writeJson(dotoFilePath, content, { spaces: 2 })
}

export async function readDotos() {
  const dotoFileResult = await readJson(dotoFilePath);
  return dotoFileResult as DotoFile;
}

export async function ensure() {
  await ensureFile(dotoFilePath);
  try {
    await readJson(dotoFilePath);
  } catch (error) {
    await writeDotos({ dotoList: [] })
  }
}
