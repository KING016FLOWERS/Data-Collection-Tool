import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Layers3,
  Pause,
  Play,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";
import { modules } from "../data/modules";
import { ModuleIcon } from "./ModuleIcon";

const AUTOPLAY_MS = 5200;

const cardThemes: Record<string, { start: string; end: string; edge: string }> = {
  "01": { start: "#f8fafc", end: "#eef2ff", edge: "#cbd5e1" },
  "02": { start: "#ecfeff", end: "#f0f9ff", edge: "#67e8f9" },
  "03": { start: "#f7fee7", end: "#fefce8", edge: "#bef264" },
  "04": { start: "#f0fdfa", end: "#ecfdf5", edge: "#5eead4" },
  "05": { start: "#fffbeb", end: "#fff7ed", edge: "#fcd34d" },
  "06": { start: "#eef2ff", end: "#f5f3ff", edge: "#a5b4fc" },
  "07": { start: "#eff6ff", end: "#ecfeff", edge: "#7dd3fc" },
  "08": { start: "#faf5ff", end: "#fdf4ff", edge: "#d8b4fe" },
  "09": { start: "#f0fdf4", end: "#ecfdf5", edge: "#86efac" },
  "10": { start: "#f0fdfa", end: "#f8fafc", edge: "#99f6e4" },
  "11": { start: "#fff1f2", end: "#fef2f2", edge: "#fda4af" },
  "12": { start: "#fdf2f8", end: "#fff1f2", edge: "#f9a8d4" },
  "13": { start: "#eff6ff", end: "#eef2ff", edge: "#93c5fd" },
  "14": { start: "#fff7ed", end: "#fffbeb", edge: "#fdba74" },
  "15": { start: "#fef3c7", end: "#fff7ed", edge: "#fbbf24" },
  "16": { start: "#ecfdf5", end: "#f0fdfa", edge: "#6ee7b7" },
  "17": { start: "#eef2ff", end: "#faf5ff", edge: "#c4b5fd" },
  "18": { start: "#f0fdfa", end: "#ecfeff", edge: "#5eead4" },
};

function wrappedOffset(index: number, activeIndex: number, length: number) {
  let offset = index - activeIndex;
  if (offset > length / 2) offset -= length;
  if (offset < -length / 2) offset += length;
  return offset;
}

export function ModuleCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  const activeModule = modules[activeIndex];

  const visibleModules = useMemo(
    () =>
      modules
        .map((module, index) => ({
          module,
          index,
          offset: wrappedOffset(index, activeIndex, modules.length),
        }))
        .filter(({ offset }) => Math.abs(offset) <= 2)
        .sort((a, b) => a.offset - b.offset),
    [activeIndex],
  );

  useEffect(() => {
    if (!isPlaying || isHovered) return;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % modules.length);
    }, AUTOPLAY_MS);

    return () => window.clearInterval(timer);
  }, [isPlaying, isHovered]);

  const previous = () => {
    setActiveIndex((current) => (current - 1 + modules.length) % modules.length);
  };

  const next = () => {
    setActiveIndex((current) => (current + 1) % modules.length);
  };

  return (
    <div
      className="module-carousel-shell"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocusCapture={() => setIsHovered(true)}
      onBlurCapture={() => setIsHovered(false)}
    >
      <div className="module-carousel-ambient module-carousel-ambient-one" />
      <div className="module-carousel-ambient module-carousel-ambient-two" />

      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 border-b border-emerald-950/10 px-5 py-4 sm:px-7">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-2xl bg-white text-emerald-700 shadow-sm ring-1 ring-slate-200">
            <Layers3 className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-700">
              Top Management Navigator
            </div>
            <div className="mt-0.5 text-sm font-bold text-slate-600">
              Browse all 18 sustainability modules
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsPlaying((value) => !value)}
            className="carousel-control-button"
            aria-label={isPlaying ? "Pause automatic carousel" : "Play automatic carousel"}
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <div
        className="module-carousel-stage"
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft") previous();
          if (event.key === "ArrowRight") next();
        }}
      >
        <button
          type="button"
          onClick={previous}
          className="module-carousel-arrow module-carousel-arrow-left"
          aria-label="Previous module"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <button
          type="button"
          onClick={next}
          className="module-carousel-arrow module-carousel-arrow-right"
          aria-label="Next module"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        <div className="module-carousel-viewport" tabIndex={0} aria-label="Sustainability module carousel">
          <AnimatePresence initial={false} mode="popLayout">
            {visibleModules.map(({ module, index, offset }) => {
              const isActive = offset === 0;
              const isNear = Math.abs(offset) === 1;

              return (
                <motion.div
                  key={module.id}
                  role="button"
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => setActiveIndex(index)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      setActiveIndex(index);
                    }
                  }}
                  className={`module-carousel-card ${isActive ? "is-active" : ""}`}
                  style={{
                    "--module-color": module.color,
                    "--module-bg-start": cardThemes[module.id].start,
                    "--module-bg-end": cardThemes[module.id].end,
                    "--module-edge": cardThemes[module.id].edge,
                    zIndex: 30 - Math.abs(offset),
                  } as CSSProperties}
                  initial={{ opacity: 0, scale: 0.78 }}
                  animate={{
                    x: `${-50 + offset * 72}%`,
                    y: "-50%",
                    scale: isActive ? 1 : isNear ? 0.82 : 0.66,
                    opacity: isActive ? 1 : isNear ? 0.72 : 0.22,
                    rotateY: isActive ? 0 : offset < 0 ? 12 : -12,
                    filter: isActive ? "blur(0px)" : isNear ? "blur(0px)" : "blur(1px)",
                  }}
                  exit={{ opacity: 0, scale: 0.7 }}
                  transition={{ type: "spring", stiffness: 260, damping: 28, mass: 0.82 }}
                  aria-label={`Select module ${module.id}: ${module.title}`}
                >
                  <div className="module-card-glow" />

                  <div className="relative z-10 flex h-full flex-col text-left">
                    <div className="flex items-center gap-4">
                      <div
                        className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl text-white shadow-lg"
                        style={{ background: module.color, boxShadow: `0 14px 32px ${module.color}32` }}
                      >
                        <ModuleIcon name={module.icon} className="h-6 w-6" />
                      </div>

                      <div className="module-serial-badge">
                        <span className="module-serial-label">Module</span>
                        <span className="module-serial-number">{module.id}</span>
                      </div>
                    </div>

                    <div className="mt-7">
                      <div
                        className="mb-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.15em]"
                        style={{ background: `${module.color}12`, color: module.color }}
                      >
                        <Sparkles className="h-3 w-3" /> Sustainability workspace
                      </div>
                      <h2 className="max-w-[440px] text-[clamp(1.25rem,2.15vw,1.8rem)] font-black leading-[1.18] tracking-tight text-slate-900">
                        {module.title}
                      </h2>
                      <p className="mt-3 max-w-[460px] text-sm leading-6 text-slate-600">
                        {module.description}
                      </p>
                    </div>

                    <div className="mt-auto flex items-center justify-end pt-7">
                      {isActive && (
                        <Link
                          to={`/modules/${module.id}`}
                          onClick={(event) => event.stopPropagation()}
                          className="group inline-flex shrink-0 items-center gap-2 rounded-2xl border border-emerald-950/10 bg-white/90 px-4 py-3 text-xs font-extrabold text-slate-700 shadow-md backdrop-blur transition duration-300 hover:-translate-y-0.5 hover:border-emerald-200 hover:bg-white hover:text-emerald-900 hover:shadow-lg"
                        >
                          Open module
                          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                        </Link>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      <div className="relative z-10 border-t border-emerald-950/10 px-4 pb-5 pt-4 sm:px-6">
        <div className="module-carousel-rail" role="tablist" aria-label="Choose module">
          {modules.map((module, index) => {
            const selected = index === activeIndex;
            return (
              <button
                type="button"
                key={module.id}
                onClick={() => setActiveIndex(index)}
                className={`module-carousel-rail-item ${selected ? "is-selected" : ""}`}
                style={{ "--module-color": module.color } as CSSProperties}
                role="tab"
                aria-selected={selected}
                aria-label={`Module ${module.id}: ${module.title}`}
              >
                <span className="module-carousel-rail-icon">
                  <ModuleIcon name={module.icon} className="h-4 w-4" />
                </span>
                <span className="hidden min-w-0 sm:block">
                  <span className="block text-[8px] font-black uppercase tracking-[0.15em] text-slate-500">
                    No. {module.id}
                  </span>
                  <span className="mt-0.5 block max-w-[150px] truncate text-[10px] font-bold text-slate-600">
                    {module.title}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-4 flex flex-col items-center justify-between gap-3 sm:flex-row">
          <button
            type="button"
            onClick={previous}
            className="inline-flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.14em] text-slate-500 transition hover:text-emerald-900"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Previous
          </button>

          <div className="flex items-center gap-1.5" aria-hidden="true">
            {modules.map((module, index) => (
              <span
                key={module.id}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  index === activeIndex ? "w-7" : "w-1.5 bg-slate-300"
                }`}
                style={index === activeIndex ? { background: activeModule.color } : undefined}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={next}
            className="inline-flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.14em] text-slate-500 transition hover:text-emerald-900"
          >
            Next <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
