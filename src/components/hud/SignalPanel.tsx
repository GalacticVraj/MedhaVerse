"use client";
import { X, Play, RotateCcw, Clock, ArrowRight, Lightbulb } from "lucide-react";
import { useState } from "react";

interface SignalConfig {
    greenDuration: number;
    redDuration: number;
    yellowDuration: number;
}

interface SignalPanelProps {
    signalId: string;
    config: SignalConfig;
    onApply: (config: SignalConfig) => void;
    onClose: () => void;
}

const TIPS = [
    "💡 Longer green = more cars pass, but cross-traffic waits longer!",
    "💡 Yellow lights give drivers time to stop safely.",
    "💡 If all lights are green too long, cross-traffic gridlocks!",
    "💡 Emergency vehicles need priority — try shorter red cycles.",
    "💡 Balance is key: equal green times = fairest flow.",
    "💡 In real cities, sensors detect cars and adjust timing!",
];

export default function SignalPanel({ signalId, config, onApply, onClose }: SignalPanelProps) {
    const [green, setGreen] = useState(config.greenDuration);
    const [red, setRed] = useState(config.redDuration);
    const [yellow, setYellow] = useState(config.yellowDuration);
    const [tip] = useState(TIPS[Math.floor(Math.random() * TIPS.length)]);

    const totalCycle = green + red + yellow;

    return (
        <div className="absolute right-4 top-16 bottom-16 w-[340px] bg-black/80 backdrop-blur-2xl border border-cyan-500/40 rounded-3xl shadow-[0_0_60px_rgba(0,224,255,0.15)] flex flex-col overflow-hidden z-50 pointer-events-auto animate-in slide-in-from-right">
            {/* Header */}
            <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 p-5 border-b border-white/10">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-lg font-black text-white tracking-tight">🚦 Signal Control</h2>
                        <p className="text-xs text-cyan-300/60 font-mono mt-0.5">{signalId}</p>
                    </div>
                    <button onClick={onClose} className="text-white/40 hover:text-white transition-colors p-1.5 hover:bg-white/10 rounded-xl">
                        <X size={20} />
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5">
                {/* Cycle visualizer */}
                <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                    <div className="text-xs font-bold text-white/40 uppercase tracking-widest mb-3 flex items-center gap-2">
                        <Clock size={12} /> Signal Cycle — {totalCycle.toFixed(1)}s total
                    </div>
                    <div className="flex h-6 rounded-full overflow-hidden">
                        <div className="bg-green-500 transition-all" style={{ width: `${(green / totalCycle) * 100}%` }} />
                        <div className="bg-yellow-500 transition-all" style={{ width: `${(yellow / totalCycle) * 100}%` }} />
                        <div className="bg-red-500 transition-all" style={{ width: `${(red / totalCycle) * 100}%` }} />
                    </div>
                    <div className="flex justify-between mt-2 text-[10px] font-mono text-white/40">
                        <span>GREEN {green.toFixed(1)}s</span>
                        <span>YEL {yellow.toFixed(1)}s</span>
                        <span>RED {red.toFixed(1)}s</span>
                    </div>
                </div>

                {/* Green slider */}
                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-bold text-green-400 flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-green-400 shadow-[0_0_8px_rgba(0,230,118,0.8)]" />
                            Green Phase
                        </span>
                        <span className="text-sm font-mono text-white/60">{green.toFixed(1)}s</span>
                    </div>
                    <input
                        type="range" min="2" max="30" step="0.5" value={green}
                        onChange={(e) => setGreen(parseFloat(e.target.value))}
                        className="w-full h-2 rounded-full appearance-none cursor-pointer accent-green-400 bg-white/10"
                    />
                    <p className="text-[11px] text-white/30">How long cars can pass through</p>
                </div>

                {/* Yellow slider */}
                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-bold text-yellow-400 flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-yellow-400 shadow-[0_0_8px_rgba(255,214,0,0.8)]" />
                            Yellow Phase
                        </span>
                        <span className="text-sm font-mono text-white/60">{yellow.toFixed(1)}s</span>
                    </div>
                    <input
                        type="range" min="1" max="5" step="0.5" value={yellow}
                        onChange={(e) => setYellow(parseFloat(e.target.value))}
                        className="w-full h-2 rounded-full appearance-none cursor-pointer accent-yellow-400 bg-white/10"
                    />
                    <p className="text-[11px] text-white/30">Warning time before red</p>
                </div>

                {/* Red slider */}
                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-bold text-red-400 flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-400 shadow-[0_0_8px_rgba(255,51,102,0.8)]" />
                            Red Phase
                        </span>
                        <span className="text-sm font-mono text-white/60">{red.toFixed(1)}s</span>
                    </div>
                    <input
                        type="range" min="2" max="30" step="0.5" value={red}
                        onChange={(e) => setRed(parseFloat(e.target.value))}
                        className="w-full h-2 rounded-full appearance-none cursor-pointer accent-red-400 bg-white/10"
                    />
                    <p className="text-[11px] text-white/30">How long cross-traffic waits</p>
                </div>

                {/* Engineering Tip */}
                <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-2xl p-4">
                    <div className="flex items-start gap-2">
                        <Lightbulb size={16} className="text-cyan-400 mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-cyan-200/80 leading-relaxed">{tip}</p>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="bg-white/5 p-4 border-t border-white/10 flex gap-3">
                <button
                    onClick={() => onApply({ greenDuration: green, redDuration: red, yellowDuration: yellow })}
                    className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,224,255,0.3)]"
                >
                    <Play size={16} fill="currentColor" /> Apply Changes
                </button>
                <button
                    onClick={() => { setGreen(8); setRed(8); setYellow(2); }}
                    className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors"
                >
                    <RotateCcw size={18} />
                </button>
            </div>
        </div>
    );
}
