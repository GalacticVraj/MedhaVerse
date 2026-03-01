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

// Dynamic import with ssr:false fixes the blank screen bug
const GameCanvas = dynamic(() => import("@/components/GameCanvas"), { ssr: false });

export default function Home() {
    // Story engine
    const story = useStoryEngine();

    // Game state
    const [isRushHour, setIsRushHour] = useState(false);
    const [emergencyVehicles, setEmergencyVehicles] = useState<number[]>([]);
    const [droneMessage, setDroneMessage] = useState("Awaiting your orders, Engineer!");
    const [droneAlert, setDroneAlert] = useState(false);

    // Signal panel
    const [selectedSignal, setSelectedSignal] = useState<string | null>(null);
    const [signalConfigs, setSignalConfigs] = useState<Record<string, { greenDuration: number; redDuration: number; yellowDuration: number }>>({});

    // Track conditions for story missions
    const [hasConfigured, setHasConfigured] = useState(false);
    const [hasShortGreen, setHasShortGreen] = useState(false);
    const [allConfigured, setAllConfigured] = useState(false);

    // Briefing dialogue state
    const [showBriefingDialogue, setShowBriefingDialogue] = useState(false);

    const vehicleCount = isRushHour ? 20 : 8;

    // Check if current mission should complete
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
                if (context.rushHour && context.allSignals) completed = true;
                if (isRushHour && context.allSignals) completed = true;
                break;
            case "emergency_during_rush_all_config":
                if (context.emergency && isRushHour && (allConfigured || context.allSignals)) completed = true;
                break;
        }

        if (completed) {
            story.completeMission();
            setDroneMessage(story.currentMission.sparkCelebration);
        }
    }, [story, hasConfigured, isRushHour, allConfigured]);

    // Handlers
    const handleRushHour = useCallback(() => {
        setIsRushHour(prev => {
            const next = !prev;
            setDroneMessage(next ? "⚠️ Rush Hour activated! Traffic surging!" : "Rush hour ended. Traffic normalizing...");
            setDroneAlert(next);
            story.setSparkEmotion(next ? "worried" : "happy");
            if (next) checkMissionCompletion({ rushHour: true, allSignals: allConfigured });
            return next;
        });
    }, [checkMissionCompletion, allConfigured, story]);

    const handleEmergency = useCallback(() => {
        setEmergencyVehicles(prev => [...prev, Date.now()]);
        setDroneMessage("🚨 EMERGENCY! Vehicle dispatched — clear the route!");
        setDroneAlert(true);
        story.setSparkEmotion("alert");
        checkMissionCompletion({ emergency: true, allSignals: allConfigured });
        setTimeout(() => {
            setDroneAlert(false);
            setDroneMessage("Emergency vehicle cleared. Great response time! 🏥");
            story.setSparkEmotion("happy");
        }, 8000);
    }, [checkMissionCompletion, allConfigured, story]);

    const handleSignalClick = (signalId: string) => {
        setSelectedSignal(signalId);
        setDroneMessage(`🔧 Selected ${signalId} — adjust the timing!`);
        story.setSparkEmotion("curious");
    };

    const handleSignalApply = (config: { greenDuration: number; redDuration: number; yellowDuration: number }) => {
        if (!selectedSignal) return;
        setSignalConfigs(prev => ({ ...prev, [selectedSignal]: config }));
        setHasConfigured(true);

        const isShort = config.greenDuration < 5;
        if (isShort) setHasShortGreen(true);

        const newConfigs = { ...signalConfigs, [selectedSignal]: config };
        const SIGNAL_IDS = ["SIG-A (North)", "SIG-B (East)", "SIG-C (South)", "SIG-D (West)"];
        const allDone = SIGNAL_IDS.every(id => newConfigs[id]);
        if (allDone) setAllConfigured(true);

        setDroneMessage(`✅ ${selectedSignal} updated! Green: ${config.greenDuration}s, Red: ${config.redDuration}s`);
        story.setSparkEmotion("happy");

        checkMissionCompletion({
            configured: true,
            shortGreen: isShort,
            allSignals: allDone,
            rushHour: isRushHour,
        });
    };

    // Story phase handlers
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
            setDroneMessage(`Mission: ${story.currentMission.title} — ${story.currentMission.objective}`);
        }
    };

    const handleMissionInsight = () => {
        story.showInsight();
    };

    const handleNextMission = () => {
        story.nextMission();
        setShowBriefingDialogue(true);
        // Reset conditions for next mission
        setHasConfigured(false);
        setHasShortGreen(false);
    };

    return (
        <div className="w-screen h-screen bg-black relative overflow-hidden">
            {/* 3D City — always rendered in background */}
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

            {/* Game Intro — Phase: INTRO */}
            {story.phase === "INTRO" && (
                <GameIntro onComplete={handleIntroComplete} />
            )}

            {/* Mission Briefing Dialog — Phase: BRIEFING */}
            {story.phase === "BRIEFING" && story.currentMission && showBriefingDialogue && (
                <SparkDialogue
                    messages={story.currentMission.briefing}
                    onComplete={handleBriefingDialogueComplete}
                />
            )}

            {story.phase === "BRIEFING" && story.currentMission && !showBriefingDialogue && (
                <MissionBriefing
                    mission={story.currentMission}
                    missionNumber={story.currentMissionIndex + 1}
                    totalMissions={STORY_MISSIONS.length}
                    onStart={handleMissionStart}
                />
            )}

            {/* Active Mission — Phase: ACTIVE — Show HUD and game controls */}
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
                        currentObjective={story.phase === "ACTIVE" && story.currentMission ? story.currentMission.objective : undefined}
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

            {/* Mission Complete — Phase: COMPLETE */}
            {story.phase === "COMPLETE" && story.currentMission && (
                <MissionComplete
                    mission={story.currentMission}
                    onInsight={handleMissionInsight}
                />
            )}

            {/* Insight Screen — Phase: INSIGHT */}
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
