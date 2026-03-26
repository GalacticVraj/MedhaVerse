"use client";
import { useState } from "react";
import { ArrowRight, MousePointer, RotateCcw, Zap, Target, ShieldAlert, Lightbulb, Sparkles, X } from "lucide-react";

interface TutorialStep {
    title: string;
    description: string;
    icon: React.ReactNode;
    action: string;
    position: "center" | "top-left" | "top-right" | "bottom-left" | "bottom-right" | "center-top";
}

const STEPS: TutorialStep[] = [
    { title: "Welcome to MedhaVerse! 🏙️", description: "You're a Traffic Engineer in a smart city. Your job is to manage traffic signals, respond to emergencies, and keep the city flowing! Let's learn how.", icon: <Sparkles size={24} style={{ color: "#D3968C" }} />, action: "Let's Start! →", position: "center" },
    { title: "Navigate the City 🖱️", description: "You're looking at a 3D city! Use your mouse to explore:\n\n• Left-click + Drag → Rotate the camera\n• Scroll wheel → Zoom in/out\n• Right-click + Drag → Pan around\n\nTry moving around now!", icon: <MousePointer size={24} style={{ color: "#105666" }} />, action: "Got it! →", position: "center" },
    { title: "Traffic Signals 🚦", description: "See the glowing traffic lights? They automatically cycle: GREEN → YELLOW → RED.\n\nClick on any traffic signal in the 3D world to open the Signal Control Panel. You can change how long each color lasts!", icon: <Zap size={24} style={{ color: "#839958" }} />, action: "Cool! →", position: "center-top" },
    { title: "Rush Hour Mode ⚡", description: "Click the 'Rush Hour' button in the top-left to flood the streets with cars! Watch what happens when too many vehicles hit the road. Can you adjust the signals to prevent gridlock?", icon: <Zap size={24} style={{ color: "#839958" }} />, action: "Interesting! →", position: "top-left" },
    { title: "Emergency Response 🚨", description: "Click the '🚨 Emergency' button to dispatch an ambulance! In real cities, smart systems give emergency vehicles priority by turning signals green. Watch the flashing lights zoom through!", icon: <ShieldAlert size={24} style={{ color: "#D3968C" }} />, action: "Awesome! →", position: "top-right" },
    { title: "Missions & Learning 🎯", description: "Click 'Missions' to see your challenges! Complete them to earn XP and level up. Each mission teaches you something real engineers actually do. You'll also find Engineering Insights — real facts about traffic science!", icon: <Target size={24} style={{ color: "#105666" }} />, action: "Let's Go! →", position: "top-left" },
    { title: "The Engineering Loop 🔄", description: "Real engineers follow this loop:\n\n1️⃣ OBSERVE — Watch traffic flow\n2️⃣ HYPOTHESIZE — \"What if I extend green?\"\n3️⃣ EXPERIMENT — Change signal timings\n4️⃣ EVALUATE — Check the health bar\n5️⃣ IMPROVE — Tweak until optimal!\n\nYou're now a Traffic Engineer. Build your city! 🏗️", icon: <Lightbulb size={24} style={{ color: "#D3968C" }} />, action: "🚀 Start Engineering!", position: "center" },
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
        if (isLast) { setVisible(false); onComplete(); }
        else setStep(s => s + 1);
    };
    const handleSkip = () => { setVisible(false); onComplete(); };

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
            <div className="absolute inset-0" style={{ background: "rgba(6,26,18,0.5)" }} />

            {/* Progress bar */}
            <div className="absolute top-0 left-0 right-0 h-1.5 z-[101]" style={{ background: "rgba(247,244,213,0.1)" }}>
                <div className="h-full transition-all duration-500" style={{ width: `${progress}%`, background: "linear-gradient(90deg, #839958, #D3968C)" }} />
            </div>

            {/* Tutorial card */}
            <div className={`absolute ${positionClasses[currentStep.position]} z-[101] w-[90vw] max-w-[440px] pointer-events-auto card`}>
                {/* Header */}
                <div className="card-header">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(247,244,213,0.1)" }}>
                                {currentStep.icon}
                            </div>
                            <div>
                                <h2 className="title-bubble-white text-lg">{currentStep.title}</h2>
                                <p className="text-[11px] font-mono" style={{ color: "#839958" }}>Step {step + 1} of {STEPS.length}</p>
                            </div>
                        </div>
                        <button onClick={handleSkip} className="p-1 transition-colors" style={{ color: "rgba(247,244,213,0.3)" }}>
                            <X size={18} />
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div className="card-body">
                    <p className="text-sm leading-relaxed whitespace-pre-line text-on-beige">{currentStep.description}</p>
                </div>

                {/* Footer */}
                <div className="px-5 pb-5 pt-2 flex items-center justify-between" style={{ background: "#F7F4D5" }}>
                    <button onClick={handleSkip} className="text-xs font-medium text-on-beige-muted hover:text-on-beige transition-colors">
                        Skip Tutorial
                    </button>
                    <div className={`btn-game-wrap ${isLast ? "btn-game-wrap-green" : "btn-game-wrap-blue"}`}>
                        <button onClick={handleNext} className={`btn-game ${isLast ? "btn-green" : "btn-blue"} !py-2 !text-sm`}>
                            {currentStep.action}
                            {!isLast && <ArrowRight size={15} />}
                        </button>
                    </div>
                </div>

                {/* Step dots */}
                <div className="px-5 pb-4 flex justify-center gap-2" style={{ background: "#F7F4D5" }}>
                    {STEPS.map((_, i) => (
                        <div key={i} className="h-1.5 rounded-full transition-all duration-300" style={{
                            width: i === step ? 24 : 6,
                            background: i < step ? "#839958" : i === step ? "#D3968C" : "rgba(10,51,35,0.2)"
                        }} />
                    ))}
                </div>
            </div>
        </div>
    );
}
