import type { ReactNode } from "react";
import { ArrowUpRight, ClipboardList, FilePenLine, LayoutGrid, LockKeyhole, Sparkles } from "lucide-react";
import { modules } from "../data/modules";
import { useAuth } from "../auth/AuthContext";
import { ModuleIcon } from "./ModuleIcon";
import { PageTransition } from "./PageTransition";

/**
 * Shared presentation layer exclusively for departmental user modules.
 * Each user module is independently routed and may supply its own submodules
 * with children. Management ModuleXXPage files do not use this shell.
 */
export function UserModuleWorkspaceShell({
  moduleId,
  children,
}: {
  moduleId: string;
  children?: ReactNode;
}) {
  const { session } = useAuth();
  const module = modules.find((item) => item.id === moduleId);
  if (!module || session?.role !== "department" || session.moduleId !== moduleId) return null;

  return (
    <PageTransition>
      <section className="min-h-full bg-gradient-to-br from-[#f2f8f5] via-[#fcfefd] to-[#eaf4f3] px-3 pb-9 pt-5 sm:px-6 lg:px-9">
        <div className="mx-auto max-w-[1480px] space-y-5">
          <header className="relative overflow-hidden rounded-[26px] bg-gradient-to-r from-[#082f2c] via-[#0b574b] to-[#0d7165] px-5 py-6 text-white shadow-[0_18px_48px_rgba(8,65,52,.15)] sm:px-8 sm:py-7">
            <div className="pointer-events-none absolute -right-14 -top-28 h-72 w-72 rounded-full border-[36px] border-white/[0.065]" />
            <div className="pointer-events-none absolute -bottom-24 right-32 h-44 w-44 rounded-full bg-teal-200/10 blur-3xl" />
            <div className="relative flex flex-wrap items-center justify-between gap-5">
              <div className="flex min-w-0 items-start gap-4">
                <div className="grid h-[58px] w-[58px] shrink-0 place-items-center rounded-[18px] bg-white/15 shadow-[inset_0_1px_0_rgba(255,255,255,.3)] ring-1 ring-white/25 backdrop-blur-md">
                  <ModuleIcon name={module.icon} className="h-7 w-7 text-[#f0d6a5]" />
                </div>
                <div className="min-w-0">
                  <div className="mb-2 flex flex-wrap items-center gap-2 text-[10px] font-bold uppercase tracking-[.18em] text-[#d6f1e8]">
                    <span>Department workspace</span>
                    <span className="h-1 w-1 rounded-full bg-[#f5dba2]" />
                    <span>Module {module.id}</span>
                  </div>
                  <h1 className="max-w-[900px] text-[23px] font-extrabold leading-tight tracking-tight sm:text-[29px]">{module.title}</h1>
                  <p className="mt-2 max-w-[760px] text-[13px] leading-6 text-[#dcf4eb]">{module.description}</p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-2 text-[11px] font-bold text-white/95 backdrop-blur">
                <LockKeyhole className="h-3.5 w-3.5 text-[#ecd39e]" />
                Department access
              </div>
            </div>
          </header>

          {children ?? <div className="overflow-hidden rounded-[24px] border border-[#ddece5] bg-white shadow-[0_14px_45px_rgba(9,60,46,.055)]">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e7f0eb] bg-gradient-to-r from-white to-[#f5faf7] px-5 py-5 sm:px-7">
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#e8f6ee] text-[#117254]"><LayoutGrid className="h-5 w-5" /></span>
                <div>
                  <h2 className="text-base font-extrabold text-[#173c34]">Department sections</h2>
                  <p className="mt-0.5 text-xs text-slate-500">A dedicated place for the forthcoming submodules</p>
                </div>
              </div>
              <span className="rounded-full border border-[#d7e7df] bg-white px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[.1em] text-[#508371]">Ready to configure</span>
            </div>
            <div className="grid gap-4 p-5 sm:grid-cols-3 sm:p-7">
              {[
                { icon: ClipboardList, title: "Section navigation", text: "Submodule buttons can be configured for this department." },
                { icon: FilePenLine, title: "Data-entry forms", text: "Future questionnaires and structured fields will open here." },
                { icon: Sparkles, title: "Evidence workflow", text: "Document handling and validation can be added per section." },
              ].map(({ icon: Icon, title, text }) => (
                <div key={title} className="relative rounded-2xl border border-[#e0ece5] bg-[#f8fbf9] p-5">
                  <Icon className="mb-4 h-6 w-6 text-[#167e62]" />
                  <h3 className="text-sm font-extrabold text-[#21493f]">{title}</h3>
                  <p className="mt-2 text-xs leading-5 text-slate-500">{text}</p>
                  <ArrowUpRight className="absolute right-4 top-4 h-4 w-4 text-[#abc9bb]" />
                </div>
              ))}
            </div>
          </div>}
        </div>
      </section>
    </PageTransition>
  );
}
