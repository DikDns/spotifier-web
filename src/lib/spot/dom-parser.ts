"use client";

export function domParser(
  rawHtml: string,
  type: DOMParserSupportedType = "text/html",
) {
  const parser = new DOMParser();
  return parser.parseFromString(rawHtml, type);
}
