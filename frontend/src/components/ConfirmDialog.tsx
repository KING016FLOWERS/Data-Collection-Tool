import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";

export function ConfirmDialog({ open, title, message, confirmText, danger = false, busy = false, onCancel, onConfirm }: {
  open: boolean;
  title: string;
  message: string;
  confirmText: string;
  danger?: boolean;
  busy?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[130] grid place-items-center bg-emerald-950/30 p-4 backdrop-blur-md">
          <motion.div initial={{ opacity: 0, scale: 0.96, y: 14 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98 }} className="w-full max-w-md overflow-hidden rounded-[28px] bg-white p-6 shadow-[0_30px_90px_rgba(6,78,59,.24)] ring-1 ring-emerald-950/5">
            <div className={`grid h-11 w-11 place-items-center rounded-2xl ${danger ? "bg-red-50 text-red-600" : "bg-amber-50 text-amber-700"}`}>
              <AlertTriangle className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-lg font-black text-slate-950">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-500">{message}</p>
            <div className="mt-6 flex justify-end gap-2">
              <button onClick={onCancel} disabled={busy} className="secondary-button">Cancel</button>
              <button onClick={onConfirm} disabled={busy} className={`inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-extrabold text-white shadow-sm transition hover:-translate-y-0.5 disabled:opacity-60 ${danger ? "bg-red-600 hover:bg-red-700" : "bg-amber-500 hover:bg-amber-600"}`}>
                {busy ? "Processing…" : confirmText}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
