import {
  Tree,
  readJson,
  updateJson
} from '@nx/devkit';
import { UpdateSharedJsonGeneratorSchema } from './schema';
import { getSharedJson } from '../../shared/get-shared-json';

export async function updateSharedJsonGenerator(
  tree: Tree,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _options: UpdateSharedJsonGeneratorSchema
) {
  const packages = tree.children('packages');
  if (packages.length === 0) {
    console.log('No packages found. Nothing to do.');
    return;
  }
  
  const rootJson = readJson(tree, 'package.json');

  packages.map(pkg => updateJson(tree, `packages/${pkg}/package.json`, packageJson => ({
    ...packageJson,
    ...getSharedJson(tree),
    peerDependencies: {
      ...packageJson.peerDependencies,
      ...rootJson.dependencies
    },
  })));
  updateJson(tree, 'docs/package.json', packageJson => ({
    ...packageJson,
    ...getSharedJson(tree),
    dependencies: {
      ...packageJson.dependencies,
      ...rootJson.dependencies
    },
  }));
}

export default updateSharedJsonGenerator;
