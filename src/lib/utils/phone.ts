const GHANA_MOBILE_RE = /^(\+?233|0)[235]\d{8}$/;

/** Strips spaces, dashes, dots and parentheses from a typed phone number. */
export function cleanPhoneInput(value: string): string {
  return value.replace(/[\s\-().]/g, "");
}

/** Light client-side check for a Ghana mobile number (0XXXXXXXXX or +233XXXXXXXXX). The server has the final say. */
export function isValidGhanaPhone(value: string): boolean {
  return GHANA_MOBILE_RE.test(cleanPhoneInput(value));
}
