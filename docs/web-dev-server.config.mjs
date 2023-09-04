import pathCorrection from './middleware/pathCorrection.mjs';

export default {
  open: '/',
  watch: true,
  nodeResolve: {
    exportConditions: ['browser', 'development'],
  },
  appIndex: 'index.html',
  rootDir: '../',
  debug: true,
  middleware: [ pathCorrection ]
};
