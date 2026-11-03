import { useAuth } from "../auth/AuthContext";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  CircleCheck,
  Edit3,
  Fingerprint,
  Mail,
  Pause,
  Play,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  Trash2,
  UserCheck,
  UsersRound,
  UserX,
  X,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { PageTransition } from "../components/PageTransition";
import { UserModal } from "../components/UserModal";
import { apiErrorMessage, usersApi } from "../services/api";
import type { User, UserPayload, UserStatus } from "../types";

type PendingAction =
  | { kind: "delete" | "status"; user: User; nextStatus?: UserStatus }
  | null;

type Toast = { type: "success" | "error" | "warning"; message: string } | null;
type StatusFilter = "All" | UserStatus;
type SortOrder = "newest" | "oldest" | "name";

const PAGE_SIZE = 8;

function initialsFor(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return (parts.length > 1 ? `${parts[0][0]}${parts[parts.length - 1][0]}` : (parts[0] ?? "U").slice(0, 2)).toUpperCase();
}

function formatDate(dateString: string): string {
  const value = new Date(dateString);
  if (Number.isNaN(value.getTime())) return "—";
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(value);
}

function UserStatCard({
  label,
  value,
  description,
  icon: Icon,
  tone,
  percent,
}: {
  label: string;
  value: number;
  description: string;
  icon: typeof UsersRound;
  tone: "blue" | "green" | "orange";
  percent?: number;
}) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 280, damping: 22 }}
      className={`user-overview-card user-overview-card--${tone}`}
    >
      <span aria-hidden="true" className="user-overview-card__glow" />
      <div className="relative z-10 flex h-full flex-col justify-between gap-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/80">{label}</p>
            <p className="mt-3 text-4xl font-black leading-none tracking-tight text-white sm:text-[42px]">
              {value.toLocaleString("en-IN")}
            </p>
          </div>
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white/20 text-white ring-1 ring-white/25 backdrop-blur-sm">
            <Icon className="h-6 w-6" strokeWidth={2.1} aria-hidden="true" />
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold text-white/85">{description}</p>
          {percent !== undefined && (
            <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/25" aria-label={`${label}: ${percent}% of users`}>
              <div className="h-full rounded-full bg-white/90 transition-[width] duration-500" style={{ width: `${percent}%` }} />
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export function UsersPage() {
  const { session } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [pending, setPending] = useState<PendingAction>(null);
  const [toast, setToast] = useState<Toast>(null);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");
  const [currentPage, setCurrentPage] = useState(1);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      setUsers(await usersApi.list());
    } catch (error) {
      setToast({ type: "error", message: apiErrorMessage(error) });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadUsers();
  }, [loadUsers]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 3500);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const activeCount = users.filter((user) => user.status === "Active").length;
  const suspendedCount = users.length - activeCount;
  const percentOfTotal = (value: number) => (users.length ? Math.round((value / users.length) * 100) : 0);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const result = users.filter((user) => {
      const matchesStatus = statusFilter === "All" || user.status === statusFilter;
      const matchesQuery = !normalized || [user.userId, user.name, user.department, user.email, user.status]
        .some((value) => value.toLowerCase().includes(normalized));
      return matchesStatus && matchesQuery;
    });
    result.sort((first, second) => {
      if (sortOrder === "name") return first.name.localeCompare(second.name);
      const delta = (Date.parse(first.createdAt) || 0) - (Date.parse(second.createdAt) || 0);
      return sortOrder === "newest" ? -delta : delta;
    });
    return result;
  }, [users, query, statusFilter, sortOrder]);

  useEffect(() => {
    setCurrentPage(1);
  }, [query, statusFilter, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const page = Math.min(currentPage, totalPages);
  const visibleUsers = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const start = filtered.length ? (page - 1) * PAGE_SIZE + 1 : 0;
  const end = Math.min(page * PAGE_SIZE, filtered.length);

  const submitUser = async (payload: UserPayload & { userId?: string }) => {
    setBusy(true);
    try {
      const response = editing
        ? await usersApi.update(editing.userId, payload)
        : await usersApi.create(payload as UserPayload & { userId: string; password: string });
      setToast({ type: "success", message: response.message });
      setModalOpen(false);
      setEditing(null);
      await loadUsers();
    } catch (error) {
      setToast({ type: "error", message: apiErrorMessage(error) });
    } finally {
      setBusy(false);
    }
  };

  const runPending = async () => {
    if (!pending) return;
    setBusy(true);
    try {
      const response = pending.kind === "delete"
        ? await usersApi.remove(pending.user.userId)
        : await usersApi.setStatus(pending.user.userId, pending.nextStatus!);
      setToast({
        type: pending.kind === "status" && pending.nextStatus === "Suspended" ? "warning" : "success",
        message: response.message,
      });
      setPending(null);
      await loadUsers();
    } catch (error) {
      setToast({ type: "error", message: apiErrorMessage(error) });
    } finally {
      setBusy(false);
    }
  };

  return (
    <PageTransition>
      <section className="page-canvas relative overflow-hidden px-4 py-5 sm:px-6 xl:px-8">
        <div className="page-orb page-orb-one" aria-hidden="true" />
        <div className="page-orb page-orb-two" aria-hidden="true" />
        <div className="relative mx-auto max-w-[1500px]">
          <div className="page-heading-panel flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="section-kicker"><ShieldCheck className="h-3.5 w-3.5" /> Access Administration</div>
              <h1 className="mt-3 text-2xl font-black tracking-[-0.025em] text-slate-950">User Management</h1>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                Manage department accounts for your registered industry.
              </p>
              <p className="mt-2 text-xs font-extrabold text-emerald-700">Industry: {session?.industry ?? "—"} (automatically assigned to new users)</p>
            </div>
            <button type="button" onClick={() => { setEditing(null); setModalOpen(true); }} className="primary-button">
              <Plus className="h-4 w-4" /> Add New User
            </button>
          </div>

          <AnimatePresence>
            {toast && (
              <motion.div
                role="status"
                initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                className={`mt-4 flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold shadow-sm ring-1 ${
                  toast.type === "error" ? "bg-red-50 text-red-700 ring-red-100"
                  : toast.type === "warning" ? "bg-amber-50 text-amber-700 ring-amber-100"
                  : "bg-emerald-50 text-emerald-800 ring-emerald-100"
                }`}
              >
                <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>{toast.message}</span>
                <button type="button" aria-label="Dismiss notification" onClick={() => setToast(null)} className="ml-auto grid h-7 w-7 place-items-center rounded-lg transition hover:bg-black/[.05]"><X className="h-4 w-4" /></button>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            <UserStatCard label="Total Users" value={users.length} description="Registered user accounts" icon={UsersRound} tone="blue" />
            <UserStatCard label="Active Users" value={activeCount} description={`${percentOfTotal(activeCount)}% of registered users`} icon={UserCheck} tone="green" percent={percentOfTotal(activeCount)} />
            <UserStatCard label="Suspended Users" value={suspendedCount} description={`${percentOfTotal(suspendedCount)}% of registered users`} icon={UserX} tone="orange" percent={percentOfTotal(suspendedCount)} />
          </div>

          <div className="user-directory mt-5">
            <div className="user-directory__toolbar">
              <div>
                <div className="flex items-center gap-2 text-lg font-extrabold tracking-tight text-slate-900">
                  <UsersRound className="h-5 w-5 text-emerald-700" aria-hidden="true" /> User Directory
                </div>
                <p className="mt-1 text-xs font-medium text-slate-500">Browse and manage department users</p>
              </div>
              <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
                <label className="user-directory__search">
                  <Search className="h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
                  <span className="sr-only">Search users</span>
                  <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search name, ID, department…" className="w-full bg-transparent text-sm font-medium text-slate-800 outline-none placeholder:text-slate-400" />
                </label>
                <button type="button" onClick={() => void loadUsers()} disabled={loading} className="user-directory__refresh" title="Refresh users" aria-label="Refresh users">
                  <RefreshCw className={`h-[18px] w-[18px] ${loading ? "animate-spin" : ""}`} aria-hidden="true" />
                </button>
              </div>
            </div>

            <div className="user-directory__filters">
              <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter by account status">
                {(["All", "Active", "Suspended"] as const).map((filter) => (
                  <button
                    key={filter} type="button"
                    aria-pressed={statusFilter === filter}
                    onClick={() => setStatusFilter(filter)}
                    className={`user-directory__filter ${statusFilter === filter ? "user-directory__filter--active" : ""}`}
                  >
                    {filter === "All" ? <UsersRound className="h-3.5 w-3.5" /> : filter === "Active" ? <CircleCheck className="h-3.5 w-3.5" /> : <AlertTriangle className="h-3.5 w-3.5" />}
                    {filter === "All" ? "All Users" : filter}
                    <span className={`user-directory__filter-count ${statusFilter === filter ? "user-directory__filter-count--active" : ""}`}>
                      {filter === "All" ? users.length : filter === "Active" ? activeCount : suspendedCount}
                    </span>
                  </button>
                ))}
              </div>
              <label className="user-directory__sort">
                <span className="sr-only">Sort users</span>
                <select value={sortOrder} onChange={(event) => setSortOrder(event.target.value as SortOrder)} className="cursor-pointer appearance-none bg-transparent pr-6 text-xs font-bold text-slate-600 outline-none">
                  <option value="newest">Newest first</option>
                  <option value="oldest">Oldest first</option>
                  <option value="name">Name A–Z</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 h-4 w-4 text-slate-400" aria-hidden="true" />
              </label>
            </div>

            <div className="overflow-x-auto">
              <table className="user-directory__table w-full min-w-[1050px] text-center text-sm">
                <thead>
                  <tr>
                    <th scope="col" className="w-16">No.</th>
                    <th scope="col">User / Identity</th>
                    <th scope="col">User ID</th>
                    <th scope="col">Department / Module</th>
                    <th scope="col">Email Address</th>
                    <th scope="col">Account Status</th>
                    <th scope="col">Created</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={8} className="py-16 text-center text-slate-500"><RefreshCw className="mr-2 inline-block h-4 w-4 animate-spin text-emerald-700" /> Loading users…</td></tr>
                  ) : filtered.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-5 py-16 text-center">
                        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-emerald-50 text-emerald-700"><Search className="h-6 w-6" /></div>
                        <p className="mt-3 font-extrabold text-slate-800">No users found</p>
                        <p className="mt-1 text-xs text-slate-500">Try a different search or account-status filter.</p>
                        {(query || statusFilter !== "All") && (
                          <button type="button" onClick={() => { setQuery(""); setStatusFilter("All"); }} className="mt-3 text-xs font-extrabold text-emerald-700 underline underline-offset-4">Clear filters</button>
                        )}
                      </td>
                    </tr>
                  ) : visibleUsers.map((user, index) => (
                    <tr key={user.userId}>
                      <td className="user-directory__number">{String((page - 1) * PAGE_SIZE + index + 1).padStart(2, "0")}</td>
                      <td>
                        <div className="flex items-center justify-center gap-3">
                          <div className="user-directory__avatar">{initialsFor(user.name)}</div>
                          <div className="min-w-0 text-center">
                            <div className="max-w-[210px] truncate font-extrabold text-slate-800" title={user.name}>{user.name}</div>
                            <div className="mt-0.5 max-w-[200px] truncate text-[11px] font-medium text-slate-500" title={user.industry}>{user.industry}</div>
                          </div>
                        </div>
                      </td>
                      <td><span className="user-directory__identifier"><Fingerprint className="h-3.5 w-3.5" aria-hidden="true" />{user.userId}</span></td>
                      <td><span className="user-directory__department" title={user.department}>{user.department}</span></td>
                      <td><a className="user-directory__email" href={`mailto:${user.email}`} title={user.email}><Mail className="h-3.5 w-3.5 shrink-0" aria-hidden="true" /><span className="max-w-[175px] truncate">{user.email}</span></a></td>
                      <td>
                        <span className={`user-directory__status ${user.status === "Active" ? "user-directory__status--active" : "user-directory__status--suspended"}`}>
                          <span className="h-2 w-2 rounded-full bg-current" aria-hidden="true" />{user.status}
                        </span>
                      </td>
                      <td><span className="flex items-center justify-center gap-1.5 whitespace-nowrap text-xs font-medium text-slate-500"><CalendarDays className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />{formatDate(user.createdAt)}</span></td>
                      <td>
                        <div className="flex items-center justify-center gap-1.5">
                          <button type="button" aria-label={`Edit ${user.name}`} title="Edit user" onClick={() => { setEditing(user); setModalOpen(true); }} className="user-directory__action user-directory__action--edit"><Edit3 className="h-4 w-4" /></button>
                          {user.status === "Active" ? (
                            <button type="button" aria-label={`Suspend ${user.name}`} title="Suspend user" onClick={() => setPending({ kind: "status", user, nextStatus: "Suspended" })} className="user-directory__action user-directory__action--suspend"><Pause className="h-4 w-4" /></button>
                          ) : (
                            <button type="button" aria-label={`Activate ${user.name}`} title="Activate user" onClick={() => setPending({ kind: "status", user, nextStatus: "Active" })} className="user-directory__action user-directory__action--activate"><Play className="h-4 w-4" /></button>
                          )}
                          <button type="button" aria-label={`Delete ${user.name}`} title="Delete user" onClick={() => setPending({ kind: "delete", user })} className="user-directory__action user-directory__action--delete"><Trash2 className="h-4 w-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="user-directory__bottom">
              <p className="text-xs font-semibold text-slate-500">
                Showing <strong className="text-slate-800">{start}–{end}</strong> of <strong className="text-slate-800">{filtered.length}</strong> users
              </p>
              <div className="flex items-center gap-2">
                <button type="button" disabled={page <= 1 || loading} onClick={() => setCurrentPage((previous) => Math.max(1, previous - 1))} className="user-directory__page-button" aria-label="Previous page"><ArrowLeft className="h-4 w-4" /></button>
                <span className="min-w-14 text-center text-xs font-extrabold text-slate-600">{page} / {totalPages}</span>
                <button type="button" disabled={page >= totalPages || loading} onClick={() => setCurrentPage((previous) => Math.min(totalPages, previous + 1))} className="user-directory__page-button" aria-label="Next page"><ArrowRight className="h-4 w-4" /></button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <UserModal
        open={modalOpen} user={editing} busy={busy}
        onClose={() => { if (!busy) { setModalOpen(false); setEditing(null); } }}
        onSubmit={submitUser}
      />
      <ConfirmDialog
        open={Boolean(pending)}
        title={pending?.kind === "delete" ? "Delete user?" : pending?.nextStatus === "Active" ? "Activate user?" : "Suspend user?"}
        message={pending ? pending.kind === "delete" ? `Delete “${pending.user.name}”? This action cannot be undone.` : `${pending.nextStatus === "Active" ? "Activate" : "Suspend"} “${pending.user.name}”?` : ""}
        confirmText={pending?.kind === "delete" ? "Delete" : pending?.nextStatus === "Active" ? "Activate" : "Suspend"}
        danger={pending?.kind === "delete"} busy={busy}
        onCancel={() => { if (!busy) setPending(null); }}
        onConfirm={() => void runPending()}
      />
    </PageTransition>
  );
}
