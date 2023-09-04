import {
  formatFiles,
  generateFiles,
  Tree,
  installPackagesTask,
  addDependenciesToPackageJson,
  writeJson,
} from '@nx/devkit';
import * as path from 'path';
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
  const packages = tree.children('packages');
  addDependenciesToPackageJson(tree, { [options.package]: '*' }, {}, 'docs/package.json');
  generateFiles(tree, path.join(__dirname, 'files'), 'docs', { ...options });
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
