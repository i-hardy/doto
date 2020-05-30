const { args } = Deno;
import { parse } from "https://deno.land/std/flags/mod.ts";
import { create, list, remove } from './src/commands.ts';

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
  parseCommand(dotoInput[0])(dotoInput[1]);
})();
