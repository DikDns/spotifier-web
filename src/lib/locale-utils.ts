"use client";

import enTranslations from "../locales/en.json";
import idTranslations from "../locales/id.json";

export type Language = "id" | "en";

const LANGUAGE_KEY = "spotifier-language";

export function getLanguage(): Language {
  if (typeof window === "undefined") return "id";

  const storedLanguage = localStorage.getItem(LANGUAGE_KEY) as Language;
  return storedLanguage ?? "id";
}

export function setLanguage(language: Language) {
  if (typeof window === "undefined") return;

  localStorage.setItem(LANGUAGE_KEY, language);
}

export function useLocale() {
  const language = getLanguage();
  const translations = language === "en" ? enTranslations : idTranslations;
  return { language, translations };
}
