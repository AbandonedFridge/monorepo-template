import pathCorrection from './middleware/pathCorrection.mjs';
import { fromRollup } from '@web/dev-server-rollup';
import rollupCommonjs from '@rollup/plugin-commonjs';

const commonjs = fromRollup(rollupCommonjs);

export default {
  open: '/',
  watch: true,
  nodeResolve: {
    exportConditions: ['browser', 'development'],
  },
  plugins: [
    commonjs({
      include: [
        '**/node_modules/highlight.js/**/*'
      ]
    })
  ],
  appIndex: 'index.html',
  rootDir: '../',
  debug: false,
  middleware: [ pathCorrection ]
};
