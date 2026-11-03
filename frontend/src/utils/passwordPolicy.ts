/** Shared form rule; the API independently enforces the same condition. */
export const PASSWORD_PATTERN = /^(?=.{8,15}$)(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[#@_$])[A-Za-z0-9#@_$]+$/;
export const PASSWORD_HTML_PATTERN = "(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[#@_$])[A-Za-z0-9#@_$]{8,15}";
export const PASSWORD_MESSAGE = "8–15 characters: uppercase, lowercase, number, and # @ _ $ only (include at least one symbol).";
export const isValidPassword = (value: string) => PASSWORD_PATTERN.test(value);
