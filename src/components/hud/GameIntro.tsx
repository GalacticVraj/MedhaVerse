"use client";
import { useState, useEffect } from "react";
import { Zap, ChevronRight } from "lucide-react";

interface GameIntroProps {
    onComplete: () => void;
}

const SCENES = [
    {
        title: "MEDHA CITY",
        subtitle: "// NEURAL NETWORK STATUS: ONLINE",
        description: "The world's most advanced smart city. Powered by AI traffic systems, IoT sensor networks, and intelligent infrastructure that never sleeps.",
        bg: "from-indigo-950 via-slate-900 to-black",
        accent: "#00E0FF",
        icon: "🌆",
        overlay: "SYSTEM BOOT SEQUENCE... ██████████ 100%",
    },
    {
        title: "⚠ CRITICAL ALERT",
        subtitle: "// TRAFFIC CONTROL NEXUS: MALFUNCTION DETECTED",
        description: "Critical failure in the city's traffic control AI. Signal coordination lost. Emergency routes compromised. Congestion cascading across all sectors.",
        bg: "from-red-950 via-slate-900 to-black",
        accent: "#FF3366",
        icon: "🔴",
        overlay: "WARNING: SYSTEM INTEGRITY AT 23%",
    },
    {
        title: "INCOMING SIGNAL",
        subtitle: "// SOURCE: SPARK AI DRONE [ID: 7X-ALPHA]",
        description: "\"Engineer! I'm SPARK, your AI assistant. Medha City's traffic brain — NEXUS — is malfunctioning. The streets are chaos. Emergency vehicles can't get through. We need YOU to take manual control!\"",
        bg: "from-cyan-950 via-slate-900 to-black",
        accent: "#00E0FF",
        icon: "🤖",
        overlay: "DRONE LINK ESTABLISHED ▮▮▮▮▮▮▮▮",
    },
    {
        title: "JUNIOR CITY ENGINEER",
        subtitle: "// CLASSIFICATION: LEVEL-5 CLEARANCE GRANTED",
        description: "You now have direct control over Medha City's traffic signal network. Manage intersections. Clear emergency routes. Restore order. The city is counting on you.",
        bg: "from-emerald-950 via-slate-900 to-black",
        accent: "#00E676",
        icon: "🧑‍🚀",
        overlay: "ENGINEER PROFILE: ACTIVATED ████████",
    },
];

export default function GameIntro({ onComplete }: GameIntroProps) {
    const [scene, setScene] = useState(0);
    const [visible, setVisible] = useState(true);
    const [fadeIn, setFadeIn] = useState(false);
    const [showScanline, setShowScanline] = useState(true);
    const [glitchActive, setGlitchActive] = useState(false);
    const [typedOverlay, setTypedOverlay] = useState("");

    useEffect(() => {
        setTimeout(() => setFadeIn(true), 200);
    }, []);

    // Scanline & glitch effects
    useEffect(() => {
        const glitchInterval = setInterval(() => {
            setGlitchActive(true);
            setTimeout(() => setGlitchActive(false), 150);
        }, 3000 + Math.random() * 2000);
        return () => clearInterval(glitchInterval);
    }, []);

    // Scene transitions
    useEffect(() => {
        setFadeIn(false);
        setTypedOverlay("");
        const t1 = setTimeout(() => setFadeIn(true), 200);

        // Type overlay text
        const overlay = SCENES[scene].overlay;
        let i = 0;
        const t2 = setInterval(() => {
            i++;
            setTypedOverlay(overlay.slice(0, i));
            if (i >= overlay.length) clearInterval(t2);
        }, 30);

        return () => { clearTimeout(t1); clearInterval(t2); };
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
        <div className="fixed inset-0 z-[90] flex items-center justify-center cursor-pointer" onClick={handleNext}>
            {/* Full background */}
            <div className={`absolute inset-0 bg-gradient-to-br ${s.bg} transition-all duration-1000`} />

            {/* Scanlines overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
                style={{
                    backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.05) 2px, rgba(255,255,255,0.05) 4px)",
                }}
            />

            {/* Grid background */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.04]"
                style={{
                    backgroundImage: `linear-gradient(${s.accent}22 1px, transparent 1px), linear-gradient(90deg, ${s.accent}22 1px, transparent 1px)`,
                    backgroundSize: "60px 60px",
                }}
            />

            {/* Glitch effect */}
            {glitchActive && (
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute inset-0" style={{
                        background: `linear-gradient(transparent 40%, ${s.accent}11 40%, ${s.accent}11 40.5%, transparent 40.5%)`,
                        transform: "translateX(5px)",
                    }} />
                </div>
            )}

            {/* Ambient particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {Array.from({ length: 30 }).map((_, i) => (
                    <div
                        key={i}
                        className="absolute rounded-full animate-pulse"
                        style={{
                            left: `${(i * 37 + 13) % 100}%`,
                            top: `${(i * 53 + 7) % 100}%`,
                            width: `${1 + (i % 3)}px`,
                            height: `${1 + (i % 3)}px`,
                            background: s.accent,
                            opacity: 0.3,
                            animationDelay: `${(i * 200) % 3000}ms`,
                            animationDuration: `${2000 + (i * 500) % 3000}ms`,
                        }}
                    />
                ))}
            </div>

            {/* Content */}
            <div className={`relative z-10 text-center max-w-2xl px-8 transition-all duration-700 ${fadeIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}>

                {/* System overlay text */}
                <div className="mb-8">
                    <p className="text-xs font-mono tracking-[0.5em] opacity-40" style={{ color: s.accent }}>
                        {typedOverlay}<span className="animate-pulse">▊</span>
                    </p>
                </div>

                {/* Icon */}
                <div className="text-7xl mb-6 drop-shadow-2xl" style={{ filter: `drop-shadow(0 0 20px ${s.accent}40)` }}>
                    {s.icon}
                </div>

                {/* Title with glow */}
                <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-3 drop-shadow-2xl"
                    style={{ color: s.accent, textShadow: `0 0 40px ${s.accent}40` }}>
                    {s.title}
                </h1>

                {/* Subtitle — monospace codestyle */}
                <p className="text-xs font-mono uppercase tracking-[0.3em] mb-8 opacity-40" style={{ color: s.accent }}>
                    {s.subtitle}
                </p>

                {/* Divider line */}
                <div className="w-24 h-[2px] mx-auto mb-8 rounded-full" style={{ background: `linear-gradient(90deg, transparent, ${s.accent}, transparent)` }} />

                {/* Description */}
                <p className="text-base md:text-lg text-white/70 leading-relaxed mb-12 max-w-lg mx-auto">
                    {s.description}
                </p>

                {/* Button */}
                <button
                    onClick={(e) => { e.stopPropagation(); handleNext(); }}
                    className="group relative px-10 py-4 rounded-2xl font-black text-base transition-all duration-300 overflow-hidden"
                    style={{
                        background: `linear-gradient(135deg, ${s.accent}30, ${s.accent}10)`,
                        border: `1px solid ${s.accent}50`,
                        color: s.accent,
                        boxShadow: `0 0 30px ${s.accent}20`,
                    }}
                >
                    <span className="relative z-10 flex items-center gap-2 justify-center">
                        {scene === SCENES.length - 1 ? (
                            <><Zap size={20} /> INITIALIZE CONTROL</>
                        ) : (
                            <>CONTINUE <ChevronRight size={18} /></>
                        )}
                    </span>
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ background: `linear-gradient(135deg, ${s.accent}20, ${s.accent}05)` }} />
                </button>

                {/* Progress */}
                <div className="flex justify-center gap-3 mt-8">
                    {SCENES.map((_, i) => (
                        <div key={i} className="relative">
                            <div
                                className={`h-1 rounded-full transition-all duration-500`}
                                style={{
                                    width: i === scene ? 32 : 8,
                                    background: i <= scene ? s.accent : "rgba(255,255,255,0.1)",
                                    boxShadow: i === scene ? `0 0 10px ${s.accent}60` : "none",
                                }}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Skip */}
            <button
                onClick={(e) => { e.stopPropagation(); setVisible(false); onComplete(); }}
                className="absolute top-6 right-8 text-white/15 hover:text-white/40 text-xs font-mono transition-colors z-20 tracking-wider"
            >
                [SKIP] →
            </button>

            {/* Corner decorations */}
            <div className="absolute top-4 left-4 w-12 h-12 border-l-2 border-t-2 opacity-20 rounded-tl-lg" style={{ borderColor: s.accent }} />
            <div className="absolute bottom-4 right-4 w-12 h-12 border-r-2 border-b-2 opacity-20 rounded-br-lg" style={{ borderColor: s.accent }} />
        </div>
    );
}
