const { stdin, stdout } = Deno;
import { complete, create, exit, list, remove } from './src/commands.ts';
import { ensure, readDotos, writeDotos, DotoFile } from './src/io.ts';

interface CommandList {
  [key: string]: Function
}

function parseCommand(command: string) {
  const possibleCommands: CommandList = {
    complete,
    create,
    exit,
    list,
    remove
  };
  return possibleCommands[command];
}

async function getCommand() {
  const buf = new Uint8Array(1024);
  const n = <number>await stdin.read(buf);
  const answer = new TextDecoder().decode(buf.subarray(0, n));
  const command = answer.match(/[a-z]+\b/) || [];
  return [command[0], answer];
}

async function loop(file: DotoFile): Promise<DotoFile> {
  await writeDotos(file);
  const [command, answer] = await getCommand();
  if (command) {
    const input = answer.replace(command, '').trim();
    const updatedFile = parseCommand(command)(file, input);
    return loop(updatedFile);
  }
  return loop(file);
}

(async function run() {
  await ensure();
  const file = await readDotos();
  const initialFile = list(file);
  await stdout.write(new TextEncoder().encode("\nWhat would you like to do?\n"));
  loop(initialFile);
})();
