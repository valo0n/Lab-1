/* ToastContext — njoftime te vogla qe dalin lart (ne vend te alert) */
import { createContext, useContext, useState, useCallback } from "react";

const ToastContext = createContext(null);

const STYLES = {
  success: { bg: "#4ea674", icon: "✅" },
  error: { bg: "#ef4444", icon: "⚠️" },
  info: { bg: "#1f2937", icon: "ℹ️" },
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const remove = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message, type = "success", duration = 3000) => {
      const id = Date.now() + Math.random();
      setToasts((prev) => [...prev, { id, message, type }]);
      if (duration > 0) setTimeout(() => remove(id), duration);
      return id;
    },
    [remove],
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Kontejneri i toast-eve — lart, ne qender */}
      <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-2 items-center pointer-events-none">
        {toasts.map((t) => {
          const s = STYLES[t.type] || STYLES.info;
          return (
            <div
              key={t.id}
              onClick={() => remove(t.id)}
              className="pointer-events-auto flex items-center gap-2 px-5 py-3 rounded-xl text-white font-black text-sm cursor-pointer max-w-[90vw]"
              style={{
                background: s.bg,
                boxShadow: "0 10px 25px rgba(0,0,0,0.18)",
                animation: "toastIn .25s ease-out",
              }}
            >
              <span>{s.icon}</span>
              <span>{t.message}</span>
            </div>
          );
        })}
      </div>

      <style>{`
        @keyframes toastIn {
          from { opacity: 0; transform: translateY(-12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast duhet perdorur brenda ToastProvider");
  return ctx;
}
