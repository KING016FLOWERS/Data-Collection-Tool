import { useEffect, useRef, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { BadgeCheck, Building2, CheckCircle2, Eye, EyeOff, KeyRound, LockKeyhole, Mail,
  Save, ShieldCheck, UserRoundCog, XCircle } from "lucide-react";
import { useAuth } from "../auth/AuthContext";
import { PasswordRequirements } from "../components/PasswordRequirements";
import { apiErrorMessage, profileApi, type ManagementProfile, type UserIdCheck } from "../services/api";
import { isValidRegistrationEmail, normalizeEmail } from "../utils/emailValidation";
import { isValidPassword, PASSWORD_MESSAGE } from "../utils/passwordPolicy";

export function TopManagementProfilePage() {
  const { session, refreshSession } = useAuth();
  const [profile, setProfile] = useState<ManagementProfile | null>(null);
  const [industry, setIndustry] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [revealPassword, setRevealPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [emailCheck, setEmailCheck] = useState<UserIdCheck | null>(null);
  const [checkingEmail, setCheckingEmail] = useState(false);
  const checkRevision = useRef(0);

  useEffect(() => {
    let active = true;
    void profileApi.get().then(result => {
      if (!active) return;
      setProfile(result); setIndustry(result.industry); setEmail(result.email); setAddress(result.address);
    }).catch(reason => { if (active) setError(apiErrorMessage(reason)); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    const version = ++checkRevision.current;
    setEmailCheck(null);
    setCheckingEmail(false);
    if (!profile || !isValidRegistrationEmail(email)) return;
    if (normalizeEmail(email) === normalizeEmail(profile.email)) {
      setEmailCheck({ available: true, message: "Your current verified email address." });
      return;
    }
    const controller = window.setTimeout(() => {
      setCheckingEmail(true);
      void profileApi.checkEmail(email).then(result => {
        if (version === checkRevision.current) setEmailCheck(result);
      }).catch(reason => {
        if (version === checkRevision.current) setEmailCheck({ available: false, message: apiErrorMessage(reason) });
      }).finally(() => { if (version === checkRevision.current) setCheckingEmail(false); });
    }, 500);
    return () => window.clearTimeout(controller);
  }, [email, profile]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!profile || saving) return;
    setError(""); setMessage("");
    if (!industry.trim() || !address.trim() || !isValidRegistrationEmail(email)) {
      setError("Industry, a valid email and address are required."); return;
    }
    if (emailCheck?.available === false) { setError("Choose an available email address."); return; }
    if (newPassword && !isValidPassword(newPassword)) { setError(PASSWORD_MESSAGE); return; }
    if (newPassword !== confirmPassword) { setError("New password and confirmation do not match."); return; }
    if (!currentPassword) { setError("Enter your current password to confirm changes."); return; }
    setSaving(true);
    try {
      const result = await profileApi.update({ industry: industry.trim(), email: normalizeEmail(email),
        address: address.trim(), currentPassword, ...(newPassword ? { newPassword } : {}) });
      setProfile(result.profile); setIndustry(result.profile.industry); setEmail(result.profile.email);
      setAddress(result.profile.address); setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
      setMessage(result.departmentSessionsRequireLogin
        ? "Profile updated. The industry name was updated for its department accounts; those users must sign in again."
        : result.message);
      await refreshSession();
    } catch (reason) { setError(apiErrorMessage(reason)); }
    finally { setSaving(false); }
  }

  return (
    <div className="page-canvas min-h-[calc(100vh-134px)] px-4 py-7 sm:px-7">
      <div className="mx-auto max-w-5xl space-y-6">
        <header className="relative overflow-hidden rounded-[26px] bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-700 p-6 text-white shadow-xl sm:p-8">
          <div className="flex items-center gap-3"><span className="rounded-2xl bg-white/15 p-3"><UserRoundCog className="h-7 w-7" /></span><div><p className="text-xs font-bold uppercase tracking-[.16em] text-emerald-200">Top Management · Account Settings</p><h1 className="text-2xl font-black sm:text-3xl">Edit My Profile</h1></div></div>
          <p className="mt-4 max-w-2xl text-sm text-emerald-100">Manage your registered industry, contact information and password. Your User ID and approval status cannot be changed.</p>
        </header>
        {loading ? <div className="rounded-2xl bg-white p-10 text-center text-slate-500">Loading your details…</div> : !profile ?
          <p className="rounded-xl bg-rose-50 p-4 text-rose-800" role="alert">{error || "Unable to load profile."}</p> :
          <form onSubmit={event => void submit(event)} className="rounded-[26px] border border-emerald-900/10 bg-white p-5 shadow-[0_15px_45px_rgba(15,51,44,.08)] sm:p-8">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-5"><div className="flex items-center gap-2 text-lg font-black text-slate-900"><Building2 className="h-5 w-5 text-emerald-700" /> Registered Industry Details</div><span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-extrabold text-emerald-800"><BadgeCheck className="h-4 w-4" /> {profile.status}</span></div>
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="text-sm font-bold text-slate-700">User ID <span className="text-xs font-normal text-slate-400">(locked)</span>
                <input readOnly value={profile.userId} className="input-field mt-2 w-full cursor-not-allowed bg-slate-100 font-extrabold text-slate-500" aria-label="User ID cannot be edited" />
              </label>
              <label className="text-sm font-bold text-slate-700">Role <span className="text-xs font-normal text-slate-400">(locked)</span>
                <input readOnly value={profile.role} className="input-field mt-2 w-full cursor-not-allowed bg-slate-100 text-slate-500" />
              </label>
              <label className="text-sm font-bold text-slate-700 sm:col-span-2">Industry Name
                <input required maxLength={255} value={industry} onChange={event=>setIndustry(event.target.value)} className="input-field mt-2 w-full" />
                <span className="mt-1.5 block text-xs font-normal text-slate-500">Renaming your industry will update all associated department users automatically and require them to sign in again.</span>
              </label>
              <label className="text-sm font-bold text-slate-700 sm:col-span-2">Email Address
                <div className="relative mt-2"><Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-700" /><input required type="email" maxLength={254} value={email} onChange={event=>setEmail(event.target.value)} className="input-field w-full pl-10" /></div>
                <span role="status" aria-live="polite" className={`mt-1.5 block text-xs font-semibold ${emailCheck?.available ? "text-emerald-700" : emailCheck ? "text-rose-700" : "text-slate-500"}`}>
                  {checkingEmail ? "Checking email availability…" : emailCheck?.message ?? "Email must be unique across Top Management accounts."}
                </span>
              </label>
              <label className="text-sm font-bold text-slate-700 sm:col-span-2">Industry Address
                <textarea required maxLength={2000} rows={3} value={address} onChange={event=>setAddress(event.target.value)} className="input-field mt-2 w-full resize-y" />
              </label>
            </div>
            <div className="my-7 border-t border-slate-100" />
            <div className="flex items-center gap-2 text-lg font-black text-slate-900"><KeyRound className="h-5 w-5 text-emerald-700" /> Account Security</div>
            <p className="mt-1 text-xs text-slate-500">Leave the new password empty to keep your current password.</p>
            <div className="mt-4 grid gap-5 sm:grid-cols-2">
              <label className="text-sm font-bold text-slate-700">New Password (optional)
                <div className="relative mt-2"><input type={revealPassword ? "text" : "password"} autoComplete="new-password" maxLength={15} value={newPassword} onChange={event=>setNewPassword(event.target.value)} className="input-field w-full pr-11" /><button type="button" aria-label={revealPassword ? "Hide new password" : "Show new password"} onClick={()=>setRevealPassword(!revealPassword)} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-600">{revealPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button></div>
              </label>
              <label className="text-sm font-bold text-slate-700">Confirm New Password
                <input type="password" autoComplete="new-password" maxLength={15} value={confirmPassword} onChange={event=>setConfirmPassword(event.target.value)} className="input-field mt-2 w-full" />
              </label>
              {newPassword && <div className="sm:col-span-2"><PasswordRequirements password={newPassword} /></div>}
              <label className="text-sm font-bold text-slate-700 sm:col-span-2">Current Password <span className="text-rose-600">*</span>
                <div className="relative mt-2"><LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-700" /><input required type="password" autoComplete="current-password" value={currentPassword} onChange={event=>setCurrentPassword(event.target.value)} className="input-field w-full pl-10" placeholder="Verify your current password to save changes" /></div>
              </label>
            </div>
            {error && <p role="alert" className="mt-5 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm font-semibold text-rose-700"><XCircle className="mr-2 inline h-4 w-4" />{error}</p>}
            {message && <p role="status" className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm font-semibold text-emerald-800"><CheckCircle2 className="mr-2 inline h-4 w-4" />{message}</p>}
            <div className="mt-7 flex flex-wrap items-center justify-end gap-3 border-t border-slate-100 pt-5"><Link to="/dashboard" className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50">Back to Dashboard</Link><button type="submit" disabled={saving || checkingEmail || emailCheck?.available === false || !session} className="primary-button"><Save className="h-4 w-4" />{saving ? "Saving changes…" : "Save Profile"}</button></div>
          </form>}
      </div>
    </div>
  );
}
