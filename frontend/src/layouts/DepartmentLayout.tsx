import type { ReactNode } from "react";
import { Outlet } from "react-router-dom";
import { LogOut, UserRound, Clock3, BookOpenCheck } from "lucide-react";
import { useAuth } from "../auth/AuthContext";
import { modules } from "../data/modules";

// Unlike the Top Management layout, departmental users do not receive the
// management sidebar, the Users screen, or links to other departments.
export function DepartmentLayout({ children }: { children?: ReactNode }) {
  const { session, logout } = useAuth();
  const assigned = modules.find((item) => item.id === session?.moduleId);
  return (
    <div className="min-h-[calc(100vh-var(--app-header-height)-var(--app-footer-height))] bg-[var(--app-canvas)]">
      <div className="border-b border-emerald-100 bg-white/95 px-4 py-3 shadow-[0_8px_22px_rgba(5,78,59,0.05)] sm:px-7">
        <div className="mx-auto flex max-w-[1500px] flex-wrap items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-100 text-emerald-800">
              <BookOpenCheck className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <div className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-emerald-700">My Department · Module {assigned?.id ?? "—"}</div>
              <div className="truncate text-sm font-bold text-slate-900 sm:text-base">{assigned?.title ?? "Assigned Workspace"}</div>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="flex min-w-0 items-center gap-2.5 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 px-3 py-1.5 shadow-sm ring-1 ring-emerald-100" title={`Signed in as ${session?.name || session?.userId || "Department user"}`}>
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-emerald-100 text-emerald-800"><UserRound className="h-4 w-4" /></span>
              <span className="min-w-0 text-left">
                <span className="block max-w-[150px] truncate text-xs font-extrabold text-emerald-950 sm:max-w-[230px]">{session?.name?.trim() || session?.userId || "Department user"}</span>
                <span className="block text-[10px] font-medium text-emerald-700">{session?.userId}</span>
              </span>
            </div>
            <button type="button" onClick={() => void logout()} className="inline-flex items-center gap-2 rounded-xl bg-rose-50 px-3 py-2 text-xs font-bold text-rose-700 transition hover:bg-rose-100"><LogOut className="h-4 w-4" /> Sign out</button>
          </div>
        </div>
      </div>
      <main>{children ?? <Outlet />}</main>
    </div>
  );
}
