"use client";

import { useCallback, useEffect, useState } from "react";

type SetValue<T> = T | ((prevValue: T) => T);
type SetLocalStorage<T> = (value: SetValue<T>) => void;

interface Options<T> {
  serializer?: (value: T) => string;
  parser?: (value: string) => T;
  logger?: (error: unknown) => void;
  syncData?: boolean;
}

const defaultOptions = {
  serializer: JSON.stringify,
  parser: JSON.parse,
  logger: console.error,
  syncData: true,
};

export function useLocalStorage<T>(
  key: string,
  initialValue?: T,
  options?: Options<T>,
): [T | undefined, SetLocalStorage<T>, () => void] {
  // Merge provided options with defaults
  const opts = { ...defaultOptions, ...options };
  const { serializer, parser, logger, syncData } = opts;

  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState<T | undefined>(() => {
    // Prevent build error on server side
    if (typeof window === "undefined") return initialValue;

    try {
      const item = window.localStorage.getItem(key);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return item ? parser(item) : initialValue;
    } catch (error) {
      logger(error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue: SetLocalStorage<T> = useCallback(
    (value) => {
      try {
        // Allow value to be a function so we have same API as useState
        const valueToStore =
          value instanceof Function ? value(storedValue as T) : value;

        setStoredValue(valueToStore);

        if (valueToStore === undefined) {
          window.localStorage.removeItem(key);
        } else {
          window.localStorage.setItem(key, serializer(valueToStore));
        }
      } catch (error) {
        logger(error);
      }
    },
    [key, logger, serializer, storedValue],
  );

  // Remove item from localStorage
  const removeItem = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(undefined);
    } catch (error) {
      logger(error);
    }
  }, [key, logger]);

  // Listen to changes in other tabs/windows
  useEffect(() => {
    if (!syncData) return;

    function handleStorageChange(e: StorageEvent) {
      if (e.key !== key) return;

      try {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const newValue = e.newValue ? parser(e.newValue) : undefined;

        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        setStoredValue(newValue);
      } catch (error) {
        logger(error);
      }
    }

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [key, logger, parser, syncData]);

  return [storedValue, setValue, removeItem];
}
