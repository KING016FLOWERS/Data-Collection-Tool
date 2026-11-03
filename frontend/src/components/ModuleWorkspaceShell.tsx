import { FileText, Layers3 } from "lucide-react";
import { modules } from "../data/modules";
import { ModuleIcon } from "./ModuleIcon";
import { PageTransition } from "./PageTransition";

type ModuleWorkspaceShellProps = {
  moduleId: string;
};

export function ModuleWorkspaceShell({ moduleId }: ModuleWorkspaceShellProps) {
  const module = modules.find((item) => item.id === moduleId);

  if (!module) {
    return null;
  }

  return (
    <PageTransition>
      <section className="page-canvas relative min-h-full overflow-hidden px-4 py-5 sm:px-6 lg:py-6 xl:px-8">
        <div className="page-orb page-orb-one" />
        <div className="page-orb page-orb-two" />

        <div className="relative mx-auto w-full max-w-[1500px]">
          <div className="page-heading-panel mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex min-w-0 items-center gap-4">
              <div
                className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl text-white shadow-lg"
                style={{ backgroundColor: module.color, boxShadow: `0 14px 32px ${module.color}28` }}
              >
                <ModuleIcon name={module.icon} className="h-6 w-6" />
              </div>
              <div className="min-w-0">
                <div className="section-kicker w-fit">
                  <Layers3 className="h-3.5 w-3.5" /> Module {module.id}
                </div>
                <h1 className="mt-2 truncate text-xl font-black tracking-[-0.02em] text-slate-950 sm:text-2xl">
                  {module.title}
                </h1>
              </div>
            </div>
            <p className="max-w-xl text-sm leading-6 text-slate-500 md:text-right">{module.description}</p>
          </div>

          <main className="theme-panel p-5 sm:p-7 lg:p-9">
            <div className="module-placeholder flex min-h-[520px] items-center justify-center px-6 py-12 text-center">
              <div className="max-w-xl">
                <div
                  className="mx-auto grid h-16 w-16 place-items-center rounded-[20px] text-white shadow-xl"
                  style={{ backgroundColor: module.color, boxShadow: `0 18px 38px ${module.color}30` }}
                >
                  <ModuleIcon name={module.icon} className="h-8 w-8" />
                </div>
                <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-emerald-800 ring-1 ring-emerald-100">
                  <FileText className="h-3.5 w-3.5" /> Dedicated workspace
                </div>
                <h2 className="mt-4 text-xl font-black text-slate-900">{module.title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  This department page is ready for the module-specific forms, tables, dashboards, documents, charts and workflow content you provide next.
                </p>
              </div>
            </div>
          </main>
        </div>
      </section>
    </PageTransition>
  );
}
