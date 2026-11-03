import { useState } from "react";
import type { FormEvent } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Eye, EyeOff, Fingerprint, KeyRound, Leaf, LockKeyhole, ShieldCheck, UserPlus } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { PageTransition } from "../components/PageTransition";

export function HomePage() {
  const [userID, setUserID] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const registrationSubmitted = Boolean((location.state as { registrationSubmitted?: boolean } | null)?.registrationSubmitted);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const session = await login(userID, password);
      navigate(session.role === "main_admin" ? "/admin" : session.role === "top_management" ? "/dashboard" : `/user/modules/${session.moduleId}`, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <PageTransition>
      <section className="home-stage relative grid min-h-[calc(100vh-134px)] place-items-center overflow-hidden px-4 py-10 sm:px-6">
        <div className="home-grid" aria-hidden="true" />
        <div className="pointer-events-none absolute -left-36 -top-20 h-[430px] w-[430px] rounded-full bg-emerald-200/50 blur-[100px]" aria-hidden="true" />
        <div className="pointer-events-none absolute -bottom-40 -right-24 h-[500px] w-[500px] rounded-full bg-teal-200/45 blur-[110px]" aria-hidden="true" />
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 grid w-full max-w-[970px] overflow-hidden rounded-[32px] bg-white shadow-[0_36px_100px_rgba(6,78,59,0.15)] ring-1 ring-emerald-950/10 lg:grid-cols-[1fr_0.95fr]"
        >
          <div className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-800 p-10 text-white lg:flex">
            <div className="absolute -right-20 -top-12 h-72 w-72 rounded-full bg-emerald-400/15 blur-[60px]" />
            <div className="relative flex items-center gap-3 text-sm font-extrabold tracking-widest text-emerald-100">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white/15 ring-1 ring-white/15"><Leaf className="h-6 w-6" /></span>
              LEATHER NEXUS · SECURE ACCESS
            </div>
            <div className="relative my-20">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-xs font-bold text-emerald-100"><ShieldCheck className="h-4 w-4" /> Restricted access</div>
              <h2 className="text-4xl font-black leading-tight tracking-tight">Sustainability management, securely connected.</h2>
              <p className="mt-5 max-w-sm text-base leading-7 text-emerald-50/75">Main Admin approves industry registrations. Approved Top Management manages its own industry; Department Users access only their assigned workspace.</p>
            </div>
          </div>

          <div className="px-6 py-10 sm:px-10 sm:py-12">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-2 text-xs font-extrabold text-emerald-800 ring-1 ring-emerald-100">
              <LockKeyhole className="h-4 w-4" /> Secure User Login
            </div>
            <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">Welcome back</h1>
            {registrationSubmitted && <div role="status" className="mt-5 rounded-xl bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-900 ring-1 ring-amber-200">Your registration is awaiting Main Admin approval. Sign in once approved.</div>}
            <form onSubmit={handleLogin} className="mt-8 space-y-5">
              <label className="block">
                <span className="mb-2 flex items-center gap-2 text-xs font-extrabold text-slate-700"><Fingerprint className="h-4 w-4 text-emerald-700" /> User ID</span>
                <input autoComplete="username" name="username" required maxLength={20} value={userID} onChange={(event) => setUserID(event.target.value)} className="input-field h-12" placeholder="Enter User ID" />
              </label>
              <label className="block">
                <span className="mb-2 flex items-center gap-2 text-xs font-extrabold text-slate-700"><KeyRound className="h-4 w-4 text-emerald-700" /> Password</span>
                <div className="relative">
                  <input autoComplete="current-password" name="password" type={showPassword ? "text" : "password"} required value={password} onChange={(event) => setPassword(event.target.value)} className="input-field h-12 pr-12" placeholder="Enter password" />
                  <button type="button" onClick={() => setShowPassword((show) => !show)} className="absolute right-2 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-lg text-slate-500 hover:bg-emerald-50 hover:text-emerald-800" aria-label={showPassword ? "Hide password" : "Show password"}>
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </label>
              {error && <div role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 ring-1 ring-red-100">{error}</div>}
              <button type="submit" disabled={busy} className="primary-button !flex h-12 w-full disabled:cursor-not-allowed disabled:opacity-60">
                {busy ? "Verifying…" : "Sign in to Leather Nexus"} <ArrowRight className="h-4 w-4" />
              </button>
            </form>
            <div className="mt-6 border-t border-slate-100 pt-5 text-center">
              <p className="mb-3 text-xs font-semibold text-slate-500">New industry? Create a Top Management account.</p>
              <Link to="/register/top-management" className="inline-flex w-full items-center justify-center gap-2 rounded-xl border-2 border-emerald-700 bg-white px-4 py-3 text-sm font-extrabold text-emerald-800 transition hover:bg-emerald-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700">
                <UserPlus className="h-4 w-4" /> Register Top Management <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </PageTransition>
  );
}
