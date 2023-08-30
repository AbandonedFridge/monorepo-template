import {
  Tree,
  removeDependenciesFromPackageJson,
} from '@nx/devkit';
import { RmGeneratorSchema } from './schema';
import removeFromDocsGenerator from '../remove-from-docs/generator';

export async function rmGenerator(
  tree: Tree,
  options: RmGeneratorSchema
) {
  if (!options.areYouSure) {
    return;
  }
  
  const projectRoot = `packages/${options.name}`;
  tree.delete(projectRoot);

  removeDependenciesFromPackageJson(tree, [options.name], [], 'docs/package.json');

  const callback = await removeFromDocsGenerator(tree, { package: options.name });
  return () => {
    callback?.();
  }
}

export default rmGenerator;
