"use client";
import { useState, useEffect } from "react";
import { Zap, ChevronRight } from "lucide-react";

interface GameIntroProps {
    onComplete: () => void;
}

const SCENES = [
    {
        image: "/scenes/city.png",
        title: "MEDHA CITY",
        subtitle: "// NEURAL NETWORK STATUS: ONLINE",
        description: "The world's most advanced smart city. Powered by AI traffic systems, IoT sensor networks, and intelligent infrastructure that never sleeps.",
        accent: "#00E0FF",
        overlayText: "SYSTEM BOOT SEQUENCE... ██████████ 100%",
        position: "bottom" as const,
    },
    {
        image: "/scenes/crisis.png",
        title: "⚠ CRITICAL ALERT",
        subtitle: "// TRAFFIC CONTROL NEXUS: MALFUNCTION DETECTED",
        description: "Signal coordination lost. Emergency routes compromised. Congestion cascading across all sectors. The city needs help.",
        accent: "#FF3366",
        overlayText: "WARNING: SYSTEM INTEGRITY AT 23%",
        position: "bottom" as const,
    },
    {
        image: "/scenes/spark.png",
        title: "INCOMING SIGNAL",
        subtitle: "// SOURCE: SPARK AI DRONE [ID: 7X-ALPHA]",
        description: "\"Engineer! I'm SPARK, your AI assistant. The city's traffic brain is malfunctioning. Emergency vehicles can't get through. We need YOU to take control!\"",
        accent: "#00E0FF",
        overlayText: "DRONE LINK ESTABLISHED ▮▮▮▮▮▮▮▮",
        position: "bottom" as const,
    },
    {
        image: "/scenes/engineer.png",
        title: "JUNIOR CITY ENGINEER",
        subtitle: "// CLASSIFICATION: LEVEL-5 CLEARANCE GRANTED",
        description: "You now have direct control over Medha City's traffic signal network. Manage intersections. Clear emergency routes. Save the city.",
        accent: "#00E676",
        overlayText: "ENGINEER PROFILE: ACTIVATED ████████",
        position: "bottom" as const,
    },
];

export default function GameIntro({ onComplete }: GameIntroProps) {
    const [scene, setScene] = useState(0);
    const [visible, setVisible] = useState(true);
    const [fadeIn, setFadeIn] = useState(false);
    const [glitchActive, setGlitchActive] = useState(false);
    const [typedOverlay, setTypedOverlay] = useState("");
    const [imageLoaded, setImageLoaded] = useState(false);

    useEffect(() => { setTimeout(() => setFadeIn(true), 300); }, []);

    // Random glitch
    useEffect(() => {
        const id = setInterval(() => {
            setGlitchActive(true);
            setTimeout(() => setGlitchActive(false), 120);
        }, 2500 + Math.random() * 2000);
        return () => clearInterval(id);
    }, []);

    // Scene transition
    useEffect(() => {
        setFadeIn(false);
        setTypedOverlay("");
        setImageLoaded(false);
        const t1 = setTimeout(() => setFadeIn(true), 300);

        const overlay = SCENES[scene].overlayText;
        let i = 0;
        const t2 = setInterval(() => {
            i++;
            setTypedOverlay(overlay.slice(0, i));
            if (i >= overlay.length) clearInterval(t2);
        }, 25);

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
        <div className="fixed inset-0 z-[90] cursor-pointer overflow-hidden" onClick={handleNext}>
            {/* Full-screen scene image */}
            <div className="absolute inset-0">
                <img
                    src={s.image}
                    alt=""
                    onLoad={() => setImageLoaded(true)}
                    className={`w-full h-full object-cover transition-all duration-1000 ${fadeIn && imageLoaded ? "opacity-100 scale-100" : "opacity-0 scale-105"
                        }`}
                    style={{ filter: "brightness(0.5) contrast(1.1) saturate(1.2)" }}
                />
            </div>

            {/* Dark gradient from bottom for text readability */}
            <div className="absolute inset-0" style={{
                background: "linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.7) 35%, rgba(0,0,0,0.2) 60%, rgba(0,0,0,0.1) 100%)",
            }} />

            {/* Scanlines */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.04]"
                style={{
                    backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)",
                }}
            />

            {/* Grid lines */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
                style={{
                    backgroundImage: `linear-gradient(${s.accent}15 1px, transparent 1px), linear-gradient(90deg, ${s.accent}15 1px, transparent 1px)`,
                    backgroundSize: "80px 80px",
                }}
            />

            {/* Glitch effect */}
            {glitchActive && (
                <div className="absolute inset-0 pointer-events-none" style={{
                    background: `linear-gradient(transparent 30%, ${s.accent}08 30%, ${s.accent}08 30.3%, transparent 30.3%, transparent 60%, ${s.accent}08 60%, ${s.accent}08 60.3%, transparent 60.3%)`,
                    transform: `translateX(${Math.random() > 0.5 ? 3 : -3}px)`,
                }} />
            )}

            {/* Ambient particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {Array.from({ length: 20 }).map((_, i) => (
                    <div key={i} className="absolute rounded-full animate-pulse"
                        style={{
                            left: `${(i * 37 + 13) % 100}%`, top: `${(i * 53 + 7) % 100}%`,
                            width: `${1 + (i % 2)}px`, height: `${1 + (i % 2)}px`,
                            background: s.accent, opacity: 0.4,
                            animationDelay: `${(i * 300) % 3000}ms`,
                            animationDuration: `${2000 + (i * 500) % 2000}ms`,
                        }}
                    />
                ))}
            </div>

            {/* Corner brackets */}
            <div className="absolute top-6 left-6 w-16 h-16 border-l-2 border-t-2 opacity-20 rounded-tl-lg pointer-events-none" style={{ borderColor: s.accent }} />
            <div className="absolute top-6 right-6 w-16 h-16 border-r-2 border-t-2 opacity-20 rounded-tr-lg pointer-events-none" style={{ borderColor: s.accent }} />
            <div className="absolute bottom-6 left-6 w-16 h-16 border-l-2 border-b-2 opacity-20 rounded-bl-lg pointer-events-none" style={{ borderColor: s.accent }} />
            <div className="absolute bottom-6 right-6 w-16 h-16 border-r-2 border-b-2 opacity-20 rounded-br-lg pointer-events-none" style={{ borderColor: s.accent }} />

            {/* System overlay — top */}
            <div className={`absolute top-10 left-1/2 -translate-x-1/2 transition-all duration-700 ${fadeIn ? "opacity-100" : "opacity-0"
                }`}>
                <p className="text-[11px] font-mono tracking-[0.5em] text-center" style={{ color: `${s.accent}66` }}>
                    {typedOverlay}<span className="animate-pulse" style={{ color: s.accent }}>▊</span>
                </p>
            </div>

            {/* Main content — bottom third */}
            <div className={`absolute bottom-0 left-0 right-0 px-8 pb-10 transition-all duration-700 ${fadeIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}>
                <div className="max-w-2xl mx-auto">
                    {/* Scene number */}
                    <div className="flex items-center gap-3 mb-4">
                        <div className="h-[1px] flex-1" style={{ background: `linear-gradient(90deg, ${s.accent}40, transparent)` }} />
                        <p className="text-[10px] font-mono tracking-[0.4em]" style={{ color: `${s.accent}60` }}>
                            SCENE {scene + 1} / {SCENES.length}
                        </p>
                        <div className="h-[1px] flex-1" style={{ background: `linear-gradient(270deg, ${s.accent}40, transparent)` }} />
                    </div>

                    {/* Title */}
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2 text-center"
                        style={{ color: s.accent, textShadow: `0 0 60px ${s.accent}50, 0 0 120px ${s.accent}20` }}>
                        {s.title}
                    </h1>

                    {/* Subtitle */}
                    <p className="text-[11px] font-mono uppercase tracking-[0.25em] mb-6 text-center" style={{ color: `${s.accent}50` }}>
                        {s.subtitle}
                    </p>

                    {/* Description */}
                    <p className="text-sm md:text-base text-white/75 leading-relaxed mb-8 text-center max-w-lg mx-auto">
                        {s.description}
                    </p>

                    {/* Button */}
                    <div className="flex justify-center">
                        <button
                            onClick={(e) => { e.stopPropagation(); handleNext(); }}
                            className="group relative px-10 py-3.5 rounded-xl font-black text-sm transition-all duration-300 hover:scale-105"
                            style={{
                                background: `linear-gradient(135deg, ${s.accent}25, ${s.accent}10)`,
                                border: `1px solid ${s.accent}40`,
                                color: s.accent,
                                boxShadow: `0 0 40px ${s.accent}15`,
                            }}
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                {scene === SCENES.length - 1 ? (
                                    <><Zap size={18} /> INITIALIZE CONTROL</>
                                ) : (
                                    <>CONTINUE <ChevronRight size={16} /></>
                                )}
                            </span>
                        </button>
                    </div>

                    {/* Progress bar */}
                    <div className="flex justify-center gap-2 mt-6">
                        {SCENES.map((_, i) => (
                            <div key={i}
                                className="h-1 rounded-full transition-all duration-500"
                                style={{
                                    width: i === scene ? 32 : 8,
                                    background: i <= scene ? s.accent : "rgba(255,255,255,0.1)",
                                    boxShadow: i === scene ? `0 0 12px ${s.accent}80` : "none",
                                }}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Skip */}
            <button
                onClick={(e) => { e.stopPropagation(); setVisible(false); onComplete(); }}
                className="absolute top-8 right-8 text-white/10 hover:text-white/30 text-[11px] font-mono transition-colors z-20 tracking-widest"
            >
                [SKIP] →
            </button>
        </div>
    );
}
