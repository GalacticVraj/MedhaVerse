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
    const congestionColor = congestionLevel > 0.7 ? "#D3968C" : congestionLevel > 0.4 ? "#ccc9a0" : "#839958";

    return (
        <div className="absolute inset-0 z-40 pointer-events-none">
            <div className="absolute inset-0 flex flex-col justify-between p-4">

                {/* Top row */}
                <div className="flex items-start justify-between">
                    {/* Left controls */}
                    <div className="pointer-events-auto flex flex-col gap-3">
                        {/* Rush Hour */}
                        <div className={`btn-game-wrap ${isRushHour ? "btn-game-wrap-cream" : "btn-game-wrap-green"}`}>
                            <button onClick={onRushHour} className={`btn-game ${isRushHour ? "btn-cream" : "btn-green"}`}>
                                <Zap size={15} />
                                {isRushHour ? "⚡ Rush Hour ON" : "Rush Hour"}
                            </button>
                        </div>

                        {/* Emergency */}
                        <div className="btn-game-wrap btn-game-wrap-red">
                            <button onClick={onEmergency} className="btn-game btn-red">
                                <ShieldAlert size={15} />
                                🚨 Emergency
                            </button>
                        </div>
                    </div>

                    {/* Center — Score */}
                    <div className="pointer-events-auto panel-base px-5 py-3 text-center">
                        <div className="flex items-center gap-2 justify-center">
                            <Trophy size={16} style={{ color: "#D3968C" }} />
                            <span className="font-black text-lg" style={{ color: "#D3968C" }}>{score} XP</span>
                        </div>
                        <p className="text-[11px] font-mono mt-0.5" style={{ color: "#839958" }}>Level {level}</p>
                    </div>

                    <div className="w-[140px]" />
                </div>

                {/* Mission objective strip */}
                {currentObjective && (
                    <div className="absolute top-20 left-1/2 -translate-x-1/2 pointer-events-none">
                        <div className="panel-base px-5 py-2.5">
                            <div className="flex items-center gap-2">
                                <Target size={14} style={{ color: "#F7F4D5" }} />
                                <p className="text-xs font-medium" style={{ color: "#F7F4D5" }}>{currentObjective}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Bottom row */}
                <div className="flex items-end justify-between">
                    {/* Traffic congestion */}
                    <div className="pointer-events-auto panel-base px-4 py-3">
                        <div className="flex items-center gap-3">
                            <Activity size={16} style={{ color: "#839958" }} />
                            <div>
                                <div className="w-32 h-2 rounded-full overflow-hidden" style={{ background: "rgba(247,244,213,0.1)" }}>
                                    <div
                                        className="h-full rounded-full transition-all duration-500"
                                        style={{ width: `${congestionLevel * 100}%`, background: congestionColor }}
                                    />
                                </div>
                                <div className="flex justify-between mt-1">
                                    <span className="text-[10px] font-mono" style={{ color: "rgba(247,244,213,0.35)" }}>Vehicles: {vehicleCount}</span>
                                    <span className="text-[10px] font-bold" style={{ color: congestionColor }}>
                                        {congestionLevel > 0.7 ? "● GRIDLOCK" : congestionLevel > 0.4 ? "● BUSY" : "● CLEAR"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Hints + Help */}
                    <div className="pointer-events-auto flex items-center gap-3 panel-base px-4 py-3">
                        <p className="text-xs font-medium" style={{ color: "rgba(247,244,213,0.4)" }}>
                            🖱️ Orbit &bull; 🔍 Zoom &bull; 🚦 Click signals
                        </p>
                        <div className="btn-game-wrap btn-game-wrap-grey">
                            <button onClick={onTutorial} className="btn-game btn-grey !px-3 !py-2 !text-xs" title="Replay Intro">
                                <HelpCircle size={14} />
                                Help
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
