import { Check, LockKeyhole, X } from "lucide-react";
import { useId } from "react";

type Props = { password: string; optional?: boolean; compact?: boolean };

/** Live, accessible checklist for new-password and password-change inputs. */
export function PasswordRequirements({ password, optional = false, compact = false }: Props) {
  const titleId = useId();
  const requirements = [
    { label: "Lowercase letter", passes: /[a-z]/.test(password) },
    { label: "Uppercase letter", passes: /[A-Z]/.test(password) },
    { label: "Number (0–9)", passes: /[0-9]/.test(password) },
    { label: "Special character # @ _ $", passes: /[#@_$]/.test(password) },
    { label: "8–15 characters", passes: password.length >= 8 && password.length <= 15 },
    { label: "Only allowed characters", passes: /^[A-Za-z0-9#@_$]+$/.test(password) },
  ];
  const fulfilled = requirements.filter(item => item.passes).length;
  const skipped = optional && password.length === 0;
  return (
    <section className={`password-rules ${compact ? "password-rules--compact" : ""}`} aria-labelledby={titleId}>
      <div className="password-rules__top">
        <span className="password-rules__heading" id={titleId}><LockKeyhole size={13} aria-hidden="true" /> Password security</span>
        <span className={`password-rules__counter ${fulfilled === requirements.length ? "password-rules__counter--done" : ""}`}>
          {skipped ? "Optional" : `${fulfilled}/${requirements.length} met`}
        </span>
      </div>
      <div className="password-rules__track" role="progressbar" aria-label="Password requirements met" aria-valuemin={0} aria-valuemax={requirements.length} aria-valuenow={skipped ? 0 : fulfilled}>
        <span className="password-rules__fill" style={{ width: `${skipped ? 0 : fulfilled / requirements.length * 100}%` }} />
      </div>
      <ul className="password-rules__list" aria-label="Password requirements">
        {requirements.map(item => (
          <li key={item.label} className={`password-rules__item ${item.passes && !skipped ? "password-rules__item--passed" : "password-rules__item--pending"}`}>
            <span className="password-rules__indicator" aria-hidden="true">{item.passes && !skipped ? <Check size={11} strokeWidth={3} /> : <X size={10} strokeWidth={2.5} />}</span>
            <span>{item.label}</span>
          </li>
        ))}
      </ul>
      {optional && !password && <p className="password-rules__note">Leave blank to keep the current password.</p>}
    </section>
  );
}
