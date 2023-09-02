import {
  addProjectConfiguration,
  formatFiles,
  generateFiles,
  Tree,
  readJson,
  writeJson
} from '@nx/devkit';
import * as path from 'path';
import { LitGeneratorSchema } from './schema';
import addToDocsGenerator from '../add-to-docs/generator';
import { getSharedJson } from '../../shared/get-shared-json';

const camelcase = (str: string): string => str.split('-').map(o => `${o[0].toUpperCase()}${o.slice(1).toLowerCase()}`).join('');

export async function litGenerator(
  tree: Tree,
  options: LitGeneratorSchema
) {
  const projectRoot = `packages/${options.name}`;
  const rootJson = readJson(tree, 'package.json');
  const namespace = rootJson.namespace || null;
  addProjectConfiguration(tree, options.name, {
    root: projectRoot,
    projectType: 'library',
    sourceRoot: `${projectRoot}/src`,
    targets: {},
  });
  generateFiles(tree, path.join(__dirname, 'files'), projectRoot, {
    camelcase,
    namespace: namespace,
    ...options
  });

  const newPackage = {
    name: [namespace, options.name].filter(o => !!o).join('/'),
    description: 'A lit component',
    version: '0.0.0',
    main: `lib/${options.name}.js`,
    types: `lib/${options.name}.d.ts`,
    files: [
      './docs',
      './lib',
      './src'
    ],
    peerDependencies: {
      ...rootJson.dependencies
    },
    scripts: {
      'build': 'tsc',
      'build:watch': 'tsc --watch',
      'start': 'npm run build:watch'
    },
    ...getSharedJson(tree)
  };

  writeJson(tree, `${projectRoot}/package.json`, newPackage);

  const newProject = {
    'name': options.name,
    '$schema': '../node_modules/nx/schemas/project-schema.json',
    'projectType': 'library',
    'targets': {
      'lint': {
        'executor': '@nx/linter:eslint',
        'outputs': ['{options.outputFile}'],
        'options': {
          'lintFilePatterns': [
            `${projectRoot}/**/*.ts`,
            `${projectRoot}/package.json`
          ]
        }
      }
    },
    'tags': []
  };
  writeJson(tree, `${projectRoot}/project.json`, newProject);

  await formatFiles(tree);

  const callback = await addToDocsGenerator(tree, { package: options.name, namespace: namespace });
  return () => {
    console.log('Remember to restart dev server or run npm build');
    callback?.();
  };
}

export default litGenerator;
