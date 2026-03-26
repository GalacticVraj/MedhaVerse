"use client";
import { StoryMission } from "@/lib/storyEngine";
import { BookOpen, ChevronRight } from "lucide-react";

interface InsightScreenProps {
    mission: StoryMission;
    isLast: boolean;
    onNext: () => void;
}

export default function InsightScreen({ mission, isLast, onNext }: InsightScreenProps) {
    return (
        <div className="fixed inset-0 z-[85] flex items-center justify-center">
            <div className="absolute inset-0 backdrop-blur-sm" style={{ background: "rgba(6,26,18,0.75)" }} />
            <div className="relative z-10 w-[90vw] max-w-[480px] card-midnight">
                {/* Header */}
                <div className="card-header-midnight">
                    <div className="flex items-center gap-2 mb-1">
                        <BookOpen size={16} style={{ color: "#F7F4D5" }} />
                        <p className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: "#839958" }}>Engineering Insight</p>
                    </div>
                    <h2 className="title-bubble-white text-xl">{mission.insightTitle}</h2>
                </div>

                {/* Body */}
                <div className="card-body space-y-4">
                    <div className="card-item">
                        <p className="text-sm leading-relaxed text-on-beige">{mission.insightText}</p>
                    </div>

                    <p className="text-xs text-center text-on-beige-muted">
                        💡 Real engineers use these concepts every day to keep cities running!
                    </p>

                    <div className={`btn-game-wrap w-full ${isLast ? "btn-game-wrap-green" : "btn-game-wrap-blue"}`}>
                        <button onClick={onNext} className={`btn-game w-full justify-center !text-base !py-3 ${isLast ? "btn-green" : "btn-blue"}`}>
                            {isLast ? (
                                <><span>🏆</span> Free Play Mode</>
                            ) : (
                                <>Next Mission <ChevronRight size={18} /></>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
