/** Resolve an app asset relative to this module so project-site prefixes work. */
export function assetURL(path) {
  return new URL(path.replace(/^\/+/, ''), new URL('./', import.meta.url)).href;
}
