const { args } = Deno;
import { parse } from "https://deno.land/std/flags/mod.ts";
import { process } from "https://deno.land/std/node/process.ts";
import { complete, create, list, remove } from './src/commands.ts';
import { ensure, readDotos, writeDotos } from './src/io.ts';

interface CommandList {
  [key: string]: Function
}

function parseCommand(command: string) {
  const possibleCommands: CommandList = {
    complete,
    create,
    list,
    remove
  };
  return possibleCommands[command];
}

(async function run() {
  const { _ } = parse(args);
  const dotoInput = _.map(arg => arg.toString());
  if (!dotoInput[0]) process.exit(0);
  await ensure();
  const file = await readDotos();
  const updatedFile = parseCommand(dotoInput[0])(file, dotoInput[1]);
  writeDotos(updatedFile)
})();
