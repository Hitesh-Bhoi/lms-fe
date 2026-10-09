import { useEffect, useState } from "react";
/**
 * custom hook that debounces a fast-changing value by a specified delay in milliseconds.
 *
 * @param value - the input value to debounce
 * @param delay - delay in milliseconds (default: 300ms)
 * @returns the debounced value
 */
export const useDebounce = <T>(value: T, delay: number = 300): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
};