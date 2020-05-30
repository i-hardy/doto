import { ensure, readDotos, writeDotos } from './io.ts';

export async function create(dotoText: string) {
  await ensure();
  const dotoFile = await readDotos();
  dotoFile.dotoList = dotoFile.dotoList || [];
  dotoFile.dotoList.push(dotoText);
  writeDotos(dotoFile);
  console.log(`Created doto: ${dotoText}`);
}

export async function list() {
  await ensure();
  const { dotoList } = await readDotos();
  dotoList.forEach((doto, index) => {
    console.log(`${index + 1}. ${doto}`);
  });
}

export async function remove(dotoIndex: string) {
  const targetIndex = parseInt(dotoIndex) - 1;
  await ensure();
  const dotoFile = await readDotos();
  dotoFile.dotoList = dotoFile.dotoList || [];
  const removingDoto = dotoFile.dotoList[targetIndex];
  dotoFile.dotoList.splice(targetIndex, 1);
  writeDotos(dotoFile);
  console.log(`Removed doto: ${removingDoto}`);
}