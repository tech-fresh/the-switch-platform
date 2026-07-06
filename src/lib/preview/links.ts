export function prefixPreviewHref(href: string, prefix = ""): string {
  if (!prefix) {
    return href;
  }

  if (!href.startsWith("/")) {
    return href;
  }

  return `${prefix}${href}`;
}
