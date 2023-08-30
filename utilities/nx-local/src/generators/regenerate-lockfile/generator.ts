import {
  Tree,
  installPackagesTask,
} from '@nx/devkit';
import { RegenerateLockfileGeneratorSchema } from './schema';

export async function regenerateLockfileGenerator(
  tree: Tree,
  _options: RegenerateLockfileGeneratorSchema
) {
  tree.delete('package-lock.json');
  tree.delete('node_modules/.package-lock.json');
  return () => {
    installPackagesTask(tree, true);
  }
}

export default regenerateLockfileGenerator;
