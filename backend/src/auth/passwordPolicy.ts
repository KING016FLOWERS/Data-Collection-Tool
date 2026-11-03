/** Required for NEW accounts and CHANGED passwords; login supports migrated accounts. */
export const PASSWORD_PATTERN = /^(?=.{8,15}$)(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[#@_$])[A-Za-z0-9#@_$]+$/;
export const PASSWORD_MESSAGE = "Password must be 8–15 characters and include uppercase, lowercase, a number and one of # @ _ $. No other characters are allowed.";
export function isValidPassword(value: unknown): value is string {
  return typeof value === "string" && PASSWORD_PATTERN.test(value);
}
