import {
  Tree,
  installPackagesTask,
  readJson,
  removeDependenciesFromPackageJson,
  writeJson,
} from '@nx/devkit';
import { RemoveFromDocsGeneratorSchema } from './schema';

export async function removeFromDocsGenerator(
  tree: Tree,
  options: RemoveFromDocsGeneratorSchema
) {
  const packages = tree.children('packages');
  const packageName = readJson(tree, `packages/${options.package}/package.json`).name;
  removeDependenciesFromPackageJson(tree, [packageName], [], 'docs/package.json');
  writeJson(tree, 'docs/src/packages.json', packages);
  return () => {
    installPackagesTask(tree, true);
    console.log('----------------------------------------------------------------------------------------------------');
    console.log(`${options.package} removed from docs.`);
    console.log('If the dev server is already running, you\'ll need to restart it.');
    console.log('----------------------------------------------------------------------------------------------------');
  };
}

export default removeFromDocsGenerator;
