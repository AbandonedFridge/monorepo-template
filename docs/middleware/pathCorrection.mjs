export default function pathCorrection(context, next) {
  if (
    ['/','/index'].includes(context.url) ||
    (context.url && !context.url.startsWith('/node_modules') && !context.url.startsWith('/__web-dev-server'))
  ) {
    context.url = '/docs' + context.url;
  }
  return next();
}