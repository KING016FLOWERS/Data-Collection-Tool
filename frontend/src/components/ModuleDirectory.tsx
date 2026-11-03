import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  Grid2X2,
  LayoutList,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import { modules } from "../data/modules";
import type { SustainabilityModule } from "../types";
import { ModuleIcon } from "./ModuleIcon";

type DisplayMode = "grid" | "list";

/** Each department receives a distinct, readable gradient palette.
 * These colors are intentionally local to the launchpad: backend/module metadata
 * and every existing department route remain unchanged.
 */
type WorkspacePalette = {
  accent: string;
  text: string;
  from: string;
  to: string;
};

const workspacePalettes: Record<string, WorkspacePalette> = {
  "01": { accent: "#475569", text: "#334155", from: "#f0f5fb", to: "#dbe6f2" }, // Slate
  "02": { accent: "#087c9c", text: "#075976", from: "#edfaff", to: "#c5edfa" }, // Cyan
  "03": { accent: "#658f18", text: "#4a6d0c", from: "#f7fce8", to: "#e0f1b5" }, // Lime
  "04": { accent: "#a75d36", text: "#874325", from: "#fff7f1", to: "#f9dcc9" }, // Copper
  "05": { accent: "#ae7809", text: "#805604", from: "#fffae7", to: "#f7e2a4" }, // Gold
  "06": { accent: "#5547c9", text: "#40339c", from: "#f4f2ff", to: "#dcd8ff" }, // Indigo
  "07": { accent: "#2079bf", text: "#15578b", from: "#eef8ff", to: "#c6e5fc" }, // Ocean
  "08": { accent: "#893fc0", text: "#672694", from: "#f9f1ff", to: "#e9cffb" }, // Violet
  "09": { accent: "#20874e", text: "#176136", from: "#effcf2", to: "#c8efd2" }, // Green
  "10": { accent: "#437c8e", text: "#2c5b6d", from: "#eef9fa", to: "#cee7ee" }, // Steel aqua
  "11": { accent: "#bf344a", text: "#922037", from: "#fff4f5", to: "#fad3da" }, // Crimson
  "12": { accent: "#c03d89", text: "#942c67", from: "#fff3fa", to: "#f8d0e7" }, // Rose
  "13": { accent: "#2c5fc3", text: "#1b4498", from: "#f0f5ff", to: "#d2e0ff" }, // Royal blue
  "14": { accent: "#c5631a", text: "#944513", from: "#fff5eb", to: "#fbd6af" }, // Orange
  "15": { accent: "#9e5239", text: "#723b2b", from: "#fff4ee", to: "#efcec1" }, // Terracotta
  "16": { accent: "#0b9472", text: "#06684d", from: "#ecfcf7", to: "#bef0df" }, // Emerald
  "17": { accent: "#7162b8", text: "#55438f", from: "#f6f4ff", to: "#ded8fa" }, // Lavender
  "18": { accent: "#0d9191", text: "#086767", from: "#ebfdfc", to: "#bfefed" }, // Teal
};

/** Build subtle shadows and outlines around each department's unique accent. */
function hexToRgba(hex: string, alpha: number): string {
  const normalized = hex.replace("#", "");
  if (!/^[0-9a-f]{6}$/i.test(normalized)) return `rgba(5, 150, 105, ${alpha})`;
  const r = parseInt(normalized.slice(0, 2), 16);
  const g = parseInt(normalized.slice(2, 4), 16);
  const b = parseInt(normalized.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function accentStyle(module: SustainabilityModule): CSSProperties {
  const palette = workspacePalettes[module.id] ?? {
    accent: module.color,
    text: module.color,
    from: "#f7fbf9",
    to: "#dff5ea",
  };
  return {
    "--workspace-color": palette.accent,
    "--workspace-ink": palette.text,
    "--workspace-surface-from": palette.from,
    "--workspace-surface-to": palette.to,
    "--workspace-glow": hexToRgba(palette.accent, 0.17),
    "--workspace-stroke": hexToRgba(palette.accent, 0.24),
    "--workspace-shadow": hexToRgba(palette.accent, 0.16),
    "--workspace-action-bg": hexToRgba(palette.accent, 0.12),
  } as CSSProperties;
}

/** A direct link, not a carousel selector: clicking anywhere opens its dedicated page. */
function WorkspaceLink({ module, displayMode }: {
  module: SustainabilityModule;
  displayMode: DisplayMode;
}) {
  const reducedMotion = useReducedMotion();
  const compact = displayMode === "list";

  return (
    <motion.div
      layout={!reducedMotion}
      initial={reducedMotion ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reducedMotion ? undefined : { opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.24, ease: "easeOut" }}
      className="min-w-0"
      style={accentStyle(module)}
    >
      <Link
        to={`/modules/${module.id}`}
        className={`workspace-link group ${compact ? "workspace-link-list" : "workspace-link-grid"}`}
        aria-label={`Open module ${module.id}: ${module.title}`}
      >
        <span className="workspace-link-edge" aria-hidden="true" />
        {compact ? (
          <>
            <span className="workspace-icon workspace-icon-compact" aria-hidden="true">
              <ModuleIcon name={module.icon} className="h-5 w-5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="mb-1 block text-[10px] font-extrabold uppercase tracking-[0.16em] workspace-kicker">
                Module {module.id}
              </span>
              <span className="workspace-title block text-sm font-extrabold leading-snug sm:text-[15px]">
                {module.title}
              </span>
              <span className="mt-1 block text-xs leading-5 text-slate-500">
                {module.description}
              </span>
            </span>
            <span className="workspace-open-icon shrink-0" aria-hidden="true">
              <ArrowUpRight className="h-5 w-5" />
            </span>
          </>
        ) : (
          <>
            <span className="flex items-start justify-between gap-4">
              <span className="workspace-icon" aria-hidden="true">
                <ModuleIcon name={module.icon} className="h-6 w-6" />
              </span>
              <span className="workspace-index" aria-hidden="true">{module.id}</span>
            </span>
            <span className="mt-5 block flex-1">
             
              <span className="workspace-title mt-2 block text-[17px] font-extrabold leading-[1.35] tracking-tight sm:text-lg">
                {module.title}
              </span>
              <span className="mt-2.5 block text-xs leading-[1.65] text-slate-600">
                {module.description}
              </span>
            </span>
            <span className="workspace-link-action">
              <span>Click to visualize</span>
              <span className="workspace-action-arrow" aria-hidden="true">
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </span>
          </>
        )}
      </Link>
    </motion.div>
  );
}

/** Searchable executive launchpad, intentionally replacing the carousel. */
export function ModuleDirectory() {
  const [searchValue, setSearchValue] = useState("");
  const [displayMode, setDisplayMode] = useState<DisplayMode>("grid");
  const reducedMotion = useReducedMotion();

  const visibleModules = useMemo(() => {
    const needle = searchValue.trim().toLocaleLowerCase();
    if (!needle) return modules;
    return modules.filter((module) =>
      [module.id, module.title, module.description, `module ${module.id}`].some((field) =>
        field.toLocaleLowerCase().includes(needle),
      ),
    );
  }, [searchValue]);

  return (
    <div className="module-directory mx-auto w-full max-w-[1500px]">
      <div className="module-directory-hero relative overflow-hidden rounded-[30px] px-6 pb-16 pt-7 text-white sm:px-8 sm:pb-20 sm:pt-9 lg:px-10">
        <div className="module-directory-grid-pattern" aria-hidden="true" />
        <div className="module-directory-halo" aria-hidden="true" />
        <div className="relative z-10 flex items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.16em] text-emerald-50 ring-1 ring-white/15">
              <Sparkles className="h-3.5 w-3.5" /> Executive workspace
            </div>
            <h1 className="mt-4 max-w-[650px] text-[clamp(1.7rem,3.3vw,2.55rem)] font-black leading-tight tracking-[-0.035em]">
              Top Management Navigator
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-emerald-50/80 sm:text-[15px]">
              One place for every sustainability function. Select any department below to open its dedicated workspace.
            </p>
          </div>
          <div className="hidden shrink-0 rounded-[26px] bg-white/[0.09] px-7 py-5 text-center ring-1 ring-white/[0.16] backdrop-blur-sm lg:block">
            <div className="text-5xl font-black tracking-[-0.06em] text-white">18</div>
            <div className="mt-1 text-[10px] font-bold uppercase tracking-[0.19em] text-emerald-100/80">Workspaces</div>
          </div>
        </div>
      </div>

      <div className="module-directory-toolbar relative z-10 mx-3 -mt-8 flex flex-col gap-3 rounded-2xl bg-white p-3 shadow-[0_18px_44px_rgba(5,56,44,0.13)] ring-1 ring-emerald-950/[0.08] sm:mx-6 sm:flex-row sm:items-center sm:justify-between sm:gap-5 sm:p-4 lg:mx-9">
        <div className="relative min-w-0 flex-1">
          <label htmlFor="module-directory-search" className="sr-only">Search departments and modules</label>
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-400" aria-hidden="true" />
          <input
            id="module-directory-search"
            type="search"
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
            placeholder="Search department, topic or module number..."
            autoComplete="off"
            className="h-12 w-full rounded-xl bg-slate-50 py-3 pl-11 pr-10 text-sm font-medium text-slate-800 outline-none ring-1 ring-inset ring-slate-200 transition placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-emerald-500"
          />
          {searchValue && (
            <button type="button" onClick={() => setSearchValue("")} aria-label="Clear module search" className="absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-lg text-slate-400 transition hover:bg-slate-200 hover:text-slate-800">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <div className="flex shrink-0 items-center justify-between gap-3 sm:justify-end">
          <span className="whitespace-nowrap text-xs font-bold text-slate-500" role="status" aria-live="polite">
            <span className="font-black text-emerald-800">{visibleModules.length}</span> of {modules.length} modules
          </span>
          <div className="inline-flex items-center gap-1 rounded-xl bg-slate-100 p-1 ring-1 ring-inset ring-slate-200/80" role="group" aria-label="Module display style">
            <button type="button" title="Card view" aria-label="Card view" aria-pressed={displayMode === "grid"} onClick={() => setDisplayMode("grid")} className={`module-display-button ${displayMode === "grid" ? "is-active" : ""}`}>
              <Grid2X2 className="h-[18px] w-[18px]" />
            </button>
            <button type="button" title="Compact list view" aria-label="Compact list view" aria-pressed={displayMode === "list"} onClick={() => setDisplayMode("list")} className={`module-display-button ${displayMode === "list" ? "is-active" : ""}`}>
              <LayoutList className="h-[18px] w-[18px]" />
            </button>
          </div>
        </div>
      </div>

      <div className="mb-4 mt-9 flex flex-wrap items-end justify-between gap-3 px-1 sm:px-2">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-800">Module directory</p>
          <h2 className="mt-1 text-xl font-black tracking-tight text-slate-900 sm:text-2xl">
            Explore your workspaces
          </h2>
        </div>
        <p className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
          Click a card to open the module <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </p>
      </div>

      <motion.div
        layout={!reducedMotion}
        className={displayMode === "grid"
          ? "grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
          : "grid grid-cols-1 gap-3 lg:grid-cols-2"
        }
      >
        <AnimatePresence mode="popLayout" initial={false}>
          {visibleModules.map((module) => (
            <WorkspaceLink key={module.id} module={module} displayMode={displayMode} />
          ))}
        </AnimatePresence>
      </motion.div>

      {visibleModules.length === 0 && (
        <div className="mt-5 rounded-[26px] bg-white px-6 py-16 text-center shadow-sm ring-1 ring-slate-200">
          <Search className="mx-auto h-9 w-9 text-emerald-300" aria-hidden="true" />
          <p className="mt-4 text-lg font-extrabold text-slate-900">No modules found</p>
          <p className="mt-1 text-sm text-slate-500">Try another department name or module number.</p>
          <button type="button" onClick={() => setSearchValue("")} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-800 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-700">
            Show all 18 modules <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}


    </div>
  );
}
