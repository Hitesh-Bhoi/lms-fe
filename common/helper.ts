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