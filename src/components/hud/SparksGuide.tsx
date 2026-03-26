"use client";
import React from "react";
import { Bot, AlertTriangle, CheckCircle, Zap } from "lucide-react";

interface SparksGuideProps {
    message: string;
    emotion: "happy" | "worried" | "alert" | "celebrating" | "curious";
}

export default function SparksGuide({ message, emotion }: SparksGuideProps) {
    if (!message) return null;

    const isDistressed = emotion === "alert" || emotion === "worried";
    const isHappy = emotion === "celebrating" || emotion === "happy";
    
    const bgColor = isDistressed ? "bg-red-950/80" : isHappy ? "bg-emerald-950/80" : "bg-cyan-950/80";
    const borderColor = isDistressed ? "border-red-500" : isHappy ? "border-emerald-500" : "border-cyan-500";
    const textColor = isDistressed ? "text-red-300" : isHappy ? "text-emerald-300" : "text-cyan-300";
    
    const Icon = isDistressed ? AlertTriangle : isHappy ? CheckCircle : Bot;

    return (
        <div className="absolute top-24 left-6 z-[60] w-72 animate-in slide-in-from-left duration-500 drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
            <div className={`flex flex-col gap-3 p-5 rounded-3xl border-2 backdrop-blur-xl ${bgColor} ${borderColor}`}>
                <div className="flex items-center gap-3 border-b border-white/10 pb-3">
                    <div className={`w-10 h-10 flex items-center justify-center rounded-full bg-black/50 border ${borderColor} shrink-0`}>
                        <Icon size={20} className={textColor} />
                    </div>
                    <div>
                        <h3 className={`text-[10px] font-black uppercase tracking-[0.2em] ${textColor}`}>AI Guide</h3>
                        <p className="text-white text-sm font-bold leading-none mt-1 shadow-black drop-shadow-md">SPARKS</p>
                    </div>
                </div>
                <div>
                    <p className="text-white/90 text-sm font-medium leading-relaxed drop-shadow-md">{message}</p>
                </div>
            </div>
        </div>
    );
}
