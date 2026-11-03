import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { adminApi, apiErrorMessage, type TopManagementRegistration } from "../services/api";
import {
  Building2, CheckCheck, Clock3, Filter, LayoutGrid, List,
  LogOut, Mail, MapPin, RefreshCw, Search, ShieldCheck, UserRound, XCircle, Trash2, AlertTriangle, UsersRound,
} from "lucide-react";

type StatusFilter = "All" | TopManagementRegistration["status"];
type ViewMode = "table" | "grid";

const STATUS_STYLES: Record<TopManagementRegistration["status"], string> = {
  Pending: "bg-amber-100 text-amber-800 ring-amber-200",
  Approved: "bg-emerald-100 text-emerald-800 ring-emerald-200",
  Rejected: "bg-rose-100 text-rose-800 ring-rose-200",
};

function StatusPill({ status }: { status: TopManagementRegistration["status"] }) {
  const Icon = status === "Pending" ? Clock3 : status === "Approved" ? CheckCheck : XCircle;
  return (
    <span className={`inline-flex items-center justify-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-extrabold ring-1 ${STATUS_STYLES[status]}`}>
      <Icon className="h-3.5 w-3.5" />{status}
    </span>
  );
}

/** Main Admin's approvals are isolated from Top Management and Department User pages. */
export function MainAdminPage() {
  const { session, logout } = useAuth();
  const [registrations, setRegistrations] = useState<TopManagementRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [view, setView] = useState<ViewMode>("table");
  const [filter, setFilter] = useState<StatusFilter>("All");
  const [search, setSearch] = useState("");
  const [deleting, setDeleting] = useState<TopManagementRegistration | null>(null);
  const [typedIndustry, setTypedIndustry] = useState("");
  const [deleteError, setDeleteError] = useState("");

  async function load() {
    setLoading(true);
    try {
      setRegistrations(await adminApi.registrations());
      setError("");
    } catch (reason) {
      setError(apiErrorMessage(reason));
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => { void load(); }, []);

  const counts = useMemo(() => ({
    total: registrations.length,
    pending: registrations.filter(r => r.status === "Pending").length,
    approved: registrations.filter(r => r.status === "Approved").length,
    rejected: registrations.filter(r => r.status === "Rejected").length,
  }), [registrations]);

  const filtered = useMemo(() => {
    const term = search.trim().toLocaleLowerCase();
    return registrations.filter(reg =>
      (filter === "All" || reg.status === filter) &&
      (!term || [reg.userId, reg.industry, reg.email ?? "", reg.address, reg.role]
        .some(value => value.toLocaleLowerCase().includes(term)))
    );
  }, [registrations, search, filter]);

  async function setStatus(registration: TopManagementRegistration, status: "Approved" | "Rejected") {
    if (!window.confirm(`${status === "Approved" ? "Approve" : "Reject"} ${registration.userId} (${registration.industry})?`)) return;
    setBusy(registration.userId);
    setError("");
    setMessage("");
    try {
      const result = await adminApi.setStatus(registration.userId, status);
      setMessage(result.message);
      await load();
    } catch (reason) {
      setError(apiErrorMessage(reason));
    } finally {
      setBusy("");
    }
  }

  async function deleteRegistration() {
    if (!deleting || typedIndustry.trim() !== deleting.industry || busy) return;
    const record = deleting;
    setBusy(record.userId); setError(""); setDeleteError(""); setMessage("");
    try {
      const result = await adminApi.remove(record.userId, record.industry);
      setDeleting(null); setTypedIndustry(""); setMessage(result.message);
      await load();
    } catch (reason) { setDeleteError(apiErrorMessage(reason)); }
    finally { setBusy(""); }
  }

  function renderActions(registration: TopManagementRegistration) {
    return (
      <div className="flex flex-wrap items-center justify-center gap-2">
        <button type="button" disabled={Boolean(busy) || registration.status === "Approved"}
          onClick={() => void setStatus(registration, "Approved")}
          className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-extrabold text-white shadow-sm transition hover:bg-emerald-700 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 disabled:cursor-not-allowed disabled:opacity-35">
          <CheckCheck className="h-3.5 w-3.5" /> Approve
        </button>
        <button type="button" disabled={Boolean(busy) || registration.status === "Rejected"}
          onClick={() => void setStatus(registration, "Rejected")}
          className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-rose-50 px-3.5 py-2 text-xs font-extrabold text-rose-700 ring-1 ring-rose-200 transition hover:bg-rose-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600 disabled:cursor-not-allowed disabled:opacity-35">
          <XCircle className="h-3.5 w-3.5" /> Reject
        </button>
        <button type="button" disabled={Boolean(busy)}
          onClick={() => { setDeleting(registration); setTypedIndustry(""); setDeleteError(""); setError(""); }}
          aria-label={`Delete ${registration.userId} and ${registration.departmentUserCount} department users`}
          className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-rose-200 bg-white px-3.5 py-2 text-xs font-extrabold text-rose-700 shadow-sm transition hover:border-rose-400 hover:bg-rose-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600 disabled:cursor-not-allowed disabled:opacity-40">
          <Trash2 className="h-3.5 w-3.5" /> Delete
        </button>
      </div>
    );
  }

  const statistics = [
    { title: "Total Registrations", count: counts.total, icon: Building2, gradient: "from-indigo-600 via-blue-600 to-sky-600", accent: "text-blue-100" },
    { title: "Pending Approval", count: counts.pending, icon: Clock3, gradient: "from-amber-500 via-orange-500 to-orange-600", accent: "text-amber-100" },
    { title: "Approved Industries", count: counts.approved, icon: CheckCheck, gradient: "from-emerald-600 via-teal-600 to-cyan-700", accent: "text-emerald-100" },
    { title: "Rejected Requests", count: counts.rejected, icon: XCircle, gradient: "from-rose-600 via-red-600 to-rose-700", accent: "text-rose-100" },
  ];

  return (
    <main className="page-canvas min-h-[calc(100vh-134px)] px-4 py-7 sm:px-8">
      <div className="mx-auto max-w-[1500px] space-y-6">
        <header className="relative overflow-hidden rounded-[28px] bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-800 p-6 text-white shadow-[0_20px_55px_rgba(3,61,48,.20)] sm:p-8">
          <div aria-hidden="true" className="pointer-events-none absolute -right-10 -top-24 h-64 w-64 rounded-full border-[36px] border-white/5" />
          <div className="relative flex flex-wrap items-center justify-between gap-5">
            <div>
              <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-[.18em] text-emerald-200"><ShieldCheck className="h-4 w-4" /> Main Administration</div>
              <h1 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">Top Management Approvals</h1>
              <p className="mt-2 max-w-2xl text-sm text-emerald-100/80">Review registered industries, verify contact details and manage account approvals.</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="rounded-xl border border-white/15 bg-white/10 px-4 py-2 text-center backdrop-blur-sm"><p className="text-[10px] uppercase tracking-widest text-emerald-100/75">Signed in as</p><p className="text-sm font-bold">{session?.userId}</p></div>
              <button type="button" onClick={() => void logout()} className="inline-flex items-center gap-2 rounded-xl bg-white/15 px-4 py-3 text-sm font-bold transition hover:bg-white/25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"><LogOut className="h-4 w-4" /> Sign out</button>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
          {statistics.map(item => <div key={item.title} className={`group relative overflow-hidden rounded-[22px] bg-gradient-to-br ${item.gradient} p-4 text-white shadow-[0_12px_28px_rgba(23,56,55,.14)] transition duration-200 hover:-translate-y-1 hover:shadow-xl sm:p-5`}>
            <div aria-hidden="true" className="pointer-events-none absolute -right-7 -top-8 h-32 w-32 rounded-full bg-white/10 transition-transform group-hover:scale-125" />
            <div className="relative flex items-center justify-between"><span className={`text-xs font-extrabold tracking-wide ${item.accent}`}>{item.title}</span><span className="rounded-xl bg-white/15 p-2"><item.icon className="h-5 w-5" /></span></div>
            <p className="relative mt-3 text-3xl font-black tabular-nums sm:text-4xl">{item.count}</p>
            <div className="relative mt-3 h-1 w-16 rounded-full bg-white/30" />
          </div>)}
        </div>

        <section className="overflow-hidden rounded-[26px] border border-emerald-900/10 bg-white shadow-[0_16px_50px_rgba(28,57,49,.09)]">
          <div className="space-y-4 border-b border-slate-100 px-4 py-5 sm:px-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div><h2 className="flex items-center gap-2 text-xl font-black text-slate-900"><Building2 className="h-5 w-5 text-emerald-700" /> Registered Industries</h2><p className="mt-1 text-xs text-slate-500">Showing {filtered.length} of {registrations.length} registrations</p></div>
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex rounded-xl border border-slate-200 bg-slate-50 p-1" role="group" aria-label="Registration display mode">
                  <button type="button" aria-pressed={view === "table"} onClick={() => setView("table")} className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-extrabold transition ${view === "table" ? "bg-emerald-700 text-white shadow-sm" : "text-slate-600 hover:bg-white"}`}><List className="h-4 w-4" /> Table</button>
                  <button type="button" aria-pressed={view === "grid"} onClick={() => setView("grid")} className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-extrabold transition ${view === "grid" ? "bg-emerald-700 text-white shadow-sm" : "text-slate-600 hover:bg-white"}`}><LayoutGrid className="h-4 w-4" /> Grid</button>
                </div>
                <button type="button" disabled={loading} onClick={() => void load()} className="inline-flex items-center gap-2 rounded-xl bg-emerald-50 px-3.5 py-2.5 text-xs font-extrabold text-emerald-800 ring-1 ring-emerald-100 transition hover:bg-emerald-100 disabled:opacity-50"><RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Refresh</button>
              </div>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <label className="relative flex-1"><span className="sr-only">Search registrations</span><Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input type="search" value={search} onChange={event => setSearch(event.target.value)} placeholder="Search by User ID, industry, email or address…" className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/15" /></label>
              <label className="relative"><span className="sr-only">Filter by status</span><Filter className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><select value={filter} onChange={event => setFilter(event.target.value as StatusFilter)} className="w-full min-w-[180px] appearance-none rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-8 text-sm font-semibold text-slate-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15 sm:w-auto"><option value="All">All statuses</option><option value="Pending">Pending</option><option value="Approved">Approved</option><option value="Rejected">Rejected</option></select></label>
            </div>
          </div>

          {error && <p role="alert" className="mx-5 mt-4 rounded-xl bg-rose-50 p-3 text-sm font-medium text-rose-700">{error}</p>}
          {message && <p role="status" className="mx-5 mt-4 rounded-xl bg-emerald-50 p-3 text-sm font-medium text-emerald-800">{message}</p>}

          {loading ? <p className="px-5 py-16 text-center text-sm text-slate-500">Loading registrations…</p> : !filtered.length ? <div className="grid place-items-center gap-2 px-5 py-16 text-center"><Search className="h-8 w-8 text-slate-300" /><p className="font-bold text-slate-700">No matching registrations</p><p className="text-xs text-slate-500">Try a different search or status filter.</p></div> : view === "table" ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1260px] border-collapse text-center text-sm">
                <thead className="bg-gradient-to-r from-emerald-900 to-teal-800 text-white"><tr>{["User ID", "Industry", "Email Address", "Address", "Role", "Status", "Dept Users", "Actions"].map(h => <th scope="col" key={h} className="border-r border-white/10 px-4 py-4 text-center text-xs font-extrabold uppercase tracking-wide last:border-0">{h}</th>)}</tr></thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((registration, index) => <tr key={registration.userId} className={`transition hover:bg-emerald-50/80 ${index % 2 ? "bg-slate-50/75" : "bg-white"}`}>
                    <td className="px-4 py-5 text-center"><span className="inline-flex rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-extrabold text-indigo-700 ring-1 ring-indigo-100">{registration.userId}</span></td>
                    <td className="max-w-[215px] break-words px-4 py-5 text-center font-bold text-slate-900">{registration.industry}</td>
                    <td className="max-w-[230px] break-all px-4 py-5 text-center"><span className="inline-flex items-center justify-center gap-1.5 text-xs text-emerald-800"><Mail className="h-3.5 w-3.5 shrink-0" />{registration.email ?? "Not provided"}</span></td>
                    <td className="max-w-[260px] whitespace-normal break-words px-4 py-5 text-center text-xs leading-5 text-slate-600">{registration.address}</td>
                    <td className="px-4 py-5 text-center"><span className="inline-flex rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">{registration.role}</span></td>
                    <td className="px-4 py-5 text-center"><StatusPill status={registration.status} /></td>
                    <td className="px-4 py-5 text-center"><span className="inline-flex items-center gap-1 rounded-xl bg-indigo-50 px-3 py-1.5 text-xs font-extrabold text-indigo-700"><UsersRound className="h-3.5 w-3.5" />{registration.departmentUserCount}</span></td>
                    <td className="px-4 py-5 text-center">{renderActions(registration)}</td>
                  </tr>)}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 bg-slate-50/65 p-4 md:grid-cols-2 xl:grid-cols-3 sm:p-6">
              {filtered.map(registration => <article key={registration.userId} className="group relative flex min-w-0 flex-col overflow-hidden rounded-[23px] border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl">
                <div className={`h-1.5 ${registration.status === "Approved" ? "bg-gradient-to-r from-emerald-500 to-teal-500" : registration.status === "Rejected" ? "bg-gradient-to-r from-rose-500 to-red-500" : "bg-gradient-to-r from-amber-400 to-orange-500"}`} />
                <div className="flex-1 p-5">
                  <div className="flex items-start justify-between gap-3"><span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-emerald-700 to-teal-700 text-white shadow-md"><Building2 className="h-6 w-6" /></span><StatusPill status={registration.status} /></div>
                  <h3 className="mt-4 min-h-[3rem] break-words text-lg font-black leading-snug text-slate-900">{registration.industry}</h3>
                  <p className="mt-1 inline-flex items-center gap-1.5 text-xs font-extrabold text-indigo-700"><UserRound className="h-3.5 w-3.5" />{registration.userId}</p>
                  <div className="mt-5 space-y-3 border-t border-slate-100 pt-4 text-sm">
                    <div className="flex items-start gap-2"><Mail className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" /><span className="min-w-0 break-all text-slate-700">{registration.email ?? "Email not recorded"}</span></div>
                    <div className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" /><span className="min-w-0 break-words text-slate-600">{registration.address}</span></div>
                    <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 shrink-0 text-emerald-700" /><span className="text-xs font-bold text-slate-500">{registration.role}</span></div>
                    <div className="flex items-center gap-2"><UsersRound className="h-4 w-4 shrink-0 text-emerald-700" /><span className="text-xs font-bold text-slate-600">{registration.departmentUserCount} department user(s)</span></div>
                  </div>
                </div>
                <div className="border-t border-slate-100 bg-slate-50/80 px-4 py-3">{renderActions(registration)}</div>
              </article>)}
            </div>
          )}
          {!loading && filtered.length > 0 && <p className="border-t border-slate-100 px-5 py-3 text-center text-xs text-slate-500">{filtered.length} registration{filtered.length === 1 ? "" : "s"} displayed · Approval decisions are applied immediately</p>}
        </section>
      </div>
      {deleting && <div role="presentation" className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-950/65 px-4 backdrop-blur-sm">
        <div role="alertdialog" aria-modal="true" aria-labelledby="delete-registration-title" aria-describedby="delete-registration-description" className="w-full max-w-lg rounded-[26px] bg-white p-6 shadow-[0_30px_90px_rgba(0,0,0,.28)] sm:p-8">
          <span className="inline-grid h-14 w-14 place-items-center rounded-2xl bg-rose-100 text-rose-700"><AlertTriangle className="h-7 w-7" /></span>
          <h2 id="delete-registration-title" className="mt-4 text-xl font-black text-slate-900">Delete this industry account?</h2>
          <p id="delete-registration-description" className="mt-3 text-sm leading-6 text-slate-600">
            This permanently deletes Top Management <strong>{deleting.userId}</strong> and <strong>{deleting.departmentUserCount}</strong> associated department user(s) registered under <strong>{deleting.industry}</strong>. All affected sessions will be revoked. This cannot be undone.
          </p>
          <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-semibold text-rose-800">Deletion uses the exact Industry in the database, not a manually selected list of users.</div>
          <label htmlFor="confirm-deletion-industry" className="mt-5 block text-sm font-bold text-slate-700">Type the full industry name to confirm</label>
          <input id="confirm-deletion-industry" autoFocus value={typedIndustry} onChange={event=>setTypedIndustry(event.target.value)} placeholder={deleting.industry}
            className="input-field mt-2 w-full" autoComplete="off" />
          {deleteError && <p role="alert" className="mt-4 rounded-xl bg-rose-50 p-3 text-sm font-bold text-rose-700">{deleteError}</p>}
          <div className="mt-6 flex justify-end gap-3">
            <button type="button" disabled={Boolean(busy)} onClick={()=>{ setDeleting(null); setTypedIndustry(""); }} className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50">Cancel</button>
            <button type="button" disabled={Boolean(busy) || typedIndustry.trim() !== deleting.industry} onClick={()=>void deleteRegistration()}
              className="inline-flex items-center gap-2 rounded-xl bg-rose-700 px-4 py-3 text-sm font-extrabold text-white transition hover:bg-rose-800 disabled:cursor-not-allowed disabled:opacity-35"><Trash2 className="h-4 w-4" />{busy ? "Deleting…" : "Permanently Delete"}</button>
          </div>
        </div>
      </div>}
    </main>
  );
}
