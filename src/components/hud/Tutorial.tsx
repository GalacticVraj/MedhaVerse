"use client";
import { useState, useEffect } from "react";
import { ArrowRight, MousePointer, RotateCcw, Zap, Target, ShieldAlert, Lightbulb, Sparkles, X } from "lucide-react";

interface TutorialStep {
    title: string;
    description: string;
    icon: React.ReactNode;
    action: string;
    position: "center" | "top-left" | "top-right" | "bottom-left" | "bottom-right" | "center-top";
}

const STEPS: TutorialStep[] = [
    {
        title: "Welcome to MedhaVerse! 🏙️",
        description: "You're a Traffic Engineer in a smart city. Your job is to manage traffic signals, respond to emergencies, and keep the city flowing! Let's learn how.",
        icon: <Sparkles size={24} className="text-yellow-400" />,
        action: "Let's Start! →",
        position: "center",
    },
    {
        title: "Navigate the City 🖱️",
        description: "You're looking at a 3D city! Use your mouse to explore:\n\n• Left-click + Drag → Rotate the camera\n• Scroll wheel → Zoom in/out\n• Right-click + Drag → Pan around\n\nTry moving around now!",
        icon: <MousePointer size={24} className="text-cyan-400" />,
        action: "Got it! →",
        position: "center",
    },
    {
        title: "Traffic Signals 🚦",
        description: "See the glowing traffic lights? They automatically cycle: GREEN → YELLOW → RED.\n\nClick on any traffic signal in the 3D world to open the Signal Control Panel. You can change how long each color lasts!",
        icon: <Zap size={24} className="text-green-400" />,
        action: "Cool! →",
        position: "center-top",
    },
    {
        title: "Rush Hour Mode ⚡",
        description: "Click the 'Rush Hour' button in the top-left to flood the streets with cars! Watch what happens when too many vehicles hit the road. Can you adjust the signals to prevent gridlock?",
        icon: <Zap size={24} className="text-orange-400" />,
        action: "Interesting! →",
        position: "top-left",
    },
    {
        title: "Emergency Response 🚨",
        description: "Click the '🚨 Emergency' button to dispatch an ambulance! In real cities, smart systems give emergency vehicles priority by turning signals green. Watch the flashing lights zoom through!",
        icon: <ShieldAlert size={24} className="text-red-400" />,
        action: "Awesome! →",
        position: "top-right",
    },
    {
        title: "Missions & Learning 🎯",
        description: "Click 'Missions' to see your challenges! Complete them to earn XP and level up. Each mission teaches you something real engineers actually do. You'll also find Engineering Insights — real facts about traffic science!",
        icon: <Target size={24} className="text-purple-400" />,
        action: "Let's Go! →",
        position: "top-left",
    },
    {
        title: "The Engineering Loop 🔄",
        description: "Real engineers follow this loop:\n\n1️⃣ OBSERVE — Watch traffic flow\n2️⃣ HYPOTHESIZE — \"What if I extend green?\"\n3️⃣ EXPERIMENT — Change signal timings\n4️⃣ EVALUATE — Check the health bar\n5️⃣ IMPROVE — Tweak until optimal!\n\nYou're now a Traffic Engineer. Build your city! 🏗️",
        icon: <Lightbulb size={24} className="text-yellow-400" />,
        action: "🚀 Start Engineering!",
        position: "center",
    },
];

interface TutorialProps {
    onComplete: () => void;
}

export default function Tutorial({ onComplete }: TutorialProps) {
    const [step, setStep] = useState(0);
    const [visible, setVisible] = useState(true);

    const currentStep = STEPS[step];
    const isLast = step === STEPS.length - 1;
    const progress = ((step + 1) / STEPS.length) * 100;

    const handleNext = () => {
        if (isLast) {
            setVisible(false);
            onComplete();
        } else {
            setStep(s => s + 1);
        }
    };

    const handleSkip = () => {
        setVisible(false);
        onComplete();
    };

    if (!visible) return null;

    const positionClasses: Record<string, string> = {
        "center": "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
        "center-top": "top-24 left-1/2 -translate-x-1/2",
        "top-left": "top-20 left-4",
        "top-right": "top-20 right-4",
        "bottom-left": "bottom-20 left-4",
        "bottom-right": "bottom-20 right-4",
    };

    return (
        <div className="fixed inset-0 z-[100]">
            {/* Translucent overlay - 3D world visible behind */}
            <div className="absolute inset-0 bg-black/40" />

            {/* Progress bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-white/10 z-[101]">
                <div
                    className="h-full bg-gradient-to-r from-cyan-400 to-purple-500 transition-all duration-500"
                    style={{ width: `${progress}%` }}
                />
            </div>

            {/* Tutorial card */}
            <div className={`absolute ${positionClasses[currentStep.position]} z-[101] w-[90vw] max-w-[440px] pointer-events-auto`}>
                <div className="bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-2xl rounded-3xl border border-cyan-500/30 shadow-[0_0_80px_rgba(0,224,255,0.15)] overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 px-6 py-5 border-b border-white/10">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                                    {currentStep.icon}
                                </div>
                                <div>
                                    <h2 className="text-lg font-black text-white">{currentStep.title}</h2>
                                    <p className="text-[11px] text-white/30 font-mono">Step {step + 1} of {STEPS.length}</p>
                                </div>
                            </div>
                            <button onClick={handleSkip} className="text-white/30 hover:text-white/60 transition-colors p-1">
                                <X size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Body */}
                    <div className="px-6 py-5">
                        <p className="text-sm text-white/80 leading-relaxed whitespace-pre-line">{currentStep.description}</p>
                    </div>

                    {/* Footer */}
                    <div className="px-6 py-4 border-t border-white/10 flex items-center justify-between">
                        <button
                            onClick={handleSkip}
                            className="text-xs text-white/30 hover:text-white/60 transition-colors font-medium"
                        >
                            Skip Tutorial
                        </button>
                        <button
                            onClick={handleNext}
                            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold px-6 py-2.5 rounded-xl transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(0,224,255,0.3)] text-sm"
                        >
                            {currentStep.action}
                            {!isLast && <ArrowRight size={16} />}
                        </button>
                    </div>

                    {/* Step dots */}
                    <div className="px-6 pb-4 flex justify-center gap-2">
                        {STEPS.map((_, i) => (
                            <div
                                key={i}
                                className={`h-1.5 rounded-full transition-all duration-300 ${i === step ? "w-6 bg-cyan-400" : i < step ? "w-1.5 bg-cyan-400/60" : "w-1.5 bg-white/20"
                                    }`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
