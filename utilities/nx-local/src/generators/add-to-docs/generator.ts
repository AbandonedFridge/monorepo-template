import {
  formatFiles,
  Tree,
  installPackagesTask,
  addDependenciesToPackageJson,
  writeJson,
  readJson,
} from '@nx/devkit';
import { AddToDocsGeneratorSchema } from './schema';

export async function addToDocsGenerator(
  tree: Tree,
  options: AddToDocsGeneratorSchema
) {
  const projectRoot = `packages/${options.package}`;
  if(!tree.exists(projectRoot)) {
    console.log(`${projectRoot} doesn't exist. Aborting.`);
    return;
  }
  const packages = tree.children('packages').map(o => readJson(tree, `packages/${o}/package.json`).name);
  addDependenciesToPackageJson(tree, { [readJson(tree, `packages/${options.package}/package.json`).name]: '*' }, {}, 'docs/package.json');
  writeJson(tree, 'docs/src/packages.json', packages);
  await formatFiles(tree);
  return () => {
    installPackagesTask(tree, true);
    console.log('----------------------------------------------------------------------------------------------------');
    console.log(`${options.package} added to docs.`);
    console.log('If the dev server is already running, you\'ll need to restart it.');
    console.log('----------------------------------------------------------------------------------------------------');
  };
}

export default addToDocsGenerator;
