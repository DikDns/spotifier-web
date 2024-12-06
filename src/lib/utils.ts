import { type ClassValue, clsx } from "clsx";
import moment from "moment";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function textContentParser(rawHtml: string) {
  return rawHtml.replace(/<[^>]*>?/g, " ");
}

interface FormatAccessTimeOptions {
  relative?: boolean;
  detail?: boolean;
}

export function formatAccessTime(
  accessTime: Date,
  { relative = false, detail = false }: FormatAccessTimeOptions = {},
) {
  return `${relative ? moment(accessTime).fromNow() : moment(accessTime).format("MMM DD, YYYY")} ${
    detail ? `(${moment(accessTime).format("MMM DD, YYYY")})` : ""
  }`;
}
