export type FieldErrors<T extends string> = Partial<Record<T, string>>;

export function sanitizeText(value: string) {
  return value.replace(/[<>]/g, "").replace(/\s+/g, " ").trim();
}

export function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function hasMinimumLength(value: string, minimum: number) {
  return sanitizeText(value).length >= minimum;
}
