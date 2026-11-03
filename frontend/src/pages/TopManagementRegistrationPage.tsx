import { useEffect, useRef, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, BadgeCheck, Building2, CheckCircle2, Eye, EyeOff, Mail, ShieldCheck, UserPlus, XCircle } from "lucide-react";
import { apiErrorMessage, registrationApi } from "../services/api";
import { PasswordRequirements } from "../components/PasswordRequirements";
import { PASSWORD_HTML_PATTERN, PASSWORD_MESSAGE, isValidPassword } from "../utils/passwordPolicy";
import { isValidRegistrationEmail, normalizeEmail } from "../utils/emailValidation";

/** Public Top Management registration; registered accounts require Main Admin approval. */
export function TopManagementRegistrationPage() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [emailStatus, setEmailStatus] = useState<{ available: boolean; message: string } | null>(null);
  const [checkingEmail, setCheckingEmail] = useState(false);
  const emailVersion = useRef(0);
  const [industry, setIndustry] = useState("");
  const [address, setAddress] = useState("");
  const [working, setWorking] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [idStatus, setIdStatus] = useState<{ available: boolean; message: string } | null>(null);
  const [checkingId, setCheckingId] = useState(false);
  const [error, setError] = useState("");
  const checkVersion = useRef(0);
  useEffect(() => {
    if (!registered) return;
    // Show the requested popup, then return automatically to the shared login page.
    const timeout = window.setTimeout(() => navigate("/", {
      replace: true, state: { registrationSubmitted: true },
    }), 4000);
    return () => window.clearTimeout(timeout);
  }, [registered, navigate]);

  async function checkEmail(value: string): Promise<boolean> {
    if (!isValidRegistrationEmail(value)) return false;
    const version = ++emailVersion.current;
    setCheckingEmail(true);
    try {
      const result = await registrationApi.checkEmail(normalizeEmail(value));
      if (version !== emailVersion.current) return false;
      setEmailStatus(result);
      return result.available;
    } catch (reason) {
      if (version === emailVersion.current) {
        setEmailStatus({ available: false, message: apiErrorMessage(reason) });
      }
      return false;
    } finally {
      if (version === emailVersion.current) setCheckingEmail(false);
    }
  }

  useEffect(() => {
    // Debounce public availability checks; a final server check also runs on submit.
    const version = ++emailVersion.current;
    setEmailStatus(null);
    setCheckingEmail(false);
    if (!isValidRegistrationEmail(email)) return;
    const timer = window.setTimeout(() => {
      if (version === emailVersion.current) void checkEmail(email);
    }, 550);
    return () => window.clearTimeout(timer);
  }, [email]);

  async function checkUserId(value: string): Promise<boolean> {
    if (!value.trim()) return false;
    const version = ++checkVersion.current;
    setCheckingId(true);
    try {
      const result = await registrationApi.checkUserId(value.trim());
      if (version !== checkVersion.current) return false;
      setIdStatus(result);
      return result.available;
    } catch (reason) {
      if (version === checkVersion.current) {
        setIdStatus({ available: false, message: apiErrorMessage(reason) });
      }
      return false;
    } finally {
      if (version === checkVersion.current) setCheckingId(false);
    }
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (working) return;
    setError("");
    if (!isValidPassword(password)) { setError(PASSWORD_MESSAGE); return; }
    if (!isValidRegistrationEmail(email)) { setError("Enter a valid email address (e.g., name@company.com)."); return; }
    setWorking(true);
    try {
      if (!await checkUserId(userId)) return;
      if (!await checkEmail(email)) { setError("This email address cannot be used. Check the availability message below the field."); return; }
      await registrationApi.register({ userId: userId.trim(), password, industry, address, email: normalizeEmail(email) });
      setPassword("");
      setRegistered(true);
    } catch (reason) { setError(apiErrorMessage(reason)); }
    finally { setWorking(false); }
  }
  return (
    <main className="page-canvas flex min-h-[calc(100vh-134px)] items-center justify-center px-4 py-10">
      <motion.section initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl rounded-[30px] bg-white p-6 shadow-[0_24px_75px_rgba(5,78,59,.13)] ring-1 ring-emerald-900/10 sm:p-9">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold text-emerald-800 hover:underline"><ArrowLeft className="h-4 w-4" /> Back to login</Link>
        <div className="mt-6 flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-50 text-emerald-700"><Building2 /></span>
          <div><h1 className="text-2xl font-black text-slate-900">Top Management Registration</h1><p className="text-sm text-slate-500">Register your industry for Main Admin approval.</p></div>
        </div>
        <form onSubmit={submit} className="mt-7 grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-semibold text-slate-700">User ID
            <input className="input-field mt-2 w-full" maxLength={20} required autoComplete="username"
              value={userId} onChange={e=>{ setUserId(e.target.value); setIdStatus(null); setCheckingId(false); ++checkVersion.current; }}
              onBlur={()=>{ if (userId.trim()) void checkUserId(userId); }} placeholder="e.g., TM1001" />
            {checkingId ? <span className="mt-1 block text-xs text-slate-500">Checking User ID…</span> : idStatus ?
              <span role="status" className={`mt-1 block text-xs ${idStatus.available ? "text-emerald-700" : "text-rose-700"}`}>{idStatus.message}</span> : null}
          </label>
          <label className="text-sm font-semibold text-slate-700">Password
            <div className="relative mt-2">
              <input className="input-field w-full pr-11" type={showPassword ? "text" : "password"}
                minLength={8} maxLength={15} pattern={PASSWORD_HTML_PATTERN} title={PASSWORD_MESSAGE}
                required autoComplete="new-password" value={password} onChange={e=>setPassword(e.target.value)} />
              <button type="button" aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={()=>setShowPassword(current=>!current)} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-500 hover:text-emerald-700">
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </label>
          <div className="sm:col-span-2"><PasswordRequirements password={password} /></div>
          <label className="text-sm font-semibold text-slate-700 sm:col-span-2">Email Address <span className="text-rose-600">*</span>
            <div className="relative mt-2">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-700" />
              <input className={`input-field w-full pl-10 pr-10 ${emailStatus && !emailStatus.available ? "border-rose-400" : emailStatus?.available ? "border-emerald-400" : ""}`}
                type="email" inputMode="email" autoComplete="email" maxLength={254} required
                value={email} onChange={event => setEmail(event.target.value)} placeholder="name@industry.com"
                aria-describedby="registration-email-feedback" />
              {emailStatus?.available && <CheckCircle2 aria-hidden className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-emerald-600" />}
              {emailStatus && !emailStatus.available && <XCircle aria-hidden className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-rose-600" />}
            </div>
            <span id="registration-email-feedback" role="status" aria-live="polite" className={`mt-1.5 block text-xs font-medium ${emailStatus ? emailStatus.available ? "text-emerald-700" : "text-rose-700" : "text-slate-500"}`}>
              {checkingEmail ? "Checking email availability…" : emailStatus ? emailStatus.message : email && !isValidRegistrationEmail(email) ? "Enter a valid email (e.g., name@industry.com)." : "A unique email address is required for each Top Management registration."}
            </span>
          </label>
          <label className="text-sm font-semibold text-slate-700 sm:col-span-2">Industry Name<input className="input-field mt-2 w-full" maxLength={255} required value={industry} onChange={e=>setIndustry(e.target.value)} placeholder="Registered industry name" /></label>
          <label className="text-sm font-semibold text-slate-700 sm:col-span-2">Address<textarea className="input-field mt-2 min-h-24 w-full" maxLength={2000} required value={address} onChange={e=>setAddress(e.target.value)} placeholder="Industry postal address" /></label>
          <p className="flex items-center gap-2 text-xs text-slate-500 sm:col-span-2"><ShieldCheck className="h-4 w-4 text-emerald-700" /> Only approved Top Management accounts can sign in.</p>
          {error && <p role="alert" className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700 sm:col-span-2">{error}</p>}
          <button className="primary-button sm:col-span-2" disabled={working} type="submit"><UserPlus className="h-4 w-4" /> {working ? "Checking & registering…" : "Register for Approval"}</button>
        </form>
      </motion.section>
      {registered && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-950/65 px-4 backdrop-blur-sm" role="presentation">
          <motion.div role="dialog" aria-modal="true" aria-labelledby="approval-popup-title" aria-describedby="approval-popup-description"
            initial={{ opacity: 0, scale: .94, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }}
            className="w-full max-w-md rounded-[28px] bg-white p-8 text-center shadow-[0_35px_100px_rgba(0,0,0,.25)] ring-1 ring-emerald-200">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-emerald-50 text-emerald-700"><BadgeCheck className="h-9 w-9" /></div>
            <h2 id="approval-popup-title" className="mt-5 text-2xl font-black text-slate-900">Registration Submitted!</h2>
            <p id="approval-popup-description" className="mt-3 text-sm leading-6 text-slate-600">
              Your registration is <strong className="text-amber-700">waiting for Main Admin approval</strong>.
              You can sign in after your account is approved.
            </p>
            <p className="mt-4 text-xs font-semibold text-emerald-800">Returning automatically to the login page…</p>
            <button className="primary-button mt-6 w-full" type="button" onClick={()=>navigate("/",{replace:true,state:{registrationSubmitted:true}})}>
              Back to Login <ArrowRight className="h-4 w-4" />
            </button>
          </motion.div>
        </div>
      )}
    </main>
  );
}
