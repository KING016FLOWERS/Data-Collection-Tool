import type { ReactNode } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

function LoadingSession() {
  return (
    <div role="status" className="grid min-h-[calc(100vh-134px)] place-items-center text-sm font-semibold text-emerald-800">
      Checking your session…
    </div>
  );
}

/** Redirect every role to its own, completely separate page hierarchy. */
function authenticatedHome(session: { role: "main_admin" | "top_management" | "department"; moduleId: string | null }) {
  if (session.role === "main_admin") return "/admin";
  if (session.role === "top_management") return "/dashboard";
  return session.moduleId ? `/user/modules/${session.moduleId}` : "/";
}

export function RequireAuth() {
  const { loading, session } = useAuth();
  const location = useLocation();
  if (loading) return <LoadingSession />;
  if (!session) return <Navigate to="/" replace state={{ from: location.pathname }} />;
  return <Outlet />;
}

/** The existing /modules/* pages and the full management console are TM ONLY. */
export function RequireTopManagement() {
  const { session } = useAuth();
  if (!session) return <Navigate to="/" replace />;
  if (session.role !== "top_management") return <Navigate to={authenticatedHome(session)} replace />;
  return <Outlet />;
}

/** Departmental users have no route into the Top Management page hierarchy. */
export function RequireDepartment() {
  const { session } = useAuth();
  if (!session) return <Navigate to="/" replace />;
  if (session.role !== "department") return <Navigate to={authenticatedHome(session)} replace />;
  if (!session.moduleId) return <Navigate to="/" replace />;
  return <Outlet />;
}

export function PublicOnly() {
  const { loading, session } = useAuth();
  if (loading) return <LoadingSession />;
  if (session) return <Navigate to={authenticatedHome(session)} replace />;
  return <Outlet />;
}

/** Allow only the one department explicitly assigned in the authenticated session. */
export function AssignedUserModuleRoute({ moduleId, children }: { moduleId: string; children: ReactNode }) {
  const { session } = useAuth();
  if (!session) return <Navigate to="/" replace />;
  if (session.role !== "department") return <Navigate to={authenticatedHome(session)} replace />;
  if (session.moduleId !== moduleId) {
    return <Navigate to={authenticatedHome(session)} replace />;
  }
  return <>{children}</>;
}

/** Main Admin is separate from the executive dashboard and department workspaces. */
export function RequireMainAdmin() {
  const { session } = useAuth();
  if (!session) return <Navigate to="/" replace />;
  if (session.role !== "main_admin") return <Navigate to={authenticatedHome(session)} replace />;
  return <Outlet />;
}
