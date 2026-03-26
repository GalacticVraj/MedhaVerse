"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { useStoryEngine, STORY_MISSIONS } from "@/lib/storyEngine";
import { trafficStore } from "@/lib/trafficStore";
import { Lock, Unlock, AlertTriangle } from "lucide-react";

import HUD from "@/components/hud/HUD";
import GameIntro from "@/components/hud/GameIntro";
import MissionBriefing from "@/components/hud/MissionBriefing";
import MissionComplete from "@/components/hud/MissionComplete";
import InsightScreen from "@/components/hud/InsightScreen";
import SparkDialogue from "@/components/hud/SparkDialogue";
import GameRules from "@/components/hud/GameRules";
import ToastContainer, { showToast } from "@/components/hud/ToastNotification";
import SparksGuide from "@/components/hud/SparksGuide";

const GameCanvas = dynamic(() => import("@/components/GameCanvas"), { ssr: false });

export default function Home() {
    const story = useStoryEngine();

    // Signal States
    const [nsSignal, setNsSignal] = useState<"GREEN" | "RED" | "YELLOW">("GREEN");
    const [ewSignal, setEwSignal] = useState<"GREEN" | "RED" | "YELLOW">("RED");

    // HUD Data States
    const [xStats, setXStats] = useState({ density: 0, waitTime: 0, ambulance: false });
    const [zStats, setZStats] = useState({ density: 0, waitTime: 0, ambulance: false });
    const [ambulanceTime, setAmbulanceTime] = useState(45);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // AI Phase System variables
    const phaseId = story.currentMission?.id; // phase-1, phase-2, phase-3, phase-4
    const isRuleMode = phaseId === "phase-3";
    const [autoModeEnabled, setAutoModeEnabled] = useState(false);

    // Only allow Auto Mode to be fully active if we are in phase-4 AND the user toggled it.
    const isAutoModeActive = phaseId === "phase-4" && autoModeEnabled;

    const [droneMessage, setDroneMessage] = useState("Awaiting your orders, Engineer!");
    const [droneAlert, setDroneAlert] = useState(false); // Can be used to trigger red flashes if needed later

    // Main Game Loop for Metrics, AI, and Fail Conditions
    useEffect(() => {
        if (story.phase !== "ACTIVE") return;

        let interval = setInterval(() => {
            const x = trafficStore.getMetrics("x"); // E-W
            const z = trafficStore.getMetrics("z"); // N-S

            setXStats(x);
            setZStats(z);

            // Failure: Collision
            if (nsSignal === "GREEN" && ewSignal === "GREEN") {
                showToast("CRITICAL COLLISION! Signals crossed!", "alert", "💥");
                handleFailure("System Failure: Both directions were given GREEN. Collision occurred!");
                return;
            }

            // Failure: Gridlock
            if (x.density > 20 || z.density > 20) {
                showToast("Traffic Gridlock!", "alert", "🚦");
                handleFailure("System Failure: Traffic density exceeded maximum safe levels.");
                return;
            }

            // AI Logic Processing
            if (isAutoModeActive) {
                // Phase 4: Machine Learning Priority Formula
                const nsScore = (5 * (z.ambulance ? 1 : 0)) + (2 * z.density) + (1 * z.waitTime);
                const ewScore = (5 * (x.ambulance ? 1 : 0)) + (2 * x.density) + (1 * x.waitTime);
                
                if (nsScore > ewScore + 10 && nsSignal !== "GREEN") {
                    setNsSignal("GREEN");
                    setEwSignal("RED");
                    setDroneMessage(`ML Model switched priority to N-S! (Score: ${nsScore})`);
                    story.setSparkEmotion("happy");
                } else if (ewScore > nsScore + 10 && ewSignal !== "GREEN") {
                    setNsSignal("RED");
                    setEwSignal("GREEN");
                    setDroneMessage(`ML Model switched priority to E-W! (Score: ${ewScore})`);
                    story.setSparkEmotion("happy");
                }
            } else if (isRuleMode) {
                // Phase 3: Rule-Based Logic
                if (z.ambulance && nsSignal !== "GREEN") {
                    setNsSignal("GREEN"); setEwSignal("RED");
                    setDroneMessage("Rule triggered: Ambulance detected on N-S axis.");
                } else if (x.ambulance && ewSignal !== "GREEN") {
                    setNsSignal("RED"); setEwSignal("GREEN");
                    setDroneMessage("Rule triggered: Ambulance detected on E-W axis.");
                } else if (!z.ambulance && !x.ambulance) {
                    if (z.density > 10 && nsSignal !== "GREEN") { setNsSignal("GREEN"); setEwSignal("RED"); setDroneMessage("Rule triggered: Max density N-S."); }
                    else if (x.density > 10 && ewSignal !== "GREEN") { setNsSignal("RED"); setEwSignal("GREEN"); setDroneMessage("Rule triggered: Max density E-W."); }
                }
            }

        }, 1000);

        return () => clearInterval(interval);
    }, [story.phase, isAutoModeActive, isRuleMode, nsSignal, ewSignal]);

    // Ambulance Timer countdown
    useEffect(() => {
        if (story.phase === "ACTIVE") {
            timerRef.current = setInterval(() => {
                setAmbulanceTime(p => {
                    const next = p - 1;
                    if (next <= 10 && p > 10) {
                        setDroneMessage("Time is running out! Clear the intersection!");
                        story.setSparkEmotion("worried");
                    }
                    if (next <= 0) {
                        handleFailure("Ambulance delayed! Patient lost due to traffic mismanagement.");
                    }
                    return next;
                });
            }, 1000);
        } else {
            if (timerRef.current) clearInterval(timerRef.current);
            setAmbulanceTime(45);
        }
        return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }, [story.phase]);

    const handleFailure = (reason: string) => {
        story.setSparkEmotion("alert");
        showToast(reason, "alert", "❌");
        setDroneMessage(reason);
        setAutoModeEnabled(false);
        setTimeout(() => {
            story.setPhase("RULES"); // Reset level
            trafficStore.reset();
            setAmbulanceTime(45);
        }, 1500); 
    };

    const handleAmbulanceFinish = (id: string) => {
        if (story.phase !== "ACTIVE") return;
        
        showToast("Ambulance arrived safely!", "success", "🏥");
        setDroneMessage(story.currentMission?.sparkCelebration || "Target Reached!");
        story.setSparkEmotion("celebrating");
        setAutoModeEnabled(false);
        story.completeMission();
        trafficStore.reset();
    };

    const handleIntroComplete = () => {
        story.startGame();
    };

    const handleRulesComplete = () => {
        trafficStore.reset();
        setAmbulanceTime(45);
        setNsSignal("GREEN");
        setEwSignal("RED");
        setAutoModeEnabled(false);
        story.startMission();
        if (story.currentMission) {
            showToast(`Phase Started: ${story.currentMission.title}`, "info", story.currentMission.icon);
            // Phase 4 specific dialogue helper mapping
            if (story.currentMission.id === "phase-4") {
                setDroneMessage("I've unlocked the Auto Mode switch. Click it to yield control to the ML array!");
                story.setSparkEmotion("curious");
            } else {
                setDroneMessage(story.currentMission.objective);
            }
        }
    };

    return (
        <div className="w-screen h-screen bg-black relative overflow-hidden">
            <ToastContainer />

            <GameCanvas
                isRushHour={phaseId === "phase-3" || phaseId === "phase-4"}
                vehicleCount={15}
                emergencyVehicles={[]}
                manualSignals={{ ns: nsSignal, ew: ewSignal }}
                droneMessage={""} // Drone bubble disabled in favor of 2D SparksGuide
                droneAlert={false} 
                sparkEmotion={story.sparkEmotion}
                onAmbulanceFinish={handleAmbulanceFinish}
                currentMissionIndex={story.currentMissionIndex}
                phase={story.phase}
            />

            {/* INTRO */}
            {story.phase === "INTRO" && <GameIntro onComplete={handleIntroComplete} />}

            {/* BRIEFING */}
            {story.phase === "BRIEFING" && story.currentMission && (
                <SparkDialogue messages={story.currentMission.briefing} onComplete={() => story.setPhase("RULES")} />
            )}

            {/* MISSION RULES CARD */}
            {story.phase === "RULES" && (
                <GameRules onStart={handleRulesComplete} />
            )}

            {/* ACTIVE PLAY */}
            {(story.phase === "ACTIVE" || story.phase === "FREE_PLAY") && (
                <>
                    {/* SPARKS 2D GUIDE */}
                    <SparksGuide message={droneMessage} emotion={story.sparkEmotion} />

                    <HUD
                        onRushHour={() => {}}
                        onEmergency={() => {}}
                        isRushHour={false}
                        vehicleCount={xStats.density + zStats.density}
                        score={story.score}
                        level={story.level}
                        onMissions={() => { }}
                        onTutorial={() => story.setPhase("INTRO")}
                        currentObjective={story.currentMission?.objective || "Free Play"}
                    />

                    {/* TOP-CENTER: Timer Bar & Auto Toggle Control */}
                    <div className="absolute top-20 left-1/2 -translate-x-1/2 flex items-center gap-6 z-50">
                        {/* Auto Mode Toggle */}
                        <div className={`flex items-center gap-3 px-6 py-3 rounded-full border-2 backdrop-blur-xl transition-all ${
                            phaseId !== "phase-4" 
                            ? "bg-black/50 border-white/10 opacity-60" 
                            : autoModeEnabled 
                                ? "bg-cyan-950/80 border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.4)]" 
                                : "bg-black/80 border-cyan-500 hover:border-cyan-300"
                        }`}>
                            <div className="flex flex-col items-center">
                                <span className="text-[10px] font-black tracking-widest text-cyan-500 uppercase">ML System</span>
                                <span className="text-white font-bold tracking-widest mt-0.5">AUTO MODE</span>
                            </div>
                            <button
                                disabled={phaseId !== "phase-4"}
                                onClick={() => setAutoModeEnabled(!autoModeEnabled)}
                                className={`relative w-[60px] h-[32px] rounded-full transition-all duration-300 ${
                                    phaseId !== "phase-4" ? "bg-white/10" : autoModeEnabled ? "bg-cyan-500 shadow-[0_0_15px_#22d3ee]" : "bg-white/20 hover:bg-white/30"
                                }`}
                            >
                                <div className={`absolute top-[4px] w-[24px] h-[24px] rounded-full bg-white flex items-center justify-center transition-all duration-300 ${
                                    autoModeEnabled ? "left-[32px]" : "left-[4px]"
                                }`}>
                                    {phaseId !== "phase-4" ? <Lock size={12} className="text-gray-500" /> : <Unlock size={12} className={autoModeEnabled ? "text-cyan-600" : "text-gray-600"} />}
                                </div>
                            </button>
                        </div>

                        {/* Ambulance Bar */}
                        <div className="bg-black/80 border border-red-500/50 p-4 rounded-xl backdrop-blur-md shadow-[0_0_20px_rgba(255,0,0,0.1)] w-80">
                            <div className="flex justify-between items-center mb-2">
                                <p className="text-red-400 font-bold text-xs tracking-widest uppercase flex items-center gap-2">
                                    <AlertTriangle size={14}/> Ambulance ETA
                                </p>
                                <p className={`text-xl font-black ${ambulanceTime < 15 ? 'text-red-500 animate-pulse' : 'text-white'}`}>
                                    00:{ambulanceTime.toString().padStart(2, '0')}
                                </p>
                            </div>
                            {/* Visual Progress Bar */}
                            <div className="w-full h-3 bg-red-950 rounded-full overflow-hidden border border-red-900/50">
                                <div 
                                    className={`h-full rounded-full transition-all duration-1000 ${ambulanceTime < 15 ? "bg-red-500 shadow-[0_0_10px_#ef4444]" : "bg-red-400"}`}
                                    style={{ width: `${(ambulanceTime / 45) * 100}%` }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* DATA OVERLAYS (Visual Queues for Density)  */}
                    {(phaseId !== "phase-1") && (
                        <div className="absolute top-48 right-6 w-64 space-y-4 pointer-events-none z-40">
                            {['z', 'x'].map((axis) => {
                                const stats = axis === 'z' ? zStats : xStats;
                                const title = axis === 'z' ? "North-South" : "East-West";
                                const isDanger = stats.density > 15;
                                const barColor = isDanger ? "bg-red-500" : stats.density > 8 ? "bg-orange-500" : "bg-emerald-500";
                                return (
                                <div key={axis} className="bg-black/80 border border-cyan-500/30 p-4 rounded-xl backdrop-blur-md">
                                    <h3 className="text-cyan-400 font-bold text-sm mb-3 uppercase tracking-wider">{title}</h3>
                                    
                                    <div className="mb-3">
                                        <div className="flex justify-between text-[11px] mb-1">
                                            <span className="text-white/60 font-bold">QUEUE LENGTH</span>
                                            <span className="font-mono text-cyan-300 font-bold">{stats.density}</span>
                                        </div>
                                        {/* Segmented density bar */}
                                        <div className="flex gap-1 h-2">
                                            {Array.from({length: 20}).map((_, i) => (
                                                <div key={i} className={`flex-1 rounded-sm ${i < stats.density ? barColor : 'bg-white/10'}`}/>
                                            ))}
                                        </div>
                                    </div>
                                    
                                    <p className="text-white/60 text-[11px] font-bold">WAIT TIME: <span className="font-mono text-cyan-300 ml-1">{stats.waitTime}s</span></p>
                                    
                                    {(phaseId === "phase-4") && (
                                        <div className="mt-2 pt-2 border-t border-cyan-500/20 flex justify-between items-center">
                                            <span className="text-orange-400/80 font-bold text-[10px] tracking-widest uppercase">ML Priority</span>
                                            <span className="text-orange-400 font-black font-mono">{(5*(stats.ambulance?1:0)) + (2*stats.density) + (1*stats.waitTime)}</span>
                                        </div>
                                    )}
                                </div>
                            )})}
                        </div>
                    )}

                    {/* CONTROL PANEL (Physical styled buttons) */}
                    {(!isAutoModeActive && !isRuleMode) && (
                        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-black/90 p-4 rounded-[40px] drop-shadow-[0_20px_40px_rgba(0,0,0,0.8)] border-2 border-white/10 backdrop-blur-2xl flex gap-8 z-50">
                            {/* North-South Control */}
                            <div className="flex flex-col items-center bg-black/50 p-4 rounded-[28px] border border-white/5">
                                <span className="text-white/40 text-[11px] font-black mb-3 uppercase tracking-[0.2em]">North-South</span>
                                <button
                                    onClick={() => setNsSignal(prev => prev === "GREEN" ? "RED" : "GREEN")}
                                    className={`relative w-24 h-24 rounded-full transition-all duration-300 border-4 outline-none ${
                                        nsSignal === "GREEN" 
                                        ? "bg-emerald-500 border-emerald-400 shadow-[0_0_40px_rgba(16,185,129,0.8)]" 
                                        : "bg-red-950 border-red-500/30 hover:bg-black/60"
                                    }`}
                                >
                                    <div className={`absolute inset-2 rounded-full ${nsSignal === "GREEN" ? "bg-emerald-400" : "bg-black"} opacity-50 blur-sm`} />
                                </button>
                                <span className={`mt-4 text-xs font-black tracking-widest ${nsSignal === "GREEN" ? "text-emerald-400" : "text-white/20"}`}>
                                    {nsSignal}
                                </span>
                            </div>

                            {/* East-West Control */}
                            <div className="flex flex-col items-center bg-black/50 p-4 rounded-[28px] border border-white/5">
                                <span className="text-white/40 text-[11px] font-black mb-3 uppercase tracking-[0.2em]">East-West</span>
                                <button
                                    onClick={() => setEwSignal(prev => prev === "GREEN" ? "RED" : "GREEN")}
                                    className={`relative w-24 h-24 rounded-full transition-all duration-300 border-4 outline-none ${
                                        ewSignal === "GREEN" 
                                        ? "bg-emerald-500 border-emerald-400 shadow-[0_0_40px_rgba(16,185,129,0.8)]" 
                                        : "bg-red-950 border-red-500/30 hover:bg-black/60"
                                    }`}
                                >
                                    <div className={`absolute inset-2 rounded-full ${ewSignal === "GREEN" ? "bg-emerald-400" : "bg-black"} opacity-50 blur-sm`} />
                                </button>
                                <span className={`mt-4 text-xs font-black tracking-widest ${ewSignal === "GREEN" ? "text-emerald-400" : "text-white/20"}`}>
                                    {ewSignal}
                                </span>
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* COMPLETE */}
            {story.phase === "COMPLETE" && story.currentMission && (
                <MissionComplete mission={story.currentMission} onInsight={() => story.showInsight()} />
            )}

            {/* INSIGHT */}
            {story.phase === "INSIGHT" && story.currentMission && (
                <InsightScreen
                    mission={story.currentMission}
                    isLast={story.currentMissionIndex === STORY_MISSIONS.length - 1}
                    onNext={() => story.nextMission()}
                />
            )}
        </div>
    );
}
