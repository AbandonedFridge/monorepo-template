import {
  Tree,
  installPackagesTask,
  removeDependenciesFromPackageJson,
} from '@nx/devkit';
import { RemoveFromDocsGeneratorSchema } from './schema';

export async function removeFromDocsGenerator(
  tree: Tree,
  options: RemoveFromDocsGeneratorSchema
) {
  const projectRoot = `packages/${options.package}`;
  removeDependenciesFromPackageJson(tree, [options.package], [], 'docs/package.json');
  tree.delete(`docs/src/import-helpers/${options.package}.ts`);
  return () => {
    installPackagesTask(tree, true);
    console.log('----------------------------------------------------------------------------------------------------');
    console.log(`${options.package} removed from docs.`);
    console.log(`If the dev server is already running, you'll need to restart it.`);
    console.log('----------------------------------------------------------------------------------------------------');
  }
}

export default removeFromDocsGenerator;
