import { useSyncExternalStore } from 'react';
import { supabase, isSupabaseConfigured } from './supabaseClient';
import { emailToUsername, normaliseUsername, usernameToEmail } from './authRules';
import { forgetSyncState } from './sync';

// Accounts are a username plus a 6-digit PIN. No phone number, no email, no real name.
// Behind the scenes the username becomes a made-up address (see authRules.js) so we can use the
// login service's normal password sign-in, which also gives us its attempt limits for free.
//
// A visitor with no account is a "guest": nothing is sent to the server for her.

// If Supabase is not set up (for example, a fresh checkout), accounts do not exist at all.
export const accountsEnabled = isSupabaseConfigured;

// status: off (no backend) | loading (checking for a saved sign-in) | signedOut | signedIn
let state = { status: accountsEnabled ? 'loading' : 'off', username: '' };
const listeners = new Set();

const publish = (next) => {
  if (next.status === state.status && next.username === state.username) return;
  state = next;
  listeners.forEach((listener) => listener());
};

const fromSession = (session) => {
  const user = session?.user;
  if (user && !user.is_anonymous) return { status: 'signedIn', username: emailToUsername(user.email) };
  return { status: 'signedOut', username: '' };
};

if (supabase) {
  supabase.auth.getSession()
    .then(({ data }) => publish(fromSession(data.session)))
    .catch(() => publish({ status: 'signedOut', username: '' }));
  supabase.auth.onAuthStateChange((_event, session) => publish(fromSession(session)));
}

const subscribe = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};
export const useAuth = () => useSyncExternalStore(subscribe, () => state, () => state);

// Turns a login-service error into a short reason the screen can explain.
const classify = (error) => {
  const message = (error?.message || '').toLowerCase();
  if (error?.code === 'user_already_exists' || message.includes('already registered') || message.includes('already exists')) return 'taken';
  if (error?.status === 429 || error?.code === 'over_request_rate_limit' || message.includes('rate limit')) return 'rate_limited';
  if (error?.code === 'invalid_credentials' || message.includes('invalid login')) return 'invalid';
  if (error?.code === 'weak_password') return 'weak';
  if (message.includes('failed to fetch') || message.includes('network')) return 'network';
  return 'unknown';
};

// Result: { ok: true } or { ok: false, reason: taken | rate_limited | weak | network | confirm_required | unknown }
export const signUpWithPin = async (username, pin) => {
  const { data, error } = await supabase.auth.signUp({ email: usernameToEmail(username), password: pin });
  if (error) return { ok: false, reason: classify(error) };
  // No session means the project still demands e-mail confirmation, which can never work for these addresses.
  if (!data.session) return { ok: false, reason: 'confirm_required' };
  return { ok: true };
};

// Result: { ok: true } or { ok: false, reason: invalid | rate_limited | network | unknown }.
// "invalid" covers both a wrong PIN and an unknown username, on purpose: we never say which.
export const signInWithPin = async (username, pin) => {
  const { error } = await supabase.auth.signInWithPassword({ email: usernameToEmail(username), password: pin });
  if (error) {
    const reason = classify(error);
    return { ok: false, reason: reason === 'taken' || reason === 'weak' ? 'invalid' : reason };
  }
  return { ok: true };
};

// Signs out of this browser only. The account and its progress stay safe on the server.
export const signOutDevice = async () => {
  try {
    await supabase?.auth.signOut({ scope: 'local' });
  } catch {
    // already signed out; nothing more to do
  }
  forgetSyncState();
};

export { normaliseUsername };
