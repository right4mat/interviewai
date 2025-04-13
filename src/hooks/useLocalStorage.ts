import { useState, useEffect } from "react";

/***************************  HOOKS - LOCAL STORAGE  ***************************/

export default function useLocalStorage<T>(
  key: string,
  defaultValue: T
): [T, (value: T | ((prevValue: T) => T)) => void] {
  const [value, setValue] = useState<T>(() => {
    const storedValue = typeof window !== "undefined" ? localStorage.getItem(key) : null;
    return storedValue === null ? defaultValue : JSON.parse(storedValue);
  });

  useEffect(() => {
    const listener = (e: StorageEvent): void => {
      if (typeof window !== "undefined" && e.storageArea === localStorage && e.key === key) {
        setValue(e.newValue ? JSON.parse(e.newValue) : e.newValue);
      }
    };
    window.addEventListener("storage", listener);

    return () => {
      window.removeEventListener("storage", listener);
    };
  }, [key, defaultValue]);

  const setValueInLocalStorage = (newValue: T | ((prevValue: T) => T)): void => {
    setValue((currentValue) => {
      const result = typeof newValue === "function" ? (newValue as (prevValue: T) => T)(currentValue) : newValue;
      if (typeof window !== "undefined") localStorage.setItem(key, JSON.stringify(result));
      return result;
    });
  };

  return [value, setValueInLocalStorage];
}
