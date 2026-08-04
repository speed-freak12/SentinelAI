import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from 'lucide-react';
import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';

type ToastType = 'success' | 'error' | 'info' | 'warning';
interface Toast {
  id: number;
  type: ToastType;
  message: string;
}

const ToastCtx = createContext<(message: string, type?: ToastType) => void>(() => {});

export function useToast() {
  return useContext(ToastCtx);
}

const config: Record<ToastType, { icon: typeof Info; color: string; ring: string }> = {
  success: { icon: CheckCircle2, color: 'text-accent-emerald', ring: 'border-accent-emerald/30' },
  error: { icon: XCircle, color: 'text-accent-red', ring: 'border-accent-red/30' },
  info: { icon: Info, color: 'text-accent-blue', ring: 'border-accent-blue/30' },
  warning: { icon: AlertTriangle, color: 'text-accent-amber', ring: 'border-accent-amber/30' },
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const push = useCallback((message: string, type: ToastType = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, type, message }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4000);
  }, []);

  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3">
        <AnimatePresence>
          {toasts.map((t) => {
            const c = config[t.type];
            const Icon = c.icon;
            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, x: 60, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 60, scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                className={`glass-card flex items-center gap-3 border ${c.ring} px-4 py-3 pr-8 shadow-card min-w-[280px] max-w-sm`}
              >
                <Icon className={`h-5 w-5 shrink-0 ${c.color}`} />
                <span className="text-sm text-slate-200">{t.message}</span>
                <button
                  onClick={() => setToasts((arr) => arr.filter((x) => x.id !== t.id))}
                  className="absolute right-2 top-2 text-slate-500 hover:text-slate-300"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastCtx.Provider>
  );
}
