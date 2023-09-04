import {
  Tree,
  installPackagesTask,
  removeDependenciesFromPackageJson,
  writeJson,
} from '@nx/devkit';
import { RemoveFromDocsGeneratorSchema } from './schema';

export async function removeFromDocsGenerator(
  tree: Tree,
  options: RemoveFromDocsGeneratorSchema
) {
  const packages = tree.children('packages');
  removeDependenciesFromPackageJson(tree, [options.package], [], 'docs/package.json');
  tree.delete(`docs/src/importers/${options.package}.ts`);
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
