"use client";
import { StoryMission, STORY_MISSIONS } from "@/lib/storyEngine";
import { BookOpen, ChevronRight } from "lucide-react";

interface InsightScreenProps {
    mission: StoryMission;
    isLast: boolean;
    onNext: () => void;
}

export default function InsightScreen({ mission, isLast, onNext }: InsightScreenProps) {
    return (
        <div className="fixed inset-0 z-[85] flex items-center justify-center">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <div className="relative z-10 w-[90vw] max-w-[480px] bg-gradient-to-br from-slate-900/95 to-slate-800/95 rounded-3xl border border-emerald-500/30 shadow-[0_0_60px_rgba(0,200,100,0.12)] overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-emerald-500/15 to-teal-500/15 px-6 py-5 border-b border-white/10">
                    <div className="flex items-center gap-2 mb-1">
                        <BookOpen size={18} className="text-emerald-400" />
                        <p className="text-xs font-bold text-emerald-400 uppercase tracking-[0.2em]">Engineering Insight</p>
                    </div>
                    <h2 className="text-lg font-black text-white">{mission.insightTitle}</h2>
                </div>

                {/* Insight content */}
                <div className="px-6 py-6">
                    <div className="bg-emerald-500/5 rounded-2xl p-5 border border-emerald-500/15">
                        <p className="text-sm text-white/80 leading-relaxed">{mission.insightText}</p>
                    </div>

                    <div className="mt-4 text-center">
                        <p className="text-xs text-white/30">
                            💡 Real engineers use these concepts every day to keep cities running!
                        </p>
                    </div>
                </div>

                {/* Next button */}
                <div className="px-6 pb-6">
                    <button
                        onClick={onNext}
                        className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(0,200,100,0.2)] text-lg"
                    >
                        {isLast ? (
                            <><span>🏆</span> Free Play Mode</>
                        ) : (
                            <>Next Mission <ChevronRight size={20} /></>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
