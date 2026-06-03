export type StoredUser = {
  email: string;
  passwordHash: string;
};

const USER_KEY = "scentbyatarah_user";
const SESSION_KEY = "scentbyatarah_session";
const CART_SECRET = "scent-by-atarah-cart-integrity-v1";

export function hashString(value: string) {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}

export function hashPassword(password: string) {
  return hashString(`${password}:${CART_SECRET}`);
}

export function getStoredUser(): StoredUser | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StoredUser;
  } catch {
    return null;
  }
}

export function saveStoredUser(user: StoredUser) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearStoredUser() {
  localStorage.removeItem(USER_KEY);
}

export function setUserSession(active: boolean) {
  if (active) {
    sessionStorage.setItem(SESSION_KEY, "true");
  } else {
    sessionStorage.removeItem(SESSION_KEY);
  }
}

export function getUserSession() {
  return sessionStorage.getItem(SESSION_KEY) === "true";
}
