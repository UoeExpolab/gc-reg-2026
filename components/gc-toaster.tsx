"use client";
import { useState, useEffect } from "react";

interface Toast {
  id: string;
  variant: "success" | "danger" | "info";
  title: string;
  sub?: string;
}

let _push: ((t: Omit<Toast, "id">) => void) | null = null;
export function toast(t: Omit<Toast, "id">) { _push?.(t); }

export function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    _push = (t) => {
      const id = Math.random().toString(36).slice(2);
      setToasts(ts => [...ts, { ...t, id }]);
      setTimeout(() => setToasts(ts => ts.filter(x => x.id !== id)), 4500);
    };
    return () => { _push = null; };
  }, []);

  return (
    <div className="toasts">
      {toasts.map(t => (
        <div key={t.id} className={`toast ${t.variant}`}
             onClick={() => setToasts(ts => ts.filter(x => x.id !== t.id))}>
          <div className="bar" />
          <div style={{ flex: 1 }}>
            <div className="title">{t.title}</div>
            {t.sub && <div className="sub">{t.sub}</div>}
          </div>
        </div>
      ))}
    </div>
  );
}
