// watch for github repo changes and log something to the console
// don't use url import, it's not supported in node
import watch from'node-watch';

const main = async () => {
  watch('./', { recursive: true }, (evt, name) => {
    console.log('%s changed.', name);
  });
}

main();

