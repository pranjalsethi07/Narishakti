# Cloud backup setup (Supabase)

Phase 1 lets a woman make an account with just a **username and a 6-digit PIN**, and backs up
her progress (lessons, games, tests, streak). No name, phone number, email or photo ever leaves
the device. Visitors who don't sign in are **guests**: nothing is sent to the server for them,
and Didi Connect, Health Tracker, Digital Doctor and Profile are locked until they sign in.

The app works without any of this. If the two keys in step 4 are missing, there are no accounts:
everything stays open and local, as before.

## One-time setup

1. **Create a project** at supabase.com. Pick the **Mumbai (ap-south-1)** region so data stays in India.
2. **Set up sign-in** (Authentication -> Sign In / Providers):
   - **Email**: enabled, and **Confirm email: OFF**. The usernames become made-up addresses that can
     never receive mail, so confirmation would block every sign-up.
   - **Password requirements**: minimum length **6**, and *no* required character types (a PIN is only digits).
   - **Anonymous sign-ins**: leave OFF. Guests are handled in the app and never touch the server.
   - If sign-up is refused with an "invalid email" error, the placeholder domain
     (`users.narishakti.invalid`, set in `src/lib/authRules.js`) is being rejected. Change it to a
     domain you control.
3. **Create the tables:** SQL Editor -> New query -> paste all of
   `supabase/migrations/0001_phase1_anonymous_sync.sql` -> Run. It is safe to run twice.
4. **Add the keys** to `.env` (copy the names from `.env.example`):
   `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` (Project Settings -> API).
   Never use the `service_role` key in this app.
5. Restart `npm run dev`.

## Check that it works (5 minutes)

1. Open http://localhost:5173/ -> **Create account** (username, name, age, PIN twice). You land on a
   **recovery code** screen. Save it, tick the box, continue.
2. Go to **Profile**. "Backup & recovery" should say *Backed up*.
3. In Supabase -> Table Editor: one row each in `accounts`, `device_links` and `profiles`.
4. Finish a lesson or a game level. Within a few seconds a row appears in `lesson_progress` or `game_progress`.
5. Open a **private window** (a "new phone") -> **Sign in** with the same username and PIN. Your progress appears.
6. In another private window choose **Guest**. Didi Connect, Tracker, Digital Doctor and Profile show a lock
   and ask you to sign in.
7. **Forgot your PIN** (Sign in tab): pick a *new* username and PIN, enter the recovery code from step 1.
   Your progress moves to the new account.

## Check the privacy rules (do this before launch)

Row-level security is what keeps one user's data away from another's. In the SQL editor run:

```sql
-- every table should say true
select relname, relrowsecurity from pg_class
where relname in ('accounts','device_links','recovery_codes','profiles','lesson_progress','game_progress','test_results');
```

Then, from a **private window with no sign-in**, try to read the data with the public key. It must return nothing:

```js
// browser console, on the app's page, signed out
// (supabase is not exposed globally; use curl instead)
curl "$VITE_SUPABASE_URL/rest/v1/profiles?select=*" -H "apikey: $VITE_SUPABASE_ANON_KEY"
// expected: [] or a permission error, never someone's rows
```

## Before real users

- **PIN guessing:** a 6-digit PIN has only a million possibilities. Supabase limits sign-in attempts per
  IP address, but it does **not** lock one account after N wrong tries. Before launch, turn on CAPTCHA
  (Authentication -> Attack Protection) and look at the *password verification hook* or an Edge Function
  to add a per-account lockout. Usernames are chosen by the user (not phone numbers), so an attacker has
  to know the username first.
- **Spam sign-ups:** keep the default rate limits for sign-ups too.
- **Backups:** the free plan does not give you proper backups. Use a paid plan for production and
  test restoring a backup once.
- **Free projects can pause** after a period of inactivity. Check current limits on supabase.com/pricing.
- **Privacy notice:** say what is stored (age group, language, progress, a random ID) and what is not.
  Under-18 users need extra care under India's DPDP Act. Have a lawyer confirm what applies to you.

## How it fits together

| Piece | Where |
|---|---|
| Tables, rules, recovery functions | `supabase/migrations/0001_phase1_anonymous_sync.sql` |
| Supabase client (off if keys are missing) | `src/lib/supabaseClient.js` |
| Sync engine: sign in, pull, merge, push | `src/lib/sync.js` |
| Merge rules (pure, tested) | `src/lib/syncMerge.js` |
| Backup card on the Profile page | `src/components/AccountBackup.jsx` |
| Sign in / create account / guest / recover (landing page) | `src/components/AuthCard.jsx` |
| Username + PIN rules (tested) | `src/lib/authRules.js` |
| Sign-in state and actions | `src/lib/auth.js` |
| Which pages guests can't open (edit this list to change it) | `src/lib/guestAccess.js` |
| The "sign in to use this" screen | `src/components/RequireAccount.jsx` |

Merge rules: lessons and steps are joined, game stars and test scores keep the best, the more
recent streak wins, questions keep the highest count. Merging twice changes nothing, and the
order does not matter, so any number of phones converge to the same progress.

## Not stored on the server on purpose

Name, phone number, email, photo, income, marital status, kids, education, chat history and Didi Connect
posts. (Community posts come in phase 2.)

## Forgot your PIN

There is no email or phone to reset a PIN. The recovery code is the way back: on the Sign in tab,
choose *Forgot your PIN?*, make a new username and PIN, and enter the code. The progress moves to the
new account. The old username can't be used again. A proper in-place PIN reset needs a small
server function and can be added later.
