import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
  User,
  UserPlus,
  UserRoundPen,
  X,
} from "lucide-react";
import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { createPortal } from "react-dom";
import { modules } from "../data/modules";
import type { User as UserType, UserPayload } from "../types";
import { usersApi, apiErrorMessage } from "../services/api";
import { PasswordRequirements } from "./PasswordRequirements";
import { PASSWORD_HTML_PATTERN, PASSWORD_MESSAGE, isValidPassword } from "../utils/passwordPolicy";

type UserModalProps = {
  open: boolean;
  user: UserType | null;
  busy: boolean;
  onClose: () => void;
  onSubmit: (payload: UserPayload & { userId?: string }) => Promise<void>;
};

type UserForm = UserPayload & { userId: string };

const emptyForm: UserForm = {
  userId: "",
  password: "",
  name: "",
  department: "",
  email: "",
};

/**
 * No-scroll user dialog. Desktop shows all fields in a compact two-column grid.
 * Small windows and mobile display two short steps so controls fit without
 * adding either a vertical or horizontal scrollbar.
 */
export function UserModal({ open, user, busy, onClose, onSubmit }: UserModalProps) {
  const [form, setForm] = useState<UserForm>(emptyForm);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [compactMode, setCompactMode] = useState(false);
  const [step, setStep] = useState<0 | 1>(0);
  const [credentialError, setCredentialError] = useState("");
  const [checkingId, setCheckingId] = useState(false);
  const [idAvailable, setIdAvailable] = useState(false);
  const idCheckVersion = useRef(0);
  const dialogRef = useRef<HTMLDivElement>(null);
  const userIdInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const isEditing = Boolean(user);
  const onFirstStep = compactMode && step === 0;
  const onDetailsStep = !compactMode || step === 1;

  // A short viewport is treated like mobile to prevent internal scrollbars.
  useEffect(() => {
    const compactMedia = window.matchMedia("(max-width: 640px), (max-height: 720px)");
    const syncSize = () => setCompactMode(compactMedia.matches);
    syncSize();
    compactMedia.addEventListener("change", syncSize);
    return () => compactMedia.removeEventListener("change", syncSize);
  }, []);

  useEffect(() => {
    if (!open) return;
    setForm(user
      ? { userId: user.userId, password: "", name: user.name, department: user.department, email: user.email }
      : emptyForm);
    setPasswordVisible(false);
    setCredentialError("");
    setCheckingId(false);
    setIdAvailable(false);
    ++idCheckVersion.current;
    setStep(0);
  }, [open, user]);

  // Prevent scrolling of the document behind the portal; restore afterwards.
  useEffect(() => {
    if (!open) return;
    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
      previousFocus?.focus();
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const frame = requestAnimationFrame(() => {
      if (compactMode && step === 1) nameInputRef.current?.focus();
      else if (isEditing && !compactMode) nameInputRef.current?.focus();
      else if (isEditing) passwordInputRef.current?.focus();
      else userIdInputRef.current?.focus();
    });
    return () => cancelAnimationFrame(frame);
  }, [open, compactMode, step, isEditing]);

  const updateField = (field: keyof UserForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setCredentialError("");
    if (field === "userId") { ++idCheckVersion.current; setCheckingId(false); setIdAvailable(false); }
  };
  const checkUserId = async (id: string): Promise<boolean> => {
    if (isEditing || !id.trim()) return isEditing;
    const version = ++idCheckVersion.current;
    setCheckingId(true);
    try {
      const result = await usersApi.checkUserId(id.trim());
      if (version !== idCheckVersion.current) return false;
      setCredentialError(result.available ? "" : result.message);
      setIdAvailable(result.available);
      return result.available;
    } catch (error) {
      if (version === idCheckVersion.current) { setCredentialError(apiErrorMessage(error)); setIdAvailable(false); }
      return false;
    } finally {
      if (version === idCheckVersion.current) setCheckingId(false);
    }
  };
  // Validate before advancing in the compact two-step dialog.
  const nextStep = async () => {
    for (const input of [userIdInputRef.current, passwordInputRef.current]) {
      if (input && !input.reportValidity()) return;
    }
    if (!isEditing && !await checkUserId(form.userId)) return;
    setStep(1);
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (busy) return;
    if (onFirstStep) {
      await nextStep();
      return;
    }
    if ((isEditing && form.password && !isValidPassword(form.password)) ||
        (!isEditing && (!form.userId.trim() || !isValidPassword(form.password ?? "")))) {
      setCredentialError(PASSWORD_MESSAGE);
      if (compactMode) setStep(0);
      return;
    }
    if (!isEditing && !await checkUserId(form.userId)) {
      if (compactMode) setStep(0);
      return;
    }
    await onSubmit(form);
  };

  // Lock keyboard navigation to the currently visible modal controls.
  const handleDialogKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      event.stopPropagation();
      if (!busy) onClose();
      return;
    }
    if (event.key !== "Tab" || !dialogRef.current) return;
    const tabbable = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(
      'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])',
    )).filter((element) => element.getClientRects().length > 0);
    const first = tabbable[0];
    const last = tabbable[tabbable.length - 1];
    if (!first || !last) {
      event.preventDefault();
      dialogRef.current.focus();
    } else if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          key="user-modal-overlay"
          role="presentation"
          className="user-modal-backdrop fixed inset-0 z-[1000] flex items-center justify-center overflow-hidden p-3 sm:p-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onPointerDown={(event) => event.stopPropagation()}
          onClick={(event) => event.stopPropagation()}
        >
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="user-modal-title"
            aria-describedby="user-modal-description"
            tabIndex={-1}
            className={`user-modal-panel relative w-full overflow-hidden rounded-[26px] ${compactMode ? "max-w-[380px]" : "max-w-[560px]"}`}
            onKeyDown={handleDialogKeyDown}
            onPointerDown={(event) => event.stopPropagation()}
            initial={{ opacity: 0, scale: 0.97, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 12 }}
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
          >
            <div aria-hidden="true" className="pointer-events-none absolute -right-28 -top-24 h-60 w-60 rounded-full bg-emerald-200/45 blur-[85px]" />
            <div aria-hidden="true" className="pointer-events-none absolute -bottom-28 -left-28 h-64 w-64 rounded-full bg-teal-200/35 blur-[85px]" />

            <header className="user-modal-header relative flex items-start justify-between gap-3 px-6 pt-6 sm:px-7">
              <div className="flex min-w-0 items-center gap-3">
                <span className="user-modal-heading-icon grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-emerald-700 to-teal-600 text-white shadow-md shadow-emerald-800/20">
                  {isEditing ? <UserRoundPen className="h-5 w-5" /> : <UserPlus className="h-5 w-5" />}
                </span>
                <div className="min-w-0">
                  <p className="user-modal-kicker text-[10px] font-extrabold uppercase tracking-[0.16em] text-emerald-700">User administration</p>
                  <h2 id="user-modal-title" className="text-xl font-black tracking-tight text-slate-900 sm:text-2xl">
                    {isEditing ? "Edit User" : "Add New User"}
                  </h2>
                  <p id="user-modal-description" className="user-modal-description mt-0.5 text-xs text-slate-500">
                    {compactMode ? (step === 0 ? "Account credentials" : "Profile and department") : "Account and department access details"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                aria-label="Close user form"
                disabled={busy}
                onClick={() => !busy && onClose()}
                className="user-modal-close grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-emerald-950/[0.055] text-slate-500 transition hover:bg-emerald-100 hover:text-emerald-800 disabled:opacity-50"
              >
                <X className="h-5 w-5" />
              </button>
            </header>

            {!compactMode && (
              <div className="user-modal-note relative mx-6 mt-4 flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-50/90 to-teal-50/60 px-3 py-2.5 ring-1 ring-inset ring-emerald-200/60 sm:mx-7">
                <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-700" />
                <p className="text-xs font-medium text-emerald-900/75">Manage user information and sustainability module access.</p>
              </div>
            )}

            {compactMode && (
              <div className="user-modal-step-indicator relative mx-6 mt-3 flex gap-1.5 sm:mx-7" aria-label={`Step ${step + 1} of 2`}>
                <span className={`h-1 flex-1 rounded-full ${step === 0 ? "bg-emerald-700" : "bg-emerald-200"}`} />
                <span className={`h-1 flex-1 rounded-full ${step === 1 ? "bg-emerald-700" : "bg-emerald-200"}`} />
              </div>
            )}

            <form onSubmit={submit} className={`user-modal-form relative grid gap-x-4 gap-y-3 px-6 pb-6 pt-4 sm:px-7 ${compactMode ? "grid-cols-1" : "grid-cols-2"}`}>
              {(!compactMode || onFirstStep) && (
                <>
                  <label className="field-label user-modal-field">
                    <span><User className="h-3.5 w-3.5 text-emerald-600" /> User ID</span>
                    <input
                      ref={userIdInputRef}
                      disabled={isEditing}
                      required
                      maxLength={20}
                      value={form.userId}
                      onChange={(event) => updateField("userId", event.target.value)}
                      onBlur={() => { if (!isEditing && form.userId.trim()) void checkUserId(form.userId); }}
                      placeholder="Example: USR001"
                      className="input-field disabled:bg-slate-100 disabled:text-slate-400"
                    />
                  </label>

                  <label className="field-label user-modal-field">
                    <span><LockKeyhole className="h-3.5 w-3.5 text-emerald-600" /> {isEditing ? "New Password" : "Password"}</span>
                    <div className="relative">
                      <input
                        ref={passwordInputRef}
                        type={passwordVisible ? "text" : "password"}
                        required={!isEditing}
                        minLength={isEditing ? undefined : 8}
                        maxLength={15}
                        pattern={PASSWORD_HTML_PATTERN}
                        title={PASSWORD_MESSAGE}
                        value={form.password ?? ""}
                        onChange={(event) => updateField("password", event.target.value)}
                        placeholder={isEditing ? "Optional — keep current password" : "8–15 characters"}
                        className="input-field w-full pr-11"
                      />
                      <button
                        type="button"
                        onClick={() => setPasswordVisible((previous) => !previous)}
                        aria-label={passwordVisible ? "Hide password" : "Show password"}
                        className="absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-lg text-slate-500 transition hover:bg-emerald-50 hover:text-emerald-700"
                      >
                        {passwordVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </label>
                </>
              )}

              {(!compactMode || onFirstStep) && (
                <div className={`text-[10px] leading-4 text-slate-500 ${compactMode ? "" : "col-span-2"}`}>
                  <PasswordRequirements password={form.password ?? ""} optional={isEditing} compact />
                  {checkingId && <span className="ml-2 font-semibold text-emerald-700">Checking User ID…</span>}
                  {!isEditing && idAvailable && !checkingId && <span className="ml-2 font-semibold text-emerald-700">User ID available</span>}
                  {credentialError && <p role="alert" className="mt-1 font-semibold text-rose-700">{credentialError}</p>}
                </div>
              )}

              {onDetailsStep && (
                <>
                  <label className="field-label user-modal-field">
                    <span><User className="h-3.5 w-3.5 text-emerald-600" /> Full Name</span>
                    <input
                      ref={nameInputRef}
                      required
                      value={form.name}
                      onChange={(event) => updateField("name", event.target.value)}
                      placeholder="Example: John Doe"
                      className="input-field"
                    />
                  </label>

                  <label className="field-label user-modal-field">
                    <span><Mail className="h-3.5 w-3.5 text-emerald-600" /> Email Address</span>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(event) => updateField("email", event.target.value)}
                      placeholder="name@company.com"
                      className="input-field"
                    />
                  </label>

                  <label className={`field-label user-modal-field ${compactMode ? "" : "col-span-2"}`}>
                    <span><Building2 className="h-3.5 w-3.5 text-emerald-600" /> Department / Sustainability Module</span>
                    <select
                      required
                      value={form.department}
                      onChange={(event) => updateField("department", event.target.value)}
                      className="input-field"
                    >
                      <option value="" disabled>Select Sustainability Module</option>
                      {modules.map((module) => (
                        <option key={module.id} value={module.title}>{module.id} · {module.title}</option>
                      ))}
                    </select>
                  </label>
                </>
              )}

              <div className={`user-modal-actions mt-2 flex flex-wrap items-center justify-end gap-2 ${compactMode ? "" : "col-span-2"}`}>
                {compactMode && step === 1 ? (
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => setStep(0)}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-950/[0.06] px-4 py-2.5 text-sm font-bold text-slate-600 transition hover:bg-emerald-100 disabled:opacity-50"
                  >
                    <ArrowLeft className="h-4 w-4" /> Back
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => !busy && onClose()}
                    className="rounded-xl bg-emerald-950/[0.06] px-4 py-2.5 text-sm font-bold text-slate-600 transition hover:bg-emerald-100 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                )}

                {onFirstStep ? (
                  <button
                    type="button"
                    onClick={() => void nextStep()}
                    className="primary-button min-w-[126px] justify-center !py-2.5"
                  >
                    Next <ArrowRight className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    disabled={busy}
                    type="submit"
                    className="primary-button min-w-[134px] justify-center !py-2.5 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {busy ? "Saving…" : isEditing ? "Update User" : "Create User"}
                  </button>
                )}
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
