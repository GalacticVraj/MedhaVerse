"use client";
import { Trophy, Target, Star, BookOpen, ArrowRight, Zap } from "lucide-react";

interface Mission {
    id: string;
    title: string;
    description: string;
    target: string;
    completed: boolean;
    xp: number;
}

interface MissionPanelProps {
    score: number;
    level: number;
    missions: Mission[];
    onClose: () => void;
}

const LEARN_FACTS = [
    { icon: "🚦", title: "Traffic Signals", fact: "The first electric traffic light was installed in Cleveland, Ohio in 1914. It only had red and green!" },
    { icon: "🚗", title: "Flow Rate", fact: "A single lane of road can handle about 1,800 vehicles per hour at optimal speed. Congestion drops this to under 500!" },
    { icon: "🏙️", title: "Smart Cities", fact: "Modern smart cities use AI and IoT sensors to adjust traffic signals in real-time, reducing commute times by up to 25%." },
    { icon: "🚑", title: "Emergency Priority", fact: "In smart traffic systems, emergency vehicles can trigger 'green waves' — turning all signals green along their route!" },
    { icon: "⏱️", title: "Cycle Time", fact: "The total time for a signal to go through all phases is called 'cycle time'. Typical cycles are 60-120 seconds." },
    { icon: "🔄", title: "Optimization", fact: "Traffic engineers use math called 'Webster's formula' to calculate the ideal green time for minimum delay." },
];

export default function MissionPanel({ score, level, missions, onClose }: MissionPanelProps) {
    return (
        <div className="absolute left-4 top-16 bottom-16 w-[340px] bg-black/80 backdrop-blur-2xl border border-purple-500/40 rounded-3xl shadow-[0_0_60px_rgba(147,51,234,0.15)] flex flex-col overflow-hidden z-50 pointer-events-auto animate-in slide-in-from-left">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 p-5 border-b border-white/10">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-lg font-black text-white tracking-tight">🎯 Missions</h2>
                        <p className="text-xs text-purple-300/60 font-medium mt-0.5">Level {level} Engineer</p>
                    </div>
                    <button onClick={onClose} className="text-white/40 hover:text-white transition-colors text-xl font-bold p-1.5 hover:bg-white/10 rounded-xl">✕</button>
                </div>

                {/* Score & XP bar */}
                <div className="mt-4 bg-white/5 rounded-xl p-3 border border-white/10">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold text-white/50 flex items-center gap-1"><Star size={12} className="text-yellow-400" /> Score</span>
                        <span className="text-sm font-black text-yellow-400">{score} XP</span>
                    </div>
                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full transition-all" style={{ width: `${(score % 500) / 5}%` }} />
                    </div>
                    <p className="text-[10px] text-white/30 mt-1">{500 - (score % 500)} XP to next level</p>
                </div>
            </div>

            {/* Missions List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest flex items-center gap-2"><Target size={12} /> Active Challenges</h3>

                {missions.map((m) => (
                    <div key={m.id} className={`rounded-2xl p-4 border transition-all ${m.completed ? 'bg-green-500/10 border-green-500/30' : 'bg-white/5 border-white/10 hover:border-purple-500/30'}`}>
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <h4 className={`text-sm font-bold ${m.completed ? 'text-green-400' : 'text-white'}`}>
                                    {m.completed ? '✅' : '🔲'} {m.title}
                                </h4>
                                <p className="text-xs text-white/40 mt-1">{m.description}</p>
                                <p className="text-xs text-purple-300/60 mt-1 font-mono">{m.target}</p>
                            </div>
                            <span className={`text-xs font-bold px-2 py-1 rounded-lg ${m.completed ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                                +{m.xp} XP
                            </span>
                        </div>
                    </div>
                ))}

                {/* Learn section */}
                <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest flex items-center gap-2 mt-6 pt-4 border-t border-white/10">
                    <BookOpen size={12} /> Engineering Insights
                </h3>

                {LEARN_FACTS.map((fact, i) => (
                    <div key={i} className="bg-blue-500/5 border border-blue-500/20 rounded-2xl p-4">
                        <div className="flex items-start gap-3">
                            <span className="text-xl">{fact.icon}</span>
                            <div>
                                <h4 className="text-sm font-bold text-blue-300">{fact.title}</h4>
                                <p className="text-xs text-white/50 leading-relaxed mt-1">{fact.fact}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
