import watch from 'node-watch';
import { sync } from './helpers/sync.mjs';
import prettier from 'prettier';

const watchFiles = async () => {
  watch('./', { recursive: true }, (evt, name) => {
    prettier.resolveConfig('./.prettierrc').then((options) => {
      prettier.format(`${name}`, options)
    });
    console.log(`${name} changed`);
    sync();
  });
};

watchFiles();
