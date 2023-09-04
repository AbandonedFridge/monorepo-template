export default function pathCorrection(context, next) {
  if (
    ['/','/index'].includes(context.url) ||
    (context.url && (context.url.startsWith('/lib') || context.url.startsWith('/packages')))
  ) {
    context.url = '/docs' + context.url;
  }
  return next();
}