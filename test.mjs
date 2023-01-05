import watch from 'node-watch';
import { sync } from './helpers/sync.mjs';
import { exec } from 'child_process';
import prettier from 'prettier';

const watchFiles = async () => {
  watch('./', { recursive: true }, (evt, name) => {
    // const command = `prettier --write --ignore-unknown ./${name} --plugin-search-dir=. --ignore-path=.prettierignore`;
    prettier.resolveConfig('./.prettierrc').then((options) => {
      prettier.format(`${name}`, options)
    });
    console.log(`${name} changed`);
    // sync();
  });
};

watchFiles();
