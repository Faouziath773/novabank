/**
 * Valide un email
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Valide un code MFA (6 chiffres)
 */
export const isValidMFACode = (code: string): boolean => {
  return /^\d{6}$/.test(code);
};

/**
 * Valide un mot de passe (minimum 6 caractères)
 */
export const isValidPassword = (password: string): boolean => {
  return password.length >= 6;
};

