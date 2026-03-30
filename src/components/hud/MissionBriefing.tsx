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
        <div className="fixed inset-0 z-[85] flex items-center justify-center font-mono">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

            {/* Retro 8-bit Container */}
            <div className="relative z-10 w-[90vw] max-w-[500px] bg-[#6ECDEF] border-4 border-white/90 shadow-[8px_8px_0_0_rgba(0,0,0,1)] rounded-sm overflow-hidden flex flex-col items-center p-6 text-center">
                
                {/* 8-bit Decorations */}
                <div className="absolute top-3 right-4 flex gap-1 text-red-500 text-xl drop-shadow-[1px_1px_0_#991b1b]">
                    <span>❤️</span><span>❤️</span><span>❤️</span>
                </div>
                <div className="absolute top-8 left-4 text-white text-5xl opacity-90 drop-shadow-sm">☁️</div>
                <div className="absolute top-16 right-8 text-white text-4xl opacity-80 drop-shadow-sm">☁️</div>
                <div className="absolute bottom-[80px] left-2 text-4xl drop-shadow-[2px_2px_0_rgba(0,0,0,0.3)] z-0">🌳</div>
                <div className="absolute bottom-[90px] right-2 text-5xl drop-shadow-[2px_2px_0_rgba(0,0,0,0.3)] z-0">🌳</div>

                {/* Pixel Ground Layer */}
                <div className="absolute bottom-0 left-0 right-0 h-6 flex z-0">
                    {Array.from({ length: 15 }).map((_, i) => (
                        <div key={`ground-${i}`} className={`h-full flex-1 ${i % 2 === 0 ? 'bg-[#8B5A2B]' : 'bg-[#A0522D]'}`}></div>
                    ))}
                </div>
                <div className="absolute bottom-6 left-0 right-0 h-4 flex z-0 border-t-2 border-[#548E28]">
                    {Array.from({ length: 30 }).map((_, i) => (
                        <div key={`grass-${i}`} className={`h-full flex-1 ${i % 2 === 0 ? 'bg-[#71C837]' : 'bg-[#548E28]'}`}></div>
                    ))}
                </div>

                {/* Header Section */}
                <div className="w-full relative z-10 mt-2 mb-4">
                    <p className="text-sm text-white font-bold tracking-widest drop-shadow-[2px_2px_0_rgba(0,0,0,0.4)]">
                        Mission {missionNumber} of {totalMissions}...
                    </p>
                    <div className="flex flex-col items-center mt-2">
                        <div className="text-4xl drop-shadow-[2px_2px_0_rgba(0,0,0,0.5)] mb-1">{mission.icon}</div>
                        <h2 className="text-[2.2rem] sm:text-5xl font-black text-[#FCE138] uppercase tracking-tighter drop-shadow-[4px_4px_0_#CD7F32] mt-1 leading-[1.1]">
                            {mission.title}
                        </h2>
                    </div>
                </div>

                {/* Content Boxes */}
                <div className="w-full relative z-10 flex flex-col gap-3 mt-4 mb-2">
                    <div className="bg-black/60 border-2 border-white/80 p-4 rounded-sm text-left shadow-[4px_4px_0_0_rgba(0,0,0,0.5)] backdrop-blur-sm">
                        <div className="flex items-center gap-2 mb-2">
                            <Target size={18} className="text-[#38BDF8]" strokeWidth={3} />
                            <p className="text-sm font-black text-[#38BDF8] uppercase tracking-widest">Target</p>
                        </div>
                        <p className="text-sm font-bold text-white leading-relaxed">{mission.objective}</p>
                    </div>

                    <div className="bg-black/60 border-2 border-white/80 p-4 rounded-sm text-left shadow-[4px_4px_0_0_rgba(0,0,0,0.5)] backdrop-blur-sm">
                        <div className="flex items-center gap-2 mb-2">
                            <Lightbulb size={18} className="text-[#FCE138]" strokeWidth={3} />
                            <p className="text-sm font-black text-[#FCE138] uppercase tracking-widest">Hint</p>
                        </div>
                        <p className="text-xs font-bold text-white/90 leading-relaxed">{mission.objectiveHint}</p>
                    </div>
                    
                    <div className="text-center py-2 relative">
                        <span className="absolute left-6 top-1/2 -translate-y-1/2 text-3xl animate-bounce drop-shadow-[2px_2px_0_rgba(0,0,0,0.4)]">🪙</span>
                        <span className="absolute right-6 top-1/2 -translate-y-1/2 text-3xl animate-bounce drop-shadow-[2px_2px_0_rgba(0,0,0,0.4)]" style={{ animationDelay: '0.2s' }}>🪙</span>
                        <p className="text-xs text-white uppercase font-bold drop-shadow-[2px_2px_0_rgba(0,0,0,0.5)] mb-1 tracking-widest">Reward</p>
                        <p className="text-2xl font-black text-[#FCE138] drop-shadow-[3px_3px_0_#b45309]">+{mission.xpReward} XP</p>
                    </div>
                </div>

                {/* Start Button */}
                <div className="w-full relative z-10 mt-2 mb-4">
                    <button
                        onClick={onStart}
                        className="w-full bg-[#fce138] hover:bg-[#F3C623] text-black font-black uppercase text-xl py-4 rounded-sm border-4 border-black border-b-[8px] active:border-b-4 active:translate-y-1 transition-all flex items-center justify-center gap-2 shadow-[2px_2px_0_0_rgba(255,255,255,0.5)_inset]"
                    >
                        START LEVEL <ChevronRight size={24} strokeWidth={4} />
                    </button>
                    <p className="text-xs text-white/90 mt-4 drop-shadow-[1px_1px_0_rgba(0,0,0,0.5)] font-bold">Press Start to Continue</p>
                </div>
            </div>
        </div>
    );
}
