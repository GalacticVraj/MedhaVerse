"use client";
import { StoryMission } from "@/lib/storyEngine";
import { Trophy, Lightbulb, Star } from "lucide-react";

interface MissionCompleteProps {
    mission: StoryMission;
    onInsight: () => void;
}

export default function MissionComplete({ mission, onInsight }: MissionCompleteProps) {
    return (
        <div className="fixed inset-0 z-[85] flex items-center justify-center">
            <div className="absolute inset-0 backdrop-blur-sm" style={{ background: "rgba(6,26,18,0.75)" }} />
            <div className="relative z-10 w-[90vw] max-w-[440px] card-rosy">
                {/* Header */}
                <div className="card-header-rosy text-center">
                    <div className="flex justify-center gap-1 mb-2">
                        {[...Array(3)].map((_, i) => (
                            <Star key={i} size={22} style={{ color: "#D3968C", fill: "#D3968C" }} />
                        ))}
                    </div>
                    <h2 className="title-bubble-white text-2xl">Mission Complete!</h2>
                    <p className="text-sm mt-1" style={{ color: "#839958" }}>{mission.icon} {mission.title}</p>
                </div>

                {/* Body — beige */}
                <div className="card-body space-y-4">
                    {/* SPARK */}
                    <div className="card-item-midnight">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: "rgba(16,86,102,0.15)" }}>
                                <span className="text-xs">🤖</span>
                            </div>
                            <p className="text-xs font-bold text-midnight">SPARK says:</p>
                        </div>
                        <p className="text-sm italic text-on-beige">&ldquo;{mission.sparkCelebration}&rdquo;</p>
                    </div>

                    {/* XP */}
                    <div className="text-center">
                        <div className="inline-flex items-center gap-2 rounded-full px-6 py-2" style={{
                            background: "rgba(211,150,140,0.2)",
                            border: "2px solid #D3968C"
                        }}>
                            <Trophy size={16} style={{ color: "#9e6459" }} />
                            <span className="text-lg font-black" style={{ color: "#9e6459" }}>+{mission.xpReward} XP</span>
                        </div>
                    </div>

                    {/* Button */}
                    <div className="btn-game-wrap btn-game-wrap-green w-full">
                        <button onClick={onInsight} className="btn-game btn-green w-full justify-center !text-base !py-3">
                            <Lightbulb size={18} /> What Did I Learn?
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
