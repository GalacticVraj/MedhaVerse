"use client";
import { useState, useEffect } from "react";
import { Sparkles, Zap, ChevronRight } from "lucide-react";

interface GameIntroProps {
    onComplete: () => void;
}

const SCENES = [
    {
        title: "MEDHA CITY",
        subtitle: "A Smart City Powered by Intelligent Systems",
        description: "Welcome to the most advanced city in the world...",
        bg: "from-indigo-900/95 to-slate-900/95",
        icon: "🌆",
    },
    {
        title: "SYSTEMS FAILING",
        subtitle: "Traffic Control Malfunctions Detected",
        description: "But something is wrong. The city's automated traffic systems are malfunctioning. Congestion is building. Emergency routes are blocked.",
        bg: "from-red-900/90 to-slate-900/95",
        icon: "⚠️",
    },
    {
        title: "YOU ARE NEEDED",
        subtitle: "Incoming Transmission from SPARK AI Drone",
        description: "\"Engineer! Medha City needs your help! Traffic control systems are failing, and emergency routes are blocked! You're our only hope!\"",
        bg: "from-cyan-900/90 to-slate-900/95",
        icon: "🤖",
    },
    {
        title: "JUNIOR CITY ENGINEER",
        subtitle: "Your Mission Begins Now",
        description: "You've been recruited to stabilize the city. Manage smart traffic signals. Clear emergency routes. Save Medha City.",
        bg: "from-emerald-900/90 to-slate-900/95",
        icon: "🧑‍🚀",
    },
];

export default function GameIntro({ onComplete }: GameIntroProps) {
    const [scene, setScene] = useState(0);
    const [visible, setVisible] = useState(true);
    const [fadeIn, setFadeIn] = useState(false);

    useEffect(() => {
        setTimeout(() => setFadeIn(true), 100);
    }, []);

    useEffect(() => {
        setFadeIn(false);
        const t = setTimeout(() => setFadeIn(true), 100);
        return () => clearTimeout(t);
    }, [scene]);

    const handleNext = () => {
        if (scene === SCENES.length - 1) {
            setVisible(false);
            onComplete();
        } else {
            setScene(s => s + 1);
        }
    };

    if (!visible) return null;
    const s = SCENES[scene];

    return (
        <div className="fixed inset-0 z-[90] flex items-center justify-center" onClick={handleNext}>
            {/* Background */}
            <div className={`absolute inset-0 bg-gradient-to-br ${s.bg} backdrop-blur-md transition-all duration-700`} />

            {/* Ambient particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {Array.from({ length: 20 }).map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-1 h-1 bg-cyan-400/30 rounded-full animate-pulse"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 3}s`,
                            animationDuration: `${2 + Math.random() * 3}s`,
                        }}
                    />
                ))}
            </div>

            {/* Content */}
            <div
                className={`relative z-10 text-center max-w-lg px-8 transition-all duration-700 ${fadeIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                    }`}
            >
                <div className="text-6xl mb-6">{s.icon}</div>
                <h1 className="text-4xl font-black text-white tracking-tight mb-2 drop-shadow-2xl">
                    {s.title}
                </h1>
                <p className="text-sm font-mono text-cyan-300/60 uppercase tracking-[0.3em] mb-6">
                    {s.subtitle}
                </p>
                <p className="text-lg text-white/70 leading-relaxed mb-10">
                    {s.description}
                </p>

                <button
                    onClick={(e) => { e.stopPropagation(); handleNext(); }}
                    className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold px-8 py-3 rounded-2xl transition-all flex items-center gap-2 mx-auto shadow-[0_0_30px_rgba(0,224,255,0.3)]"
                >
                    {scene === SCENES.length - 1 ? (
                        <>
                            <Zap size={18} /> Begin Engineering
                        </>
                    ) : (
                        <>
                            Continue <ChevronRight size={18} />
                        </>
                    )}
                </button>

                {/* Progress dots */}
                <div className="flex justify-center gap-2 mt-6">
                    {SCENES.map((_, i) => (
                        <div
                            key={i}
                            className={`h-1.5 rounded-full transition-all duration-300 ${i === scene ? "w-8 bg-cyan-400" : i < scene ? "w-2 bg-cyan-400/60" : "w-2 bg-white/20"
                                }`}
                        />
                    ))}
                </div>
            </div>

            {/* Skip */}
            <button
                onClick={(e) => { e.stopPropagation(); setVisible(false); onComplete(); }}
                className="absolute top-6 right-6 text-white/20 hover:text-white/50 text-xs font-medium transition-colors z-20"
            >
                Skip Intro →
            </button>
        </div>
    );
}
