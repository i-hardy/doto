import { Doto, DotoStatus, ensure, readDotos, writeDotos } from './io.ts';

function newDoto(text: string): Doto {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1)
  return {
    text,
    status: DotoStatus.DUE,
    dueBy: tomorrow.toISOString(),
  }
}

export async function create(text: string) {
  await ensure();
  const dotoFile = await readDotos();
  dotoFile.dotoList.push(newDoto(text));
  writeDotos(dotoFile);
  console.log(`Created doto: ${text}`);
}

export async function list() {
  await ensure();
  const { dotoList } = await readDotos();
  dotoList.forEach((doto, index) => {
    console.log(`${index + 1}. ${doto.text} - ${doto.status}`);
  });
}

export async function remove(dotoIndex: string) {
  const targetIndex = parseInt(dotoIndex) - 1;
  await ensure();
  const dotoFile = await readDotos();
  const removingDoto = dotoFile.dotoList[targetIndex];
  dotoFile.dotoList.splice(targetIndex, 1);
  writeDotos(dotoFile);
  console.log(`Removed doto: ${removingDoto}`);
}