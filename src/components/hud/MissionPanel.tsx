"use client";
import { Trophy, Target, Star, BookOpen } from "lucide-react";

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
        <div className="absolute left-4 top-16 bottom-16 w-[340px] card flex flex-col z-50 pointer-events-auto animate-in slide-in-from-left">
            {/* Header */}
            <div className="card-header flex justify-between items-center">
                <div>
                    <h2 className="title-bubble-white text-xl">🎯 Missions</h2>
                    <p className="text-xs font-medium mt-0.5" style={{ color: "#839958" }}>Level {level} Engineer</p>
                </div>
                <button onClick={onClose} className="text-xl font-bold p-1.5 rounded-xl transition-colors hover:bg-white/10" style={{ color: "rgba(247,244,213,0.5)" }}>✕</button>
            </div>

            {/* XP bar — still on dark header area */}
            <div className="px-5 pt-4 pb-2" style={{ background: "#0A3323", borderBottom: "2px solid #839958" }}>
                <div className="card-item flex justify-between items-center mb-2">
                    <span className="text-xs font-bold flex items-center gap-1" style={{ color: "#F7F4D5" }}>
                        <Star size={12} style={{ color: "#D3968C" }} /> Score
                    </span>
                    <span className="text-sm font-black" style={{ color: "#D3968C" }}>{score} XP</span>
                </div>
                <div className="w-full h-2.5 rounded-full overflow-hidden" style={{ background: "rgba(247,244,213,0.15)" }}>
                    <div className="h-full rounded-full transition-all" style={{
                        width: `${(score % 500) / 5}%`,
                        background: "linear-gradient(90deg, #839958, #D3968C)"
                    }} />
                </div>
                <p className="text-[10px] mt-1" style={{ color: "rgba(247,244,213,0.4)" }}>{500 - (score % 500)} XP to next level</p>
            </div>

            {/* Missions list — beige body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ background: "#F7F4D5" }}>
                <h3 className="text-xs font-bold uppercase tracking-widest flex items-center gap-2 text-on-beige-muted">
                    <Target size={12} className="text-moss" /> Active Challenges
                </h3>

                {missions.map((m) => (
                    <div key={m.id} className={m.completed ? "card-item" : "card-item"} style={{
                        background: m.completed ? "rgba(131,153,88,0.18)" : "rgba(10,51,35,0.06)",
                        border: m.completed ? "1.5px solid rgba(131,153,88,0.5)" : "1.5px solid rgba(10,51,35,0.2)"
                    }}>
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <h4 className="text-sm font-bold" style={{ color: m.completed ? "#5a6b38" : "#0A3323" }}>
                                    {m.completed ? "✅" : "🔲"} {m.title}
                                </h4>
                                <p className="text-xs mt-1 text-on-beige-muted">{m.description}</p>
                                <p className="text-xs mt-1 font-mono text-moss">{m.target}</p>
                            </div>
                            <span className="text-xs font-bold px-2 py-1 rounded-lg ml-2 whitespace-nowrap" style={{
                                background: m.completed ? "rgba(131,153,88,0.25)" : "rgba(211,150,140,0.2)",
                                color: m.completed ? "#5a6b38" : "#9e6459"
                            }}>+{m.xp} XP</span>
                        </div>
                    </div>
                ))}

                <h3 className="text-xs font-bold uppercase tracking-widest flex items-center gap-2 mt-6 pt-4 text-on-beige-muted"
                    style={{ borderTop: "1.5px solid rgba(10,51,35,0.15)" }}>
                    <BookOpen size={12} className="text-midnight" /> Engineering Insights
                </h3>

                {LEARN_FACTS.map((fact, i) => (
                    <div key={i} className="card-item-midnight">
                        <div className="flex items-start gap-3">
                            <span className="text-xl">{fact.icon}</span>
                            <div>
                                <h4 className="text-sm font-bold text-midnight">{fact.title}</h4>
                                <p className="text-xs leading-relaxed mt-1 text-on-beige-muted">{fact.fact}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
