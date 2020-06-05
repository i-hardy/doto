import { process } from "https://deno.land/std/node/process.ts";
import { Doto, DotoFile, DotoStatus } from './io.ts';

function newDoto(text: string): Doto {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1)
  return {
    text,
    status: DotoStatus.DUE,
    dueBy: tomorrow.toISOString(),
  }
}

function updateStatus(doto: Doto): Doto {
  const isOverdue = new Date(doto.dueBy) < new Date();
  if (isOverdue && doto.status !== DotoStatus.DONE) {
    return {
      ...doto,
      status: DotoStatus.OVERDUE
    }
  }
  return doto;
}

function updateDotos(dotoFunction: Function) {
  return function wrappedWithUpdate({ dotoList }: DotoFile, ...args: string[]) {
    return dotoFunction(
      {
        dotoList: dotoList.map(updateStatus),
      },
      ...args
    )
  }
}

export const create = updateDotos(function createDoto(dotoFile: DotoFile, text: string) {
  dotoFile.dotoList.push(newDoto(text));
  console.log(`Created doto: ${text}\n`);
  return dotoFile;
})

export const list = updateDotos(function listDotos(dotoFile: DotoFile) {
  dotoFile.dotoList.forEach((doto, index) => {
    console.log(`${index + 1}. ${doto.text} - ${doto.status}`);
  });
  return dotoFile;
})

export const complete = updateDotos(function completeDoto(dotoFile: DotoFile, dotoIndex: string) {
  const targetIndex = parseInt(dotoIndex) - 1;
  const targetDoto = dotoFile.dotoList[targetIndex];
  targetDoto.status = DotoStatus.DONE;
  console.log(`Completed doto: ${targetDoto.text}\n`);
  return dotoFile;
})

export const remove = updateDotos(function remove(dotoFile: DotoFile, dotoIndex: string) {
  const targetIndex = parseInt(dotoIndex) - 1;
  const removingDoto = dotoFile.dotoList[targetIndex];
  dotoFile.dotoList.splice(targetIndex, 1);
  console.log(`Removed doto: ${removingDoto.text}\n`);
  return dotoFile;
})

export const exit = function exit() {
  return process.exit(0);
}