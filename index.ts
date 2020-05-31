const { args } = Deno;
import { parse } from "https://deno.land/std/flags/mod.ts";
import { create, list, remove } from './src/commands.ts';
import { process } from "https://deno.land/std/node/process.ts";

interface CommandList {
  [key: string]: Function
}

function parseCommand(command: string) {
  const possibleCommands: CommandList = {
    create: create,
    list: list,
    remove: remove
  };
  return possibleCommands[command];
}

(async function run() {
  const { _ } = parse(args);
  const dotoInput = _.map(arg => arg.toString());
  if (!dotoInput[0]) process.exit(0);
  parseCommand(dotoInput[0])(dotoInput[1]);
})();
