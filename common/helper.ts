import axios from "axios";

export const emailRegx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const formatDate = (date: string) => {
  if (!date) return '';
  return new Date(date).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

// check if text contains substantive content beyond whitespace and empty quotation marks
export const isValidTextContent = (value?: string | null): boolean => {
  if (!value) return false;
  return value.replace(/['"`\s]/g, '').length > 0;
};

// extract user-friendly error message from backend api response
export const getApiErrorMessage = (
  error: unknown,
  fallbackMessage = "Something went wrong"
): string => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;
    if (data) {
      if (typeof data.message === "string" && data.message.trim()) {
        return data.message.trim();
      }
      if (typeof data.error === "string" && data.error.trim()) {
        return data.error.trim();
      }
    }
    if (error.message && !error.message.startsWith("Request failed with status code")) {
      return error.message;
    }
  } else if (error instanceof Error && error.message) {
    return error.message;
  }
  return fallbackMessage;
};