import { Doto, DotoFile, DotoStatus, ensure, readDotos, writeDotos } from './io.ts';

function newDoto(text: string): Doto {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1)
  return {
    text,
    status: DotoStatus.DUE,
    dueBy: tomorrow.toISOString(),
  }
}

function updateStatus(doto: Doto) {
  const isOverdue = new Date(doto.dueBy) < new Date();
  if (isOverdue && doto.status !== DotoStatus.DONE) {
    return {
      ...doto,
      status: DotoStatus.OVERDUE
    }
  }
  return doto;
}

function updateDotos({ dotoList }: DotoFile) {
  return {
    dotoList: dotoList.map(updateStatus),
  };
}

export async function create(text: string) {
  await ensure();
  const dotoFile = updateDotos(await readDotos());
  dotoFile.dotoList.push(newDoto(text));
  writeDotos(dotoFile);
  console.log(`Created doto: ${text}`);
}

export async function list() {
  await ensure();
  const { dotoList } = updateDotos(await readDotos());
  dotoList.forEach((doto, index) => {
    console.log(`${index + 1}. ${doto.text} - ${doto.status}`);
  });
}

export async function complete(dotoIndex: string) {
  const targetIndex = parseInt(dotoIndex) - 1;
  await ensure();
  const dotoFile = updateDotos(await readDotos());
  const targetDoto = dotoFile.dotoList[targetIndex];
  targetDoto.status = DotoStatus.DONE;
  writeDotos(dotoFile);
  console.log(`Completed doto: ${targetDoto.text}`);
}

export async function remove(dotoIndex: string) {
  const targetIndex = parseInt(dotoIndex) - 1;
  await ensure();
  const dotoFile = updateDotos(await readDotos());
  const removingDoto = dotoFile.dotoList[targetIndex];
  dotoFile.dotoList.splice(targetIndex, 1);
  writeDotos(dotoFile);
  console.log(`Removed doto: ${removingDoto.text}`);
}