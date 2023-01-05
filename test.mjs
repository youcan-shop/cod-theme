// watch for github repo changes and log something to the console

import { watch } from 'https://deno.land/std/fs/mod.ts';

const watcher = watch('./');

for await (const event of watcher) {
  console.log(event);
}

