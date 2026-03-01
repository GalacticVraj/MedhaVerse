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
    currentObjective?: string;
}

export default function HUD({ onRushHour, onEmergency, isRushHour, vehicleCount, score, level, onMissions, onTutorial, currentObjective }: HUDProps) {
    const congestionLevel = Math.min(vehicleCount / 25, 1);
    const congestionColor = congestionLevel > 0.7 ? "#FF3366" : congestionLevel > 0.4 ? "#FFD600" : "#00E676";

    return (
        <div className="absolute inset-0 z-40 pointer-events-none">
            <div className="absolute inset-0 flex flex-col justify-between p-4">
                {/* Top row */}
                <div className="flex items-start justify-between">
                    {/* Left controls */}
                    <div className="pointer-events-auto flex flex-col gap-2">
                        <button
                            onClick={onRushHour}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl border font-bold text-sm transition-all ${isRushHour
                                    ? "bg-orange-500/30 border-orange-400/50 text-orange-300 shadow-[0_0_20px_rgba(255,152,0,0.3)]"
                                    : "bg-black/60 border-white/10 text-white/80 hover:bg-white/10 backdrop-blur-xl"
                                }`}
                        >
                            <Zap size={16} /> Rush Hour
                        </button>

                        <button
                            onClick={onEmergency}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-red-500/20 border border-red-400/30 text-red-300 font-bold text-sm hover:bg-red-500/30 transition-all backdrop-blur-xl shadow-[0_0_15px_rgba(255,51,102,0.15)]"
                        >
                            <ShieldAlert size={16} /> 🚨 Emergency
                        </button>
                    </div>

                    {/* Center — Score + Level */}
                    <div className="pointer-events-auto bg-black/60 backdrop-blur-xl px-5 py-3 rounded-2xl border border-white/10 text-center">
                        <div className="flex items-center gap-2 justify-center">
                            <Trophy size={16} className="text-yellow-400" />
                            <span className="text-yellow-400 font-black text-lg">{score} XP</span>
                        </div>
                        <p className="text-[11px] text-white/40 font-mono">Level {level}</p>
                    </div>

                    {/* Right — empty for signal panel space */}
                    <div className="w-[140px]" />
                </div>

                {/* Current mission objective */}
                {currentObjective && (
                    <div className="absolute top-20 left-1/2 -translate-x-1/2 pointer-events-none">
                        <div className="bg-black/60 backdrop-blur-xl px-5 py-2.5 rounded-2xl border border-cyan-500/30">
                            <div className="flex items-center gap-2">
                                <Target size={14} className="text-cyan-400" />
                                <p className="text-xs text-cyan-300/80 font-medium">{currentObjective}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Bottom row */}
                <div className="flex items-end justify-between">
                    {/* Traffic health */}
                    <div className="pointer-events-auto bg-black/60 backdrop-blur-xl px-4 py-3 rounded-2xl border border-white/10">
                        <div className="flex items-center gap-3">
                            <Activity size={16} className="text-white/60" />
                            <div>
                                <div className="w-32 h-2 bg-white/10 rounded-full overflow-hidden">
                                    <div
                                        className="h-full rounded-full transition-all duration-500"
                                        style={{ width: `${congestionLevel * 100}%`, background: congestionColor }}
                                    />
                                </div>
                                <div className="flex justify-between mt-1">
                                    <span className="text-[10px] text-white/30 font-mono">Vehicles: {vehicleCount}</span>
                                    <span className="text-[10px] font-bold" style={{ color: congestionColor }}>
                                        {congestionLevel > 0.7 ? "● GRIDLOCK" : congestionLevel > 0.4 ? "● BUSY" : "● CLEAR"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Controls hint */}
                    <div className="pointer-events-auto flex items-center gap-2 bg-black/60 backdrop-blur-xl px-4 py-3 rounded-2xl border border-white/10">
                        <p className="text-xs text-white/40 font-medium">🖱️ Orbit • 🔍 Scroll zoom • 🚦 Click signals</p>
                        <button onClick={onTutorial} className="ml-2 text-white/40 hover:text-cyan-400 transition-colors" title="Replay Intro">
                            <HelpCircle size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
