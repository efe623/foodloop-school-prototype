// The presentation HTML provides embedded photographs. Keep the original paths
// in demo state so browser storage remains small, even when running offline.
export function assetUrl(path: string): string {
  const embedded = (
    window as Window & {
      __foodloopImages?: Record<string, string>;
    }
  ).__foodloopImages;
  return embedded?.[path] ?? path;
}
