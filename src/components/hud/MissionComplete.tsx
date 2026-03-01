"use client";
import { StoryMission } from "@/lib/storyEngine";
import { Trophy, Lightbulb, ChevronRight, Star } from "lucide-react";

interface MissionCompleteProps {
    mission: StoryMission;
    onInsight: () => void;
}

export default function MissionComplete({ mission, onInsight }: MissionCompleteProps) {
    return (
        <div className="fixed inset-0 z-[85] flex items-center justify-center">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <div className="relative z-10 w-[90vw] max-w-[480px] bg-gradient-to-br from-slate-900/95 to-slate-800/95 rounded-3xl border border-yellow-500/30 shadow-[0_0_60px_rgba(255,214,0,0.15)] overflow-hidden">
                {/* Celebration Header */}
                <div className="bg-gradient-to-r from-yellow-500/15 to-orange-500/15 px-6 py-6 border-b border-white/10 text-center">
                    <div className="flex justify-center gap-1 mb-3">
                        {[...Array(3)].map((_, i) => (
                            <Star key={i} size={20} className="text-yellow-400 fill-yellow-400" />
                        ))}
                    </div>
                    <h2 className="text-2xl font-black text-white mb-1">Mission Complete!</h2>
                    <p className="text-sm text-white/50">{mission.icon} {mission.title}</p>
                </div>

                {/* SPARK celebration */}
                <div className="px-6 py-4">
                    <div className="bg-cyan-500/10 rounded-2xl p-4 border border-cyan-500/20">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-6 h-6 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                                <span className="text-xs">🤖</span>
                            </div>
                            <p className="text-xs font-bold text-cyan-400">SPARK says:</p>
                        </div>
                        <p className="text-sm text-cyan-200/80 italic">"{mission.sparkCelebration}"</p>
                    </div>
                </div>

                {/* XP Reward */}
                <div className="text-center py-3">
                    <div className="inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 rounded-full px-6 py-2">
                        <Trophy size={16} className="text-yellow-400" />
                        <span className="text-lg font-black text-yellow-400">+{mission.xpReward} XP</span>
                    </div>
                </div>

                {/* Continue button */}
                <div className="px-6 pb-6 pt-2">
                    <button
                        onClick={onInsight}
                        className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(255,214,0,0.3)] text-lg"
                    >
                        <Lightbulb size={18} /> What Did I Learn?
                    </button>
                </div>
            </div>
        </div>
    );
}
