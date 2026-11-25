// Rules for usernames and PINs. Pure functions, no network, so they are easy to test.
// A username is a made-up handle (never a phone number). A PIN is exactly 6 digits.

// Reserved .invalid domain: the address can never receive mail, which is what we want.
// The username only becomes a fake email because that is what the login service expects.
const EMAIL_DOMAIN = 'users.narishakti.invalid';

export const normaliseUsername = (value) => String(value || '').trim().toLowerCase();

export const usernameToEmail = (username) => `${normaliseUsername(username)}@${EMAIL_DOMAIN}`;

export const emailToUsername = (email) => String(email || '').split('@')[0];

// '' when fine, otherwise a short code the screen turns into a message:
//   empty | format (3-20 letters, numbers or _) | phone (looks like a phone number)
export const validateUsername = (value) => {
  const username = normaliseUsername(value);
  if (!username) return 'empty';
  if (!/^[a-z0-9_]{3,20}$/.test(username)) return 'format';
  if (/\d{10}/.test(username.replaceAll('_', ''))) return 'phone';
  return '';
};

const SEQUENCE = '0123456789';

// '' when fine, otherwise: format (not 6 digits) | weak (123456, 000000, 121212, 987654 ...)
export const validatePin = (pin) => {
  const text = String(pin || '');
  if (!/^\d{6}$/.test(text)) return 'format';
  if (/^(\d{1,3})\1+$/.test(text)) return 'weak'; // 111111, 121212, 123123
  if (SEQUENCE.includes(text) || [...SEQUENCE].reverse().join('').includes(text)) return 'weak'; // 123456, 654321
  return '';
};

export const onlyDigits = (value, max = 6) => String(value || '').replace(/\D/g, '').slice(0, max);
