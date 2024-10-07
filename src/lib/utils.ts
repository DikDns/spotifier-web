import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function textContentParser(rawHtml: string) {
  return rawHtml.replace(/<[^>]*>?/g, " ");
}
