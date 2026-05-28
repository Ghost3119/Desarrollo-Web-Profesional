import { createContext, type ReactNode, useContext, useMemo, useState } from "react";
import type { AuthResult } from "../../../../../../packages/shared/src/contracts";

type AuthSession = {
  user: AuthResult | null;
  signIn: (user: AuthResult) => void;
  signOut: () => void;
};

const storageKey = "portal-horizonte-session";
const AuthSessionContext = createContext<AuthSession | null>(null);

export function AuthSessionProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthResult | null>(() => readStoredUser());

  const value = useMemo<AuthSession>(
    () => ({
      user,
      signIn: (nextUser) => {
        localStorage.setItem(storageKey, JSON.stringify(nextUser));
        setUser(nextUser);
      },
      signOut: () => {
        localStorage.removeItem(storageKey);
        setUser(null);
      }
    }),
    [user]
  );

  return <AuthSessionContext.Provider value={value}>{children}</AuthSessionContext.Provider>;
}

export function useAuthSession(): AuthSession {
  const context = useContext(AuthSessionContext);
  if (!context) {
    throw new Error("useAuthSession debe usarse dentro de AuthSessionProvider.");
  }
  return context;
}

function readStoredUser(): AuthResult | null {
  try {
    const value = localStorage.getItem(storageKey);
    return value ? (JSON.parse(value) as AuthResult) : null;
  } catch {
    localStorage.removeItem(storageKey);
    return null;
  }
}
