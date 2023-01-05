import watch from 'node-watch';
import { sync } from './helpers/sync.mjs';

const watchFiles = async () => {
  watch('.git', { recursive: true }, (evt, name) => {
    sync();
  });
};

watchFiles();
