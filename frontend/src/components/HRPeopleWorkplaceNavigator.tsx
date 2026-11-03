import { useEffect, useMemo, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ArrowLeft, ArrowRight, Award, BookOpen,
  BookOpenCheck, Building2, ChartNoAxesCombined,
  ChevronRight, ClipboardList, Clock3, FilePenLine, HardHat,
  HeartHandshake, LayoutGrid, LockKeyhole, MessageCircle,
  MessageSquare, Scale, ShieldCheck, UserPlus,
  UsersRound, Wallet, LogOut, Handshake,
  FileText, CalendarClock, Paperclip
} from "lucide-react";
import { hrPeopleSections, type HRField } from "../data/hrPeopleWorkplace";

const icons = {
  users: UsersRound,
  book: BookOpenCheck,
  scale: Scale,
  userplus: UserPlus,
  file: FileText,
  shield: ShieldCheck,
  clock: Clock3,
  wallet: Wallet,
  heart: HeartHandshake,
  message: MessageSquare,
  alert: MessageCircle,
  award: Award,
  bookopen: BookOpen,
  building: Building2,
  hardhat: HardHat,
  logout: LogOut,
  lock: LockKeyhole,
  chart: ChartNoAxesCombined,
  handshake: Handshake,
};

const colors: Record<string, { accent: string; pale: string; border: string }> = {
  sky: { accent: "#1570b2", pale: "#eaf5fc", border: "#b9e0f5" },
  emerald: { accent: "#147b5c", pale: "#eaf7f0", border: "#bfead5" },
  amber: { accent: "#a96b16", pale: "#fff7e8", border: "#f6deae" },
  cyan: { accent: "#087d99", pale: "#e9f8fb", border: "#b6e6ef" },
  indigo: { accent: "#525bbb", pale: "#f0f2ff", border: "#d6d9fa" },
  rose: { accent: "#b84663", pale: "#fff0f3", border: "#f3c7d1" },
  orange: { accent: "#b56b29", pale: "#fff4e8", border: "#f9d5ad" },
  violet: { accent: "#8153b0", pale: "#f6f0fe", border: "#e6d3f7" },
  pink: { accent: "#ae488f", pale: "#fff2f9", border: "#f7cce7" },
  teal: { accent: "#0b8179", pale: "#ecfaf7", border: "#b6e8df" },
  blue: { accent: "#345eaf", pale: "#eef4fe", border: "#cedefa" },
  lime: { accent: "#667e22", pale: "#f5f9e8", border: "#e0ecc0" },
  slate: { accent: "#56677d", pale: "#f2f5f9", border: "#dbe3ed" },
  plum: { accent: "#84466e", pale: "#f9f0f7", border: "#edd5e6" },
  gold: { accent: "#96710c", pale: "#fffbea", border: "#f4e3b6" },
  coral: { accent: "#b7573e", pale: "#fff3ee", border: "#f5d1c6" },
};

const requirementNames: Record<HRField["requirement"], string> = {
  M: "Mandatory", C: "Conditional", O: "Optional"
};

function RiskTag({ risk }: { risk: HRField["risk"] }) {
  const classes = {
    Critical: "border-red-200 bg-red-50 text-red-700",
    Major: "border-amber-200 bg-amber-50 text-amber-800",
    Standard: "border-slate-200 bg-slate-50 text-slate-600",
  }[risk];
  return <span className={`inline-flex rounded-lg border px-2 py-1 text-[10px] font-bold ${classes}`}>{risk} risk</span>;
}

export function HRPeopleWorkplaceNavigator() {
  const [searchParams] = useSearchParams();
  const selectedSlug = (searchParams.get("section") || "A").toUpperCase();
  const currentSection = useMemo(
    () => hrPeopleSections.find((section) => section.slug === selectedSlug) ?? hrPeopleSections[0],
    [selectedSlug]
  );
  const scrollContainer = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Record<string, HTMLAnchorElement | null>>({});

  useEffect(() => {
    // Keep the selected tab in view without moving the main document.
    const track = scrollContainer.current;
    const button = itemRefs.current[currentSection.slug];
    if (!track || !button) return;
    const left = button.offsetLeft - track.offsetLeft - 16;
    const right = left + button.offsetWidth;
    if (left < track.scrollLeft || right > track.scrollLeft + track.clientWidth) {
      track.scrollTo({ left: Math.max(0, left - 12), behavior: "smooth" });
    }
  }, [currentSection.slug]);

  const scroll = (direction: number) => scrollContainer.current?.scrollBy({ left: direction * 520, behavior: "smooth" });
  const Icon = icons[currentSection.icon as keyof typeof icons] ?? ClipboardList;
  const theme = colors[currentSection.theme] ?? colors.emerald;
  const total = hrPeopleSections.reduce((sum, section) => sum + section.fields.length, 0);

  return <div className="space-y-5">
    <section className="overflow-hidden rounded-[24px] border border-[#dbeae4] bg-white shadow-[0_16px_50px_rgba(8,62,48,.07)]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e5efe9] bg-gradient-to-r from-white via-[#f6fbf8] to-[#edf8f5] px-5 py-4 sm:px-7">
        <div className="flex min-w-0 items-center gap-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#def2e7] text-[#14785a]"><LayoutGrid className="h-5 w-5" /></div>
          <div>
            <h2 className="text-base font-black text-[#153e34]">People & Workplace Submodules</h2>
            <p className="mt-0.5 text-xs text-[#718479]">16 official domains from the Common Evidence Database • Sections A–P</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full border border-[#cce8d9] bg-white px-3 py-1.5 text-[11px] font-extrabold text-[#126d50]">16 sections</span>
          <span className="hidden rounded-full border border-[#dee9e2] bg-white px-3 py-1.5 text-[11px] font-semibold text-[#60786b] sm:inline-flex">{total} data fields</span>
          <button aria-label="Scroll sections left" type="button" onClick={() => scroll(-1)} className="grid h-9 w-9 place-items-center rounded-xl border border-[#d7e7df] bg-white text-[#195d4b] shadow-sm transition hover:border-[#91c2af] hover:bg-emerald-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"><ArrowLeft className="h-4 w-4" /></button>
          <button aria-label="Scroll sections right" type="button" onClick={() => scroll(1)} className="grid h-9 w-9 place-items-center rounded-xl border border-[#d7e7df] bg-white text-[#195d4b] shadow-sm transition hover:border-[#91c2af] hover:bg-emerald-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"><ArrowRight className="h-4 w-4" /></button>
        </div>
      </div>
      <div className="relative px-3 py-4 sm:px-5">
        <div aria-hidden="true" className="pointer-events-none absolute bottom-2 right-0 top-2 z-10 w-8 bg-gradient-to-l from-white to-transparent" />
        <nav ref={scrollContainer} aria-label="Human Resources sixteen A to P submodules" className="hr-submodule-track flex gap-2.5 overflow-x-auto overflow-y-hidden pb-3 pt-1 scroll-smooth">
          {hrPeopleSections.map((section) => {
            const active = currentSection.slug === section.slug;
            const tint = colors[section.theme] ?? colors.emerald;
            const TabIcon = icons[section.icon as keyof typeof icons] ?? ClipboardList;
            return <Link
              key={section.id}
              ref={(node) => { itemRefs.current[section.slug] = node; }}
              to={{ pathname: "/user/modules/12", search: `?section=${section.slug}` }}
              aria-current={active ? "page" : undefined}
              title={`Section ${section.id}: ${section.title}`}
              className={`hr-submodule-tab group relative flex min-h-[88px] w-[258px] shrink-0 items-start gap-3 rounded-[17px] border px-3.5 py-3 text-left outline-offset-2 transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-600 sm:w-[282px] ${active ? "shadow-[0_10px_25px_rgba(4,63,47,.16)]" : "hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(4,63,47,.1)]"}`}
              style={active ? { background: "linear-gradient(120deg,#0c5648,#0a7662)", borderColor: "#0b6555", color: "white" } : { background: tint.pale, borderColor: tint.border, color: "#193e38" }}
            >
              <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${active ? "bg-white/15 text-[#fbe5bd]" : "bg-white/80"}`} style={!active ? { color: tint.accent } : undefined}><TabIcon className="h-5 w-5" /></span>
              <span className="min-w-0 flex-1">
                <span className={`mb-1 flex items-center justify-between gap-2 text-[9px] font-extrabold uppercase tracking-[.12em] ${active ? "text-emerald-100" : "opacity-70"}`}>
                  <span>SECTION {section.id}</span><span>{section.fields.length} fields</span>
                </span>
                <span className="block text-[11px] font-extrabold leading-[1.38] sm:text-xs">{section.title}</span>
              </span>
              {active && <span className="absolute -bottom-[1px] left-4 right-4 h-1 rounded-full bg-[#f2d7a0]" />}
            </Link>;
          })}
        </nav>
        <p className="mt-1 flex items-center gap-1.5 text-[10px] font-semibold text-[#86988c]"><ChevronRight className="h-3 w-3" /> Swipe sideways or use the arrows to view Sections A–P</p>
      </div>
    </section>

    <section className="overflow-hidden rounded-[24px] border border-[#dbeae4] bg-white shadow-[0_14px_42px_rgba(8,62,48,.055)]">
      <header className="flex flex-wrap items-start justify-between gap-4 border-b border-[#e9f0ec] bg-gradient-to-r from-white via-white to-[#f6faf8] px-5 py-6 sm:px-8">
        <div className="flex min-w-0 items-start gap-4">
          <span className="grid h-[55px] w-[55px] shrink-0 place-items-center rounded-[17px]" style={{ background: theme.pale, color: theme.accent, border: `1px solid ${theme.border}` }}><Icon className="h-7 w-7" /></span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 text-[10px] font-extrabold uppercase tracking-[.13em] text-[#568575]">HR • People & Workplace <ChevronRight className="h-3 w-3" /> Section {currentSection.id} of P</div>
            <h2 className="mt-2 text-xl font-black leading-tight tracking-tight text-[#173c33] sm:text-2xl">{currentSection.title}</h2>
            <p className="mt-1 text-[13px] leading-5 text-[#70837a]">{currentSection.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-[#d8eade] bg-[#f5fbf7] px-3 py-2 text-[11px] font-bold text-[#31745c]"><BookOpen className="h-4 w-4" /> {currentSection.fields.length} evidence fields</div>
      </header>

      <div className="p-5 sm:p-8">
        <div className="space-y-3">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-black text-[#234a3e]">Master data field preview</h3>
              <p className="mt-1 text-xs text-slate-500">Permanent field IDs and required evidence from People & Workplace, version 1.0 • Read only</p>
            </div>
          </div>
          {currentSection.fields.map((field) => <article key={field.id} className="group rounded-2xl border border-[#e3eee7] bg-[#fcfefd] p-4 transition-colors hover:border-[#b9dbca] hover:bg-[#f6fbf8]">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <span className="inline-flex items-center rounded-lg bg-[#e8f6ef] px-2.5 py-1.5 text-[11px] font-black tracking-wide text-[#137455]">{field.id}</span>
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="rounded-lg border border-[#dae8df] bg-white px-2 py-1 text-[10px] font-semibold text-[#496e5b]">{requirementNames[field.requirement]}</span>
                <RiskTag risk={field.risk} />
              </div>
            </div>
            <p className="mt-3 text-[13px] font-semibold leading-[1.6] text-[#254138]">{field.question}</p>
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-[10px] font-medium text-[#73867b]">
              <span className="inline-flex items-center gap-1.5"><FilePenLine className="h-3.5 w-3.5" />{field.inputType}</span>
              <span className="inline-flex items-center gap-1.5"><CalendarClock className="h-3.5 w-3.5" />{field.frequency}</span>
              <span className="inline-flex items-center gap-1.5"><LockKeyhole className="h-3.5 w-3.5" />{field.privacy}</span>
            </div>
            {field.evidence && <div className="mt-3 flex items-start gap-2 rounded-xl border border-[#e8eee8] bg-[#f6faf8] px-3 py-2 text-[11px] leading-5 text-[#557365]"><Paperclip className="mt-0.5 h-3.5 w-3.5 shrink-0" /><span><span className="font-bold">Evidence:</span> {field.evidence}</span></div>}
          </article>)}
        </div>
      </div>
    </section>
  </div>;
}
