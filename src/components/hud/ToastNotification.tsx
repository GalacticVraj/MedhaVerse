"use client";
import { useState, useEffect, useCallback } from "react";
import { CheckCircle, AlertTriangle, Zap, Info, X } from "lucide-react";

export type ToastType = "success" | "warning" | "alert" | "info";

interface Toast {
    id: number;
    message: string;
    type: ToastType;
    icon?: string;
}

const TYPE_CONFIG: Record<ToastType, { bg: string; border: string; text: string; glow: string; Icon: React.ElementType }> = {
    success: { bg: "from-emerald-500/20 to-emerald-900/40", border: "border-emerald-400/40", text: "text-emerald-300", glow: "shadow-[0_0_30px_rgba(0,200,100,0.2)]", Icon: CheckCircle },
    warning: { bg: "from-orange-500/20 to-orange-900/40", border: "border-orange-400/40", text: "text-orange-300", glow: "shadow-[0_0_30px_rgba(255,152,0,0.2)]", Icon: AlertTriangle },
    alert: { bg: "from-red-500/20 to-red-900/40", border: "border-red-400/40", text: "text-red-300", glow: "shadow-[0_0_30px_rgba(255,51,102,0.2)]", Icon: AlertTriangle },
    info: { bg: "from-cyan-500/20 to-cyan-900/40", border: "border-cyan-400/40", text: "text-cyan-300", glow: "shadow-[0_0_30px_rgba(0,224,255,0.2)]", Icon: Info },
};

let toastId = 0;
let addToastFn: ((msg: string, type: ToastType, icon?: string) => void) | null = null;

// Global function to add toasts from anywhere
export function showToast(message: string, type: ToastType = "info", icon?: string) {
    addToastFn?.(message, type, icon);
}

export default function ToastContainer() {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = useCallback((message: string, type: ToastType, icon?: string) => {
        const id = ++toastId;
        setToasts(prev => [...prev.slice(-4), { id, message, type, icon }]);
        setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
    }, []);

    useEffect(() => {
        addToastFn = addToast;
        return () => { addToastFn = null; };
    }, [addToast]);

    return (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[95] flex flex-col gap-2 items-center pointer-events-none">
            {toasts.map((toast, i) => {
                const config = TYPE_CONFIG[toast.type];
                const Icon = config.Icon;
                return (
                    <div
                        key={toast.id}
                        className={`pointer-events-auto bg-gradient-to-r ${config.bg} backdrop-blur-2xl ${config.border} border rounded-2xl px-5 py-3 flex items-center gap-3 ${config.glow} animate-in slide-in-from-top-4 fade-in duration-300`}
                        style={{ animationDelay: `${i * 50}ms` }}
                    >
                        {toast.icon ? (
                            <span className="text-xl">{toast.icon}</span>
                        ) : (
                            <Icon size={18} className={config.text} />
                        )}
                        <p className={`text-sm font-bold ${config.text}`}>{toast.message}</p>
                    </div>
                );
            })}
        </div>
    );
}
