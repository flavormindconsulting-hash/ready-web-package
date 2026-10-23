export function isStorePage(path: string) {
  return /^\/(?:$|products(?:\/[^/?#]{1,120})?\/?$|contact\/?$|privacy-policy\/?$|terms\/?$|returns-refunds\/?$|checkout\/?$|checkout\/success\/\d+\/?$)/.test(path);
}
