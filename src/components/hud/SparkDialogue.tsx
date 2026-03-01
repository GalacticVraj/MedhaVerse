"use client";
import { useState, useEffect, useCallback } from "react";
import { SparkMessage, SparkEmotion } from "@/lib/storyEngine";
import { Sparkles, AlertTriangle, Search, PartyPopper, Heart } from "lucide-react";

const EMOTION_CONFIG: Record<SparkEmotion, { color: string; bgColor: string; borderColor: string; icon: React.ReactNode }> = {
    happy: { color: "#00E0FF", bgColor: "rgba(0,224,255,0.1)", borderColor: "rgba(0,224,255,0.4)", icon: <Sparkles size={20} /> },
    worried: { color: "#FF9800", bgColor: "rgba(255,152,0,0.1)", borderColor: "rgba(255,152,0,0.4)", icon: <AlertTriangle size={20} /> },
    alert: { color: "#FF3366", bgColor: "rgba(255,51,102,0.1)", borderColor: "rgba(255,51,102,0.4)", icon: <AlertTriangle size={20} /> },
    celebrating: { color: "#FFD600", bgColor: "rgba(255,214,0,0.1)", borderColor: "rgba(255,214,0,0.4)", icon: <PartyPopper size={20} /> },
    curious: { color: "#AA66FF", bgColor: "rgba(170,102,255,0.1)", borderColor: "rgba(170,102,255,0.4)", icon: <Search size={20} /> },
};

interface SparkDialogueProps {
    messages: SparkMessage[];
    onComplete: () => void;
}

export default function SparkDialogue({ messages, onComplete }: SparkDialogueProps) {
    const [msgIndex, setMsgIndex] = useState(0);
    const [displayedText, setDisplayedText] = useState("");
    const [isTyping, setIsTyping] = useState(true);

    const current = messages[msgIndex];
    const config = EMOTION_CONFIG[current?.emotion || "happy"];
    const isLast = msgIndex === messages.length - 1;

    // Typewriter effect
    useEffect(() => {
        if (!current) return;
        setDisplayedText("");
        setIsTyping(true);
        let i = 0;
        const interval = setInterval(() => {
            i++;
            setDisplayedText(current.text.slice(0, i));
            if (i >= current.text.length) {
                clearInterval(interval);
                setIsTyping(false);
            }
        }, 25);
        return () => clearInterval(interval);
    }, [msgIndex, current]);

    const handleClick = useCallback(() => {
        if (isTyping) {
            // Skip typewriter — show full text
            setDisplayedText(current.text);
            setIsTyping(false);
            return;
        }
        if (isLast) {
            onComplete();
        } else {
            setMsgIndex(prev => prev + 1);
        }
    }, [isTyping, isLast, current, onComplete]);

    if (!current) return null;

    return (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[80] w-[90vw] max-w-[560px] pointer-events-auto">
            <div
                onClick={handleClick}
                className="cursor-pointer rounded-3xl border shadow-2xl overflow-hidden transition-all duration-300"
                style={{
                    background: `linear-gradient(135deg, ${config.bgColor}, rgba(10,37,64,0.95))`,
                    borderColor: config.borderColor,
                    boxShadow: `0 0 40px ${config.bgColor}`,
                }}
            >
                {/* Header */}
                <div className="flex items-center gap-3 px-5 pt-4 pb-2">
                    <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ background: config.bgColor, border: `1px solid ${config.borderColor}` }}
                    >
                        <span style={{ color: config.color }}>{config.icon}</span>
                    </div>
                    <div>
                        <p className="text-sm font-black" style={{ color: config.color }}>SPARK</p>
                        <p className="text-[10px] text-white/30 font-mono uppercase tracking-wider">AI Drone Assistant</p>
                    </div>
                    <div className="ml-auto flex gap-1">
                        {messages.map((_, i) => (
                            <div
                                key={i}
                                className="h-1.5 rounded-full transition-all"
                                style={{
                                    width: i === msgIndex ? 16 : 6,
                                    background: i <= msgIndex ? config.color : "rgba(255,255,255,0.15)",
                                }}
                            />
                        ))}
                    </div>
                </div>

                {/* Body */}
                <div className="px-5 pb-2 pt-1">
                    <p className="text-[15px] text-white/90 leading-relaxed min-h-[48px]">
                        {displayedText}
                        {isTyping && <span className="animate-pulse ml-0.5" style={{ color: config.color }}>▊</span>}
                    </p>
                </div>

                {/* Footer */}
                <div className="px-5 pb-3 flex justify-end">
                    <p className="text-[11px] font-medium" style={{ color: `${config.color}88` }}>
                        {isTyping ? "Click to skip" : isLast ? "Click to continue →" : "Click for next →"}
                    </p>
                </div>
            </div>
        </div>
    );
}
