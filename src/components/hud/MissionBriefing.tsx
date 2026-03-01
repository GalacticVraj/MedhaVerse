"use client";
import { StoryMission } from "@/lib/storyEngine";
import { Target, Lightbulb, ChevronRight } from "lucide-react";

interface MissionBriefingProps {
    mission: StoryMission;
    missionNumber: number;
    totalMissions: number;
    onStart: () => void;
}

export default function MissionBriefing({ mission, missionNumber, totalMissions, onStart }: MissionBriefingProps) {
    return (
        <div className="fixed inset-0 z-[85] flex items-center justify-center">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <div className="relative z-10 w-[90vw] max-w-[480px] bg-gradient-to-br from-slate-900/95 to-slate-800/95 rounded-3xl border border-cyan-500/30 shadow-[0_0_60px_rgba(0,224,255,0.15)] overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-cyan-500/15 to-blue-500/15 px-6 py-5 border-b border-white/10">
                    <p className="text-[11px] text-cyan-300/50 font-mono uppercase tracking-[0.3em] mb-1">
                        Mission {missionNumber} of {totalMissions}
                    </p>
                    <div className="flex items-center gap-3">
                        <span className="text-3xl">{mission.icon}</span>
                        <h2 className="text-xl font-black text-white">{mission.title}</h2>
                    </div>
                </div>

                {/* Objective */}
                <div className="px-6 py-5 space-y-4">
                    <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                        <div className="flex items-center gap-2 mb-2">
                            <Target size={14} className="text-cyan-400" />
                            <p className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Objective</p>
                        </div>
                        <p className="text-sm text-white/80">{mission.objective}</p>
                    </div>

                    <div className="bg-cyan-500/5 rounded-2xl p-4 border border-cyan-500/15">
                        <div className="flex items-center gap-2 mb-2">
                            <Lightbulb size={14} className="text-yellow-400" />
                            <p className="text-xs font-bold text-yellow-400/80 uppercase tracking-wider">Hint</p>
                        </div>
                        <p className="text-xs text-white/50">{mission.objectiveHint}</p>
                    </div>

                    <div className="text-center pt-2">
                        <p className="text-xs text-white/30 mb-1">Reward</p>
                        <p className="text-lg font-black text-yellow-400">+{mission.xpReward} XP</p>
                    </div>
                </div>

                {/* Start button */}
                <div className="px-6 pb-6">
                    <button
                        onClick={onStart}
                        className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(0,224,255,0.3)] text-lg"
                    >
                        Start Mission <ChevronRight size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
}
