/** Email validation for Top Management sign-up (the server repeats this check). */
export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function isValidRegistrationEmail(value: string): boolean {
  const email = normalizeEmail(value);
  if (!email || email.length > 254) return false;
  const parts = email.split("@");
  if (parts.length !== 2 || parts[0].length > 64 || !parts[0] || !parts[1]) return false;
  if (email.includes("..") || parts[0].startsWith(".") || parts[0].endsWith(".")) return false;
  if (!/^[a-z0-9._%+-]+$/.test(parts[0])) return false;
  const labels = parts[1].split(".");
  if (labels.length < 2 || !/^[a-z]{2,}$/i.test(labels[labels.length - 1])) return false;
  return labels.every(label => !!label && label.length <= 63 && /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i.test(label));
}
