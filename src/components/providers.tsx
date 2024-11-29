"use client";

import { type PropsWithChildren } from "react";
import { ThemeProvider as NextThemeProvider } from "next-themes";

type ThemeProviderProps = PropsWithChildren<typeof NextThemeProvider>;

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemeProvider {...props}>{children}</NextThemeProvider>;
}
