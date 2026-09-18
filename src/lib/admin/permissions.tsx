"use client";

import * as React from "react";
import { roles } from "@/lib/mocks";

export type RoleId = (typeof roles)[number]["id"];

/** Comptes de démonstration : un par rôle, pour tester l'interface selon les permissions. */
export const demoUsers: Record<RoleId, { name: string; email: string }> = {
  admin: { name: "Marc Folly", email: "m.folly@campus-one.com" },
  gestionnaire: { name: "Claire Mensah", email: "c.mensah@campus-one.com" },
  superviseur: { name: "Nadia Bello", email: "n.bello@campus-one.com" },
  compta: { name: "Didier Kpodar", email: "d.kpodar@campus-one.com" },
  direction: { name: "Estelle Gnassingbé", email: "e.gnassingbe@campus-one.com" },
};

export const DEMO_PASSWORD = "BackOffice2026";
export const DEMO_TOTP = "123456";

const KEY = "co-bo-session";

type Ctx = {
  ready: boolean;
  role: RoleId | null;
  signIn: (r: RoleId) => void;
  signOut: () => void;
  setRole: (r: RoleId) => void;
};

const SessionContext = React.createContext<Ctx>({ ready: false, role: null, signIn: () => {}, signOut: () => {}, setRole: () => {} });

/**
 * Session simulée du back-office (démo sans backend).
 * En production : session serveur dédiée au sous-domaine admin, MFA TOTP, expiration courte.
 */
export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = React.useState<RoleId | null>(null);
  const [ready, setReady] = React.useState(false);
  React.useEffect(() => {
    try {
      const r = localStorage.getItem(KEY) as RoleId | null;
      if (r && roles.some((x) => x.id === r)) setRoleState(r);
    } catch {}
    setReady(true);
  }, []);
  const persist = (r: RoleId | null) => {
    setRoleState(r);
    try {
      r ? localStorage.setItem(KEY, r) : localStorage.removeItem(KEY);
    } catch {}
  };
  return (
    <SessionContext.Provider value={{ ready, role, signIn: persist, signOut: () => persist(null), setRole: persist }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  return React.useContext(SessionContext);
}

export function useRole() {
  const ctx = React.useContext(SessionContext);
  const role = ctx.role ?? "admin";
  const def = roles.find((r) => r.id === role)!;
  const user = demoUsers[role];
  return {
    role,
    setRole: ctx.setRole,
    roleName: def.name,
    user,
    firstName: user.name.split(" ")[0]!,
    can: (p: string) => def.permissions.includes(p),
  };
}

/** N'affiche ses enfants que si le rôle courant possède la permission. */
export function Can({ perm, children, fallback = null }: { perm: string; children: React.ReactNode; fallback?: React.ReactNode }) {
  const { can } = useRole();
  return <>{can(perm) ? children : fallback}</>;
}
