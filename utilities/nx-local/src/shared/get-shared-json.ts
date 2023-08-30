import { Tree, readJson } from '@nx/devkit';

export const getSharedJson = (tree: Tree) => {
  const rootJson = readJson(tree, 'package.json');
  return ({
    contributors: rootJson.contributors,
    author: rootJson.author,
    homepage: rootJson.homepage,
    repository: rootJson.repository,
    bugs: rootJson.bugs
  });
};