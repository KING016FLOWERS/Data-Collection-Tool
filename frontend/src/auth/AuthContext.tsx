import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { authApi } from "../services/api";
import type { LoginSession } from "../services/api";

type AuthContextValue = {
  session: LoginSession | null;
  loading: boolean;
  login: (userID: string, password: string) => Promise<LoginSession>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<LoginSession | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshSession = useCallback(async () => {
    try {
      const currentSession = await authApi.me();
      setSession(new Date(currentSession.expiresAt).getTime() > Date.now() ? currentSession : null);
    } catch {
      setSession(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Check the HttpOnly session cookie when the application starts.
  useEffect(() => {
    void refreshSession();
  }, [refreshSession]);

  const login = useCallback(async (userID: string, password: string) => {
    const loggedIn = await authApi.login(userID, password);
    setSession(loggedIn);
    return loggedIn;
  }, []);

  const logout = useCallback(async () => {
    setSession(null);
    try {
      await authApi.logout();
    } catch {
      // The server still rejects expired cookies; local UI must log out immediately.
    }
  }, []);

  // Check account status periodically so suspension or reassignment is reflected
  // without requiring a page reload. This does not renew the expiry timestamp.
  useEffect(() => {
    if (!session) return;
    const timer = window.setInterval(() => void refreshSession(), 60_000);
    return () => window.clearInterval(timer);
  }, [session?.userId, session?.role, session?.expiresAt, refreshSession]);

  // Enforce fixed 60-minute expiry even when the user is idle on the page.
  useEffect(() => {
    if (!session) return;
    const remainingMs = new Date(session.expiresAt).getTime() - Date.now();
    if (remainingMs <= 0) {
      void logout();
      return;
    }
    const timer = window.setTimeout(() => void logout(), remainingMs);
    return () => window.clearTimeout(timer);
  }, [session, logout]);

  // Revalidate when a sleeping computer wakes or the tab becomes visible.
  useEffect(() => {
    const onActive = () => {
      if (!document.hidden) void refreshSession();
    };
    const onExpired = () => {
      setSession(null);
      void authApi.logout().catch(() => undefined);
    };
    document.addEventListener("visibilitychange", onActive);
    window.addEventListener("focus", onActive);
    window.addEventListener("dct:auth-expired", onExpired);
    return () => {
      document.removeEventListener("visibilitychange", onActive);
      window.removeEventListener("focus", onActive);
      window.removeEventListener("dct:auth-expired", onExpired);
    };
  }, [refreshSession]);

  return (
    <AuthContext.Provider value={{ session, loading, login, logout, refreshSession }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be rendered inside AuthProvider");
  return context;
}
