"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";

import { useStoryEngine, STORY_MISSIONS } from "@/lib/storyEngine";
import HUD from "@/components/hud/HUD";
import SignalPanel from "@/components/hud/SignalPanel";
import GameIntro from "@/components/hud/GameIntro";
import MissionBriefing from "@/components/hud/MissionBriefing";
import MissionComplete from "@/components/hud/MissionComplete";
import InsightScreen from "@/components/hud/InsightScreen";
import SparkDialogue from "@/components/hud/SparkDialogue";
import ToastContainer, { showToast } from "@/components/hud/ToastNotification";

const GameCanvas = dynamic(() => import("@/components/GameCanvas"), { ssr: false });

export default function Home() {
    const story = useStoryEngine();

    const [isRushHour, setIsRushHour] = useState(false);
    const [emergencyVehicles, setEmergencyVehicles] = useState<number[]>([]);
    const [droneMessage, setDroneMessage] = useState("Awaiting your orders, Engineer!");
    const [droneAlert, setDroneAlert] = useState(false);

    const [selectedSignal, setSelectedSignal] = useState<string | null>(null);
    const [signalConfigs, setSignalConfigs] = useState<Record<string, { greenDuration: number; redDuration: number; yellowDuration: number }>>({});

    const [hasConfigured, setHasConfigured] = useState(false);
    const [allConfigured, setAllConfigured] = useState(false);
    const [showBriefingDialogue, setShowBriefingDialogue] = useState(false);

    const vehicleCount = isRushHour ? 80 : 35;

    const checkMissionCompletion = useCallback((context: {
        configured?: boolean; shortGreen?: boolean; emergency?: boolean;
        rushHour?: boolean; allSignals?: boolean;
    }) => {
        if (story.phase !== "ACTIVE" || !story.currentMission) return;
        const m = story.currentMission;
        let completed = false;

        switch (m.successCondition) {
            case "emergency_dispatched_after_config":
                if (context.emergency && hasConfigured) completed = true;
                break;
            case "short_green_applied":
                if (context.shortGreen) completed = true;
                break;
            case "rush_hour_all_configured":
                if ((context.rushHour || isRushHour) && (context.allSignals || allConfigured)) completed = true;
                break;
            case "emergency_during_rush_all_config":
                if (context.emergency && isRushHour && (allConfigured || context.allSignals)) completed = true;
                break;
        }
        if (completed) {
            story.completeMission();
            showToast(`🎉 Mission Complete: ${m.title}!`, "success", "🏆");
            setDroneMessage(m.sparkCelebration);
        }
    }, [story, hasConfigured, isRushHour, allConfigured]);

    const handleRushHour = useCallback(() => {
        setIsRushHour(prev => {
            const next = !prev;
            if (next) {
                showToast("Rush Hour ACTIVATED — Traffic surge incoming!", "warning", "⚡");
                setDroneMessage("⚠️ Rush Hour! Roads are flooding with vehicles!");
            } else {
                showToast("Rush Hour ended — Traffic normalizing", "info", "✅");
                setDroneMessage("Rush hour ended. Traffic normalizing...");
            }
            setDroneAlert(next);
            story.setSparkEmotion(next ? "worried" : "happy");
            if (next) setTimeout(() => checkMissionCompletion({ rushHour: true, allSignals: allConfigured }), 100);
            return next;
        });
    }, [checkMissionCompletion, allConfigured, story]);

    const handleEmergency = useCallback(() => {
        setEmergencyVehicles(prev => [...prev, Date.now()]);
        showToast("🚨 EMERGENCY — Vehicle dispatched!", "alert", "🚑");
        setDroneMessage("🚨 EMERGENCY! Clear the route, Engineer!");
        setDroneAlert(true);
        story.setSparkEmotion("alert");
        setTimeout(() => checkMissionCompletion({ emergency: true, allSignals: allConfigured }), 100);
        setTimeout(() => {
            setDroneAlert(false);
            showToast("Emergency vehicle cleared — Great response!", "success", "🏥");
            setDroneMessage("Emergency vehicle cleared. Great response time! 🏥");
            story.setSparkEmotion("happy");
        }, 8000);
    }, [checkMissionCompletion, allConfigured, story]);

    const handleSignalClick = (signalId: string) => {
        setSelectedSignal(signalId);
        showToast(`Selected ${signalId} — Adjust timing`, "info", "🚦");
        setDroneMessage(`🔧 ${signalId} selected — adjust the sliders!`);
        story.setSparkEmotion("curious");
    };

    const handleSignalApply = (config: { greenDuration: number; redDuration: number; yellowDuration: number }) => {
        if (!selectedSignal) return;
        setSignalConfigs(prev => ({ ...prev, [selectedSignal]: config }));
        setHasConfigured(true);

        const isShort = config.greenDuration < 5;
        const newConfigs = { ...signalConfigs, [selectedSignal]: config };
        const SIGNAL_IDS = ["SIG-A (North)", "SIG-B (East)", "SIG-C (South)", "SIG-D (West)"];
        const allDone = SIGNAL_IDS.every(id => newConfigs[id]);
        if (allDone) setAllConfigured(true);

        // Toast feedback
        showToast(`✅ ${selectedSignal} Updated — G:${config.greenDuration}s Y:${config.yellowDuration}s R:${config.redDuration}s`, "success", "🚦");
        if (isShort) showToast("⚡ Short green phase! Watch traffic slow down", "warning", "🏫");
        if (allDone) showToast("🎯 All 4 signals configured!", "success", "⭐");

        setDroneMessage(`✅ ${selectedSignal} updated! Watch the simulation respond!`);
        story.setSparkEmotion("happy");

        checkMissionCompletion({
            configured: true,
            shortGreen: isShort,
            allSignals: allDone,
            rushHour: isRushHour,
        });
    };

    const handleIntroComplete = () => {
        story.startGame();
        setShowBriefingDialogue(true);
    };

    const handleBriefingDialogueComplete = () => {
        setShowBriefingDialogue(false);
    };

    const handleMissionStart = () => {
        story.startMission();
        if (story.currentMission) {
            showToast(`Mission Started: ${story.currentMission.title}`, "info", story.currentMission.icon);
            setDroneMessage(`Mission: ${story.currentMission.objective}`);
        }
    };

    const handleNextMission = () => {
        story.nextMission();
        setShowBriefingDialogue(true);
        setHasConfigured(false);
    };

    return (
        <div className="w-screen h-screen bg-black relative overflow-hidden">
            {/* Toast Notifications — always visible */}
            <ToastContainer />

            {/* 3D City */}
            <GameCanvas
                isRushHour={isRushHour}
                vehicleCount={vehicleCount}
                emergencyVehicles={emergencyVehicles}
                signalConfigs={signalConfigs}
                droneMessage={droneMessage}
                droneAlert={droneAlert}
                sparkEmotion={story.sparkEmotion}
                onSignalClick={handleSignalClick}
            />

            {/* INTRO */}
            {story.phase === "INTRO" && <GameIntro onComplete={handleIntroComplete} />}

            {/* BRIEFING — SPARK dialogue first, then mission card */}
            {story.phase === "BRIEFING" && story.currentMission && showBriefingDialogue && (
                <SparkDialogue messages={story.currentMission.briefing} onComplete={handleBriefingDialogueComplete} />
            )}
            {story.phase === "BRIEFING" && story.currentMission && !showBriefingDialogue && (
                <MissionBriefing
                    mission={story.currentMission}
                    missionNumber={story.currentMissionIndex + 1}
                    totalMissions={STORY_MISSIONS.length}
                    onStart={handleMissionStart}
                />
            )}

            {/* ACTIVE / FREE PLAY — full game controls */}
            {(story.phase === "ACTIVE" || story.phase === "FREE_PLAY") && (
                <>
                    <HUD
                        onRushHour={handleRushHour}
                        onEmergency={handleEmergency}
                        isRushHour={isRushHour}
                        vehicleCount={vehicleCount + emergencyVehicles.length}
                        score={story.score}
                        level={story.level}
                        onMissions={() => { }}
                        onTutorial={() => story.setPhase("INTRO")}
                        currentObjective={story.phase === "ACTIVE" && story.currentMission ? story.currentMission.objective : "Free Play — Experiment freely!"}
                    />
                    {selectedSignal && (
                        <SignalPanel
                            signalId={selectedSignal}
                            config={signalConfigs[selectedSignal] || { greenDuration: 8, redDuration: 8, yellowDuration: 2 }}
                            onApply={handleSignalApply}
                            onClose={() => setSelectedSignal(null)}
                        />
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
                    onNext={handleNextMission}
                />
            )}
        </div>
    );
}
