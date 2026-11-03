import { Outlet } from "react-router-dom";

/** Shared, consistently styled header and footer for every page. */
export function CommonLayout() {
  return (
    <div className="app-shell flex min-h-screen flex-col text-slate-800">
      <header className="app-header z-[80] shrink-0">
        <div className="app-header-grid" aria-hidden="true" />
        <div className="relative mx-auto flex h-[var(--app-header-height)] w-full max-w-[1920px] items-center justify-center px-5">
          <div className="leather-nexus-brand">
            <h1 className="leather-nexus-wordmark text-center" aria-label="Leather Nexus">
              <span className="leather-nexus-leather">Leather</span>{" "}
              <span className="leather-nexus-nexus">Nexus</span>
            </h1>
          </div>
        </div>
      </header>

      <div className="min-h-0 flex-1 pb-[var(--app-footer-height)]">
        <Outlet />
      </div>

      <footer className="app-footer">
        <div className="mx-auto flex min-h-[var(--app-footer-height)] w-full max-w-[1920px] items-center justify-center px-5">
          <p className="text-center text-[11px] font-semibold tracking-[0.06em] text-emerald-50/85">
            Copyright © 2026
          </p>
        </div>
      </footer>
    </div>
  );
}
