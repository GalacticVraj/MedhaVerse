"use client";
import { Activity, ShieldAlert, Zap, Trophy, Target, HelpCircle } from "lucide-react";

interface HUDProps {
    onRushHour: () => void;
    onEmergency: () => void;
    isRushHour: boolean;
    vehicleCount: number;
    score: number;
    level: number;
    onMissions: () => void;
    onTutorial: () => void;
}

export default function HUD({ onRushHour, onEmergency, isRushHour, vehicleCount, score, level, onMissions, onTutorial }: HUDProps) {
    const congestionLevel = Math.min(vehicleCount / 25, 1);
    const congestionColor = congestionLevel > 0.7 ? "#FF3366" : congestionLevel > 0.4 ? "#FFD600" : "#00E676";

    return (
        <div className="absolute inset-0 pointer-events-none z-10">
            {/* Top bar */}
            <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                {/* Left controls */}
                <div className="pointer-events-auto flex gap-2 bg-black/60 backdrop-blur-xl p-2 rounded-2xl border border-cyan-500/30">
                    <button
                        onClick={onRushHour}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all ${isRushHour
                            ? "bg-orange-500 text-white shadow-[0_0_20px_rgba(255,165,0,0.5)] animate-pulse"
                            : "bg-white/10 text-cyan-400 hover:bg-white/20"
                            }`}
                    >
                        <Activity size={18} />
                        <span className="hidden sm:inline">{isRushHour ? "🔥 RUSH HOUR" : "Rush Hour"}</span>
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-white/10 text-cyan-400 hover:bg-white/20 rounded-xl font-bold text-sm transition-all">
                        <Zap size={18} />
                        <span className="hidden sm:inline">Signal Scope</span>
                    </button>
                    <button
                        onClick={onMissions}
                        className="flex items-center gap-2 px-4 py-2.5 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 rounded-xl font-bold text-sm transition-all"
                    >
                        <Target size={18} />
                        <span className="hidden sm:inline">Missions</span>
                    </button>
                </div>

                {/* Center: Score */}
                <div className="pointer-events-auto bg-black/60 backdrop-blur-xl px-5 py-2.5 rounded-2xl border border-yellow-500/30 flex items-center gap-3">
                    <Trophy size={18} className="text-yellow-400" />
                    <div>
                        <p className="text-xs font-bold text-yellow-400">{score} XP</p>
                        <p className="text-[10px] text-white/40">Level {level}</p>
                    </div>
                </div>

                {/* Right: Emergency */}
                <div className="pointer-events-auto bg-black/60 backdrop-blur-xl p-2 rounded-2xl border border-red-500/30">
                    <button
                        onClick={onEmergency}
                        className="flex items-center gap-2 px-4 py-2.5 bg-red-500/30 hover:bg-red-500/50 text-red-400 hover:text-white rounded-xl font-bold text-sm transition-all hover:shadow-[0_0_20px_rgba(255,51,102,0.5)]"
                    >
                        <ShieldAlert size={18} />
                        <span className="hidden sm:inline">🚨 Emergency</span>
                    </button>
                </div>
            </div>

            {/* Bottom HUD */}
            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                <div className="pointer-events-auto bg-black/60 backdrop-blur-xl p-4 rounded-2xl border border-white/10 min-w-[260px]">
                    <div className="text-xs font-bold text-white/50 uppercase tracking-widest mb-2">City Traffic Health</div>
                    <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                        <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{ width: `${(1 - congestionLevel) * 100}%`, backgroundColor: congestionColor, boxShadow: `0 0 10px ${congestionColor}` }}
                        />
                    </div>
                    <div className="flex justify-between mt-1.5">
                        <span className="text-xs font-mono text-white/40">Vehicles: {vehicleCount}</span>
                        <span className="text-xs font-bold" style={{ color: congestionColor }}>
                            {congestionLevel > 0.7 ? "🔴 GRIDLOCK" : congestionLevel > 0.4 ? "🟡 BUSY" : "🟢 CLEAR"}
                        </span>
                    </div>
                </div>

                <div className="pointer-events-auto flex items-center gap-2 bg-black/60 backdrop-blur-xl px-4 py-3 rounded-2xl border border-white/10">
                    <p className="text-xs text-white/40 font-medium">🖱️ Orbit • 🔍 Scroll zoom • 🚦 Click signals</p>
                    <button onClick={onTutorial} className="ml-2 text-white/40 hover:text-cyan-400 transition-colors" title="Replay Tutorial">
                        <HelpCircle size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
}
