import type { CSSProperties } from "react";
import { ArrowUpRight, Leaf, MousePointer2 } from "lucide-react";
import { Link } from "react-router-dom";
import { modules } from "../data/modules";
import { ModuleIcon } from "./ModuleIcon";

const positions = [
  { id: "01", x: 50.000, y: 8.000, tip: "top" },
  { id: "02", x: 64.365, y: 10.533, tip: "top" },
  { id: "03", x: 76.997, y: 17.826, tip: "top" },
  { id: "04", x: 86.373, y: 29.000, tip: "right" },
  { id: "05", x: 91.362, y: 42.707, tip: "right" },
  { id: "06", x: 91.362, y: 57.293, tip: "right" },
  { id: "07", x: 86.373, y: 71.000, tip: "right" },
  { id: "08", x: 76.997, y: 82.174, tip: "bottom" },
  { id: "09", x: 64.365, y: 89.467, tip: "bottom" },
  { id: "10", x: 50.000, y: 92.000, tip: "bottom" },
  { id: "11", x: 35.635, y: 89.467, tip: "bottom" },
  { id: "12", x: 23.003, y: 82.174, tip: "bottom" },
  { id: "13", x: 13.627, y: 71.000, tip: "left" },
  { id: "14", x: 8.638, y: 57.293, tip: "left" },
  { id: "15", x: 8.638, y: 42.707, tip: "left" },
  { id: "16", x: 13.627, y: 29.000, tip: "left" },
  { id: "17", x: 23.003, y: 17.826, tip: "top" },
  { id: "18", x: 35.635, y: 10.533, tip: "top" },
] as const;

const positionedModules = modules.map((module) => ({
  ...module,
  ...positions.find((p) => p.id === module.id)!,
}));

export function OrbitalNavigator() {
  return (
    <>
      <div className="orbit-panel hidden lg:block">
        <div className="orbit-panel-bg" />

        <div className="absolute left-5 top-5 z-40 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/95 px-3 py-1.5 text-[10px] font-extrabold text-slate-500 shadow-sm">
          <MousePointer2 className="h-3.5 w-3.5 text-emerald-500" />
          360° Module Navigator
        </div>
        <div className="absolute right-5 top-5 z-40 rounded-full border border-slate-200 bg-white/95 px-3 py-1.5 text-[10px] font-extrabold text-slate-400 shadow-sm">
          18 / 18 AVAILABLE
        </div>

        <div className="orbit-stage-responsive">
          <svg className="orbit-svg" viewBox="0 0 100 100" aria-hidden="true">
            <circle cx="50" cy="50" r="42" className="orbit-outer" />
            <circle cx="50" cy="50" r="28" className="orbit-inner" />
            {positionedModules.map((module) => (
              <line key={module.id} x1="50" y1="50" x2={module.x} y2={module.y} className="orbit-spoke" />
            ))}
          </svg>

          <div className="center-hub-responsive">
            <div className="center-emblem-responsive"><Leaf className="h-6 w-6" /></div>
            <div className="text-[clamp(1.9rem,4vw,2.5rem)] font-black leading-none">18</div>
            <div className="mt-2 max-w-[155px] text-[clamp(.55rem,1vw,.68rem)] font-extrabold uppercase leading-4 tracking-[.14em] text-slate-300">
              Sustainability Modules
            </div>
            <div className="mt-2 text-[9px] text-slate-500">Integrated Management System</div>
          </div>

          {positionedModules.map((module) => (
            <div
              key={module.id}
              className={`orbit-node-responsive tip-${module.tip}`}
              style={{ left: `${module.x}%`, top: `${module.y}%`, "--module-color": module.color } as CSSProperties}
            >
              <Link to={`/modules/${module.id}`} className="module-link-responsive" aria-label={`Open module ${module.id}: ${module.title}`}>
                <div className="module-octagon-responsive octagon">
                  <div className="module-octagon-inner octagon" />
                  <div className="module-content-responsive">
                    <ModuleIcon name={module.icon} className="module-icon-responsive" />
                    <span className="module-number-responsive">{module.id}</span>
                  </div>
                </div>

                <div className="module-tooltip">
                  <div className="text-[9px] font-black uppercase tracking-[.14em]" style={{ color: module.color }}>Module {module.id}</div>
                  <div className="mt-1 text-xs font-black leading-5 text-slate-950">{module.title}</div>
                  <div className="mt-1 text-[10px] leading-4 text-slate-500">{module.description}</div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        <div className="absolute bottom-5 left-1/2 z-40 -translate-x-1/2 rounded-full border border-slate-200 bg-white/95 px-4 py-2 text-[10px] text-slate-500 shadow-sm">
          Hover an octagon to view details · Click to open
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:hidden">
        {modules.map((module) => (
          <Link key={module.id} to={`/modules/${module.id}`} className="group flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg">
            <div className="octagon grid h-12 w-12 shrink-0 place-items-center text-white shadow-sm" style={{ background: module.color }}>
              <ModuleIcon name={module.icon} className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <div className="text-[9px] font-extrabold tracking-[0.14em] text-slate-400">MODULE {module.id}</div>
              <div className="mt-1 text-sm font-extrabold leading-5 text-slate-900">{module.title}</div>
              <div className="mt-1.5 text-xs leading-5 text-slate-500">{module.description}</div>
            </div>
            <ArrowUpRight className="ml-auto mt-1 h-4 w-4 shrink-0 text-slate-300 transition group-hover:text-slate-700" />
          </Link>
        ))}
      </div>
    </>
  );
}
