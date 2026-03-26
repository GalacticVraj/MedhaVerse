"use client";
import { X, Play, RotateCcw, Clock, Lightbulb } from "lucide-react";
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
        <div className="absolute right-4 top-16 bottom-16 w-[340px] card flex flex-col z-50 pointer-events-auto animate-in slide-in-from-right">
            {/* Header */}
            <div className="card-header flex justify-between items-center">
                <div>
                    <h2 className="title-bubble-white text-xl">🚦 Signal Control</h2>
                    <p className="text-xs font-mono mt-0.5" style={{ color: "#839958" }}>{signalId}</p>
                </div>
                <button onClick={onClose} className="p-1.5 rounded-xl transition-colors hover:bg-white/10" style={{ color: "rgba(247,244,213,0.5)" }}>
                    <X size={20} />
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5">
                {/* Cycle visualizer */}
                <div className="card-item">
                    <div className="text-xs font-bold uppercase tracking-widest mb-3 flex items-center gap-2 text-on-beige-muted">
                        <Clock size={12} /> Signal Cycle — {totalCycle.toFixed(1)}s
                    </div>
                    <div className="flex h-5 rounded-full overflow-hidden" style={{ border: "1.5px solid rgba(10,51,35,0.2)" }}>
                        <div className="transition-all" style={{ width: `${(green / totalCycle) * 100}%`, background: "#839958" }} />
                        <div className="transition-all" style={{ width: `${(yellow / totalCycle) * 100}%`, background: "#ccc9a0" }} />
                        <div className="transition-all" style={{ width: `${(red / totalCycle) * 100}%`, background: "#D3968C" }} />
                    </div>
                    <div className="flex justify-between mt-2 text-[10px] font-bold">
                        <span className="text-moss">GREEN {green.toFixed(1)}s</span>
                        <span style={{ color: "#9a904a" }}>YEL {yellow.toFixed(1)}s</span>
                        <span className="text-rosy">RED {red.toFixed(1)}s</span>
                    </div>
                </div>

                {/* Green slider */}
                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-bold flex items-center gap-2 text-moss">
                            <div className="w-3 h-3 rounded-full" style={{ background: "#839958", boxShadow: "0 0 6px #839958" }} />
                            Green Phase
                        </span>
                        <span className="text-sm font-mono text-on-beige-muted">{green.toFixed(1)}s</span>
                    </div>
                    <input type="range" min="2" max="30" step="0.5" value={green}
                        onChange={(e) => setGreen(parseFloat(e.target.value))}
                        className="w-full h-2 rounded-full appearance-none cursor-pointer"
                        style={{ accentColor: "#839958", background: "rgba(10,51,35,0.15)" }}
                    />
                    <p className="text-[11px] text-on-beige-muted">How long cars can pass through</p>
                </div>

                {/* Yellow slider */}
                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-bold flex items-center gap-2" style={{ color: "#9a904a" }}>
                            <div className="w-3 h-3 rounded-full" style={{ background: "#ccc9a0", boxShadow: "0 0 6px #ccc9a0" }} />
                            Yellow Phase
                        </span>
                        <span className="text-sm font-mono text-on-beige-muted">{yellow.toFixed(1)}s</span>
                    </div>
                    <input type="range" min="1" max="5" step="0.5" value={yellow}
                        onChange={(e) => setYellow(parseFloat(e.target.value))}
                        className="w-full h-2 rounded-full appearance-none cursor-pointer"
                        style={{ accentColor: "#ccc9a0", background: "rgba(10,51,35,0.15)" }}
                    />
                    <p className="text-[11px] text-on-beige-muted">Warning time before red</p>
                </div>

                {/* Red slider */}
                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-bold flex items-center gap-2 text-rosy">
                            <div className="w-3 h-3 rounded-full" style={{ background: "#D3968C", boxShadow: "0 0 6px #D3968C" }} />
                            Red Phase
                        </span>
                        <span className="text-sm font-mono text-on-beige-muted">{red.toFixed(1)}s</span>
                    </div>
                    <input type="range" min="2" max="30" step="0.5" value={red}
                        onChange={(e) => setRed(parseFloat(e.target.value))}
                        className="w-full h-2 rounded-full appearance-none cursor-pointer"
                        style={{ accentColor: "#D3968C", background: "rgba(10,51,35,0.15)" }}
                    />
                    <p className="text-[11px] text-on-beige-muted">How long cross-traffic waits</p>
                </div>

                {/* Tip */}
                <div className="card-item-midnight">
                    <div className="flex items-start gap-2">
                        <Lightbulb size={15} className="flex-shrink-0 mt-0.5 text-midnight" />
                        <p className="text-xs leading-relaxed text-midnight">{tip}</p>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="p-4 flex gap-3" style={{ borderTop: "2px solid #839958" }}>
                <div className="flex-1 btn-game-wrap btn-game-wrap-blue">
                    <button onClick={() => onApply({ greenDuration: green, redDuration: red, yellowDuration: yellow })}
                        className="btn-game btn-blue w-full justify-center">
                        <Play size={15} fill="currentColor" /> Apply Changes
                    </button>
                </div>
                <div className="btn-game-wrap btn-game-wrap-grey">
                    <button onClick={() => { setGreen(8); setRed(8); setYellow(2); }} className="btn-game btn-grey !px-3">
                        <RotateCcw size={15} />
                    </button>
                </div>
            </div>
        </div>
    );
}
