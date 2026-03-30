const ASSET_BASE_URL = process.env.NEXT_PUBLIC_ASSET_BASE_URL ?? "";

export function assetUrl(path: string) {
  if (!path) {
    return "";
  }

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return ASSET_BASE_URL ? `${ASSET_BASE_URL}${normalizedPath}` : normalizedPath;
}
