export const MAX_FAILED_ATTEMPTS = 5;
export const WINDOW_MS = 15 * 60 * 1000;

type ThrottleEntry = {
  count: number;
  firstFailureAt: number;
};

const failedLoginAttempts = new Map<string, ThrottleEntry>();

function now() {
  return Date.now();
}

function getCurrentEntry(key: string) {
  const entry = failedLoginAttempts.get(key);

  if (!entry) {
    return null;
  }

  if (now() - entry.firstFailureAt >= WINDOW_MS) {
    failedLoginAttempts.delete(key);
    return null;
  }

  return entry;
}

export function checkLoginThrottle(key: string) {
  const entry = getCurrentEntry(key);
  return !entry || entry.count < MAX_FAILED_ATTEMPTS;
}

export function recordLoginFailure(key: string) {
  const entry = getCurrentEntry(key);

  if (!entry) {
    failedLoginAttempts.set(key, {
      count: 1,
      firstFailureAt: now(),
    });
    return;
  }

  entry.count += 1;
}

export function clearLoginThrottle(key: string) {
  failedLoginAttempts.delete(key);
}
