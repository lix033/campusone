"use client";

import * as React from "react";

/**
 * Session simulée (démo sans backend) : stockée dans le navigateur.
 * En production : cookie httpOnly + refresh token posés par l'API.
 */
export type Session = { firstName: string; lastName: string; email: string };

const KEY = "co-session";
const PENDING = "co-pending-session";
const EVENT = "co-session-change";

export const demoAccount = { email: "aminata.diallo@exemple.com", password: "Campus2026", code: "123456" };

function read(key: string, store: "local" | "session" = "local"): Session | null {
  try {
    const raw = (store === "local" ? localStorage : sessionStorage).getItem(key);
    return raw ? (JSON.parse(raw) as Session) : null;
  } catch {
    return null;
  }
}

/** Identité en attente de la vérification du code (entre mot de passe et 2FA). */
export function setPendingSession(s: Session) {
  try {
    sessionStorage.setItem(PENDING, JSON.stringify(s));
  } catch {}
}

export function getPendingSession() {
  return read(PENDING, "session");
}

export function confirmSession() {
  const s = getPendingSession() ?? { firstName: "Aminata", lastName: "Diallo", email: demoAccount.email };
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
    sessionStorage.removeItem(PENDING);
  } catch {}
  window.dispatchEvent(new Event(EVENT));
}

export function signOut() {
  try {
    localStorage.removeItem(KEY);
  } catch {}
  window.dispatchEvent(new Event(EVENT));
}

let cache: { raw: string | null; value: Session | null } = { raw: null, value: null };

function snapshot(): Session | null {
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(KEY);
  } catch {}
  if (raw !== cache.raw) cache = { raw, value: raw ? (JSON.parse(raw) as Session) : null };
  return cache.value;
}

function subscribe(cb: () => void) {
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}

/** `undefined` tant que la session n'est pas lue (rendu serveur), puis `Session | null`. */
export function useSession(): Session | null | undefined {
  return React.useSyncExternalStore(subscribe, snapshot, () => undefined);
}
