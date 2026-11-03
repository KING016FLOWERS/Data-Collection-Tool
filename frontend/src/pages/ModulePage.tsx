import { ArrowLeft, ClipboardList, Construction, Database, FileCheck2 } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { ModuleIcon } from "../components/ModuleIcon";
import { PageTransition } from "../components/PageTransition";
import { modules } from "../data/modules";

export function ModulePage() {
  const { id } = useParams();
  const module = modules.find((item) => item.id === id);

  if (!module) {
    return <PageTransition><div className="p-8"><h1 className="text-2xl font-extrabold">Module not found</h1><Link to="/dashboard" className="mt-4 inline-block text-emerald-700">Return to dashboard</Link></div></PageTransition>;
  }

  return (
    <PageTransition>
      <section className="px-4 py-7 sm:px-6 xl:px-8">
        <div className="mx-auto max-w-6xl">
          <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 transition hover:text-slate-950"><ArrowLeft className="h-4 w-4" />Back to dashboard</Link>
          <div className="mt-5 overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-soft">
            <div className="relative p-6 sm:p-9">
              <div className="absolute inset-x-0 top-0 h-1.5" style={{ background: module.color }} />
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                <div className="octagon grid h-20 w-20 shrink-0 place-items-center text-white shadow-lg" style={{ background: module.color }}><ModuleIcon name={module.icon} className="h-8 w-8" /></div>
                <div><div className="text-xs font-extrabold uppercase tracking-[.16em]" style={{ color: module.color }}>Module {module.id}</div><h1 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl">{module.title}</h1><p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">{module.description}</p></div>
              </div>
            </div>
            <div className="grid gap-3 border-t border-slate-100 bg-slate-50/60 p-6 sm:grid-cols-3 sm:p-8">
              {[{ icon: ClipboardList, title: "Data Collection", desc: "Module-specific forms and records." }, { icon: Database, title: "Evidence & Metrics", desc: "Persist measurements and supporting data." }, { icon: FileCheck2, title: "Review & Compliance", desc: "Track review status, gaps and actions." }].map(({ icon: Icon, title, desc }) => <div key={title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><Icon className="h-5 w-5" style={{ color: module.color }} /><div className="mt-3 font-extrabold text-slate-900">{title}</div><div className="mt-1 text-xs leading-5 text-slate-500">{desc}</div></div>)}
            </div>
            <div className="flex items-start gap-3 border-t border-slate-100 p-6 text-sm text-slate-500 sm:p-8"><Construction className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" /><p><strong className="text-slate-700">Module workspace scaffold created.</strong> The uploaded files reference separate <code>Module01.jsp</code>–<code>Module18.jsp</code> pages, but those page sources were not included. Add their form/data logic here as each module is migrated.</p></div>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
