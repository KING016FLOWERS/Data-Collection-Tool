import { Building2, LayoutDashboard, Leaf, LogOut, ShieldCheck, UsersRound, UserRoundCog } from "lucide-react";
import type { ReactNode } from "react";
import { useAuth } from "../auth/AuthContext";
import { NavLink, Outlet } from "react-router-dom";

function navClass({ isActive }: { isActive: boolean }) {
  return `group flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-semibold transition-all duration-200 ${
    isActive
      ? "bg-white/[.12] text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,.10),0_10px_24px_rgba(0,0,0,.12)]"
      : "text-emerald-50/70 hover:bg-white/[.07] hover:text-white"
  }`;
}

export function ManagementLayout({ children }: { children?: ReactNode }) {
  const { session, logout } = useAuth();
  return (
    <div className="management-layout flex bg-[var(--app-canvas)] text-slate-800">
      <aside className="management-sidebar z-50 w-[78px] shrink-0 md:w-[238px]">
        <div className="flex h-full flex-col px-3 py-5 md:px-4">
          <div className="flex items-center justify-center gap-3 px-2 pb-5 md:justify-start">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-emerald-400 via-teal-400 to-cyan-400 text-slate-950 shadow-lg shadow-emerald-950/25">
              <Leaf className="h-5 w-5" />
            </div>
            <div className="hidden md:block">
              <div className="font-extrabold tracking-tight text-white">Top Management</div>
            </div>
          </div>

          <div className="mx-2 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          <nav className="mt-5 space-y-1.5">
            <NavLink to="/dashboard" className={navClass}>
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-white/[.06] text-emerald-100/65 transition group-hover:text-emerald-200">
                <LayoutDashboard className="h-[18px] w-[18px]" />
              </span>
              <span className="hidden md:inline">Dashboard</span>
            </NavLink>

            <NavLink to="/users" className={navClass}>
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-white/[.06] text-emerald-100/65 transition group-hover:text-emerald-200">
                <UsersRound className="h-[18px] w-[18px]" />
              </span>
              <span className="hidden md:inline">Users</span>
            </NavLink>
            <NavLink to="/profile" className={navClass}>
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-white/[.06] text-emerald-100/65 transition group-hover:text-emerald-200">
                <UserRoundCog className="h-[18px] w-[18px]" />
              </span>
              <span className="hidden md:inline">My Profile</span>
            </NavLink>
          </nav>

          <div className="mt-auto space-y-3">

            <button type="button" onClick={() => void logout()} className="group flex w-full items-center justify-center gap-3 rounded-2xl bg-white/[.08] px-3 py-3 text-sm font-bold text-emerald-50 transition hover:bg-rose-500/20 hover:text-white md:justify-start" title="Sign out" aria-label="Sign out">
              <LogOut className="h-[18px] w-[18px] shrink-0" /> <span className="hidden md:inline">Sign out</span>
            </button>
          </div>


        </div>
      </aside>

      <main className="management-main min-w-0 flex-1">
        <div className="sticky top-[var(--app-header-height)] z-40 flex min-h-[66px] flex-wrap items-center justify-between gap-3 border-b border-emerald-100 bg-white/95 px-4 py-3 shadow-[0_3px_12px_rgba(6,78,59,.07)] backdrop-blur-md sm:px-7">
          <div className="flex min-w-0 items-center gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-emerald-800 to-teal-600 text-white"><Building2 className="h-5 w-5" /></span>
            <div className="min-w-0">
              <p className="text-[10px] font-extrabold uppercase tracking-[.16em] text-emerald-700">Registered Industry</p>
              <h2 className="break-words text-base font-black leading-6 text-slate-900 sm:text-lg">{session?.industry ?? "Industry not assigned"}</h2>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-xl bg-emerald-50 px-3 py-2 text-xs font-extrabold text-emerald-800 ring-1 ring-emerald-100">Top Management · {session?.userId}</span>
            <NavLink to="/profile" className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-white px-3 py-2 text-xs font-extrabold text-emerald-800 transition hover:bg-emerald-50"><UserRoundCog className="h-4 w-4" /> Edit Details</NavLink>
          </div>
        </div>
        {children ?? <Outlet />}
      </main>
    </div>
  );
}
