// Story Engine — Central state machine for the narrative-driven game
"use client";

import { useState, useCallback } from "react";

export type GamePhase = "INTRO" | "BRIEFING" | "RULES" | "ACTIVE" | "COMPLETE" | "INSIGHT" | "FREE_PLAY";

export type SparkEmotion = "happy" | "worried" | "alert" | "celebrating" | "curious";

export interface SparkMessage {
    text: string;
    emotion: SparkEmotion;
    delay?: number; // auto-advance delay in ms
}

export interface StoryMission {
    id: string;
    title: string;
    icon: string;
    briefing: SparkMessage[];
    objective: string;
    objectiveHint: string;
    successCondition: string; // key used by game logic to trigger completion
    insightTitle: string;
    insightText: string;
    xpReward: number;
    sparkCelebration: string;
}

export const STORY_MISSIONS: StoryMission[] = [
    {
        id: "story-1",
        title: "Save the Ambulance",
        icon: "🚑",
        briefing: [
            { text: "Engineer! Our city sensors are picking up an emergency!", emotion: "alert" },
            { text: "An ambulance is stuck in heavy traffic on the main road!", emotion: "worried" },
            { text: "You need to adjust the traffic signals to create a clear path.", emotion: "curious" },
            { text: "Click on a traffic signal and set it to give the ambulance's road more green time!", emotion: "happy" },
        ],
        objective: "Configure a signal and dispatch an emergency vehicle",
        objectiveHint: "Click a signal → increase green time → hit Apply → then dispatch Emergency",
        successCondition: "emergency_dispatched_after_config",
        insightTitle: "Signal Priority Systems",
        insightText: "In real smart cities, traffic systems detect approaching ambulances and automatically turn signals green. This is called a \"green wave\" — it can reduce emergency response times by up to 40%!",
        xpReward: 100,
        sparkCelebration: "You saved a life! The ambulance got through! 🎉",
    },
    {
        id: "story-2",
        title: "School Zone Safety",
        icon: "🏫",
        briefing: [
            { text: "Great work, Engineer! But we have a new challenge...", emotion: "curious" },
            { text: "School is about to let out! Hundreds of kids will be crossing the streets.", emotion: "worried" },
            { text: "We need to slow traffic down but keep it flowing — no gridlock!", emotion: "alert" },
            { text: "Try setting shorter green phases (under 5 seconds) to slow cars down.", emotion: "happy" },
        ],
        objective: "Set any signal's green phase to under 5 seconds",
        objectiveHint: "Click a signal → drag green slider below 5s → Apply",
        successCondition: "short_green_applied",
        insightTitle: "Balanced Signal Timing",
        insightText: "Traffic engineers use shorter green phases near schools to reduce vehicle speed. But too short = gridlock! The key is balance. Real engineers use Webster's Formula to calculate the perfect timing.",
        xpReward: 125,
        sparkCelebration: "The school zone is safe! Kids are crossing safely! 🎒",
    },
    {
        id: "story-3",
        title: "Festival Traffic Surge",
        icon: "🎉",
        briefing: [
            { text: "Amazing engineering work so far! But hold on...", emotion: "happy" },
            { text: "There's a festival happening in Medha City tonight!", emotion: "curious" },
            { text: "Traffic is about to TRIPLE! The city sensors are already detecting the surge!", emotion: "alert" },
            { text: "Activate Rush Hour mode and try to keep the city from gridlocking!", emotion: "worried" },
        ],
        objective: "Activate Rush Hour and configure all 4 signals",
        objectiveHint: "Hit Rush Hour → then click and configure each of the 4 signals",
        successCondition: "rush_hour_all_configured",
        insightTitle: "Traffic Flow & Capacity",
        insightText: "A single lane can handle about 1,800 vehicles per hour under ideal conditions. During festivals and events, traffic can spike 3x! Smart cities use IoT sensors and AI to adjust signals in real-time, reducing congestion by up to 25%.",
        xpReward: 175,
        sparkCelebration: "The festival was a success! Traffic flowed smoothly! 🎆",
    },
    {
        id: "story-4",
        title: "Emergency Route Priority",
        icon: "🚒",
        briefing: [
            { text: "URGENT! This is our biggest challenge yet!", emotion: "alert" },
            { text: "A fire has broken out on the east side of the city!", emotion: "worried" },
            { text: "Fire trucks need a clear path — AND we're still in rush hour!", emotion: "alert" },
            { text: "You'll need to manage EVERYTHING: signals, rush hour, and emergency vehicles all at once!", emotion: "curious" },
        ],
        objective: "Dispatch an emergency vehicle during Rush Hour with all signals configured",
        objectiveHint: "Make sure Rush Hour is ON → all 4 signals configured → dispatch Emergency",
        successCondition: "emergency_during_rush_all_config",
        insightTitle: "Systems Thinking",
        insightText: "Real traffic engineers don't just manage one signal — they manage entire networks! When everything is connected, one change affects the whole system. This is called 'systems thinking' — the most important skill in engineering.",
        xpReward: 250,
        sparkCelebration: "You're a MASTER ENGINEER! Medha City is safe thanks to you! 🏆",
    },
];

export function useStoryEngine() {
    const [phase, setPhase] = useState<GamePhase>("INTRO");
    const [currentMissionIndex, setCurrentMissionIndex] = useState(0);
    const [completedMissions, setCompletedMissions] = useState<Set<string>>(new Set());
    const [score, setScore] = useState(0);
    const [sparkEmotion, setSparkEmotion] = useState<SparkEmotion>("happy");

    const currentMission = STORY_MISSIONS[currentMissionIndex] || null;
    const level = Math.floor(score / 300) + 1;

    const startGame = useCallback(() => {
        setPhase("BRIEFING");
    }, []);

    const startMission = useCallback(() => {
        setPhase("ACTIVE");
        setSparkEmotion("curious");
    }, []);

    const completeMission = useCallback(() => {
        if (!currentMission) return;
        setCompletedMissions(prev => {
            const next = new Set(Array.from(prev));
            next.add(currentMission.id);
            return next;
        });
        setScore(prev => prev + currentMission.xpReward);
        setSparkEmotion("celebrating");
        setPhase("COMPLETE");
    }, [currentMission]);

    const showInsight = useCallback(() => {
        setPhase("INSIGHT");
    }, []);

    const nextMission = useCallback(() => {
        if (currentMissionIndex < STORY_MISSIONS.length - 1) {
            setCurrentMissionIndex(prev => prev + 1);
            setPhase("BRIEFING");
            setSparkEmotion("happy");
        } else {
            setPhase("FREE_PLAY");
            setSparkEmotion("celebrating");
        }
    }, [currentMissionIndex]);

    return {
        phase,
        currentMission,
        currentMissionIndex,
        completedMissions,
        score,
        level,
        sparkEmotion,
        setSparkEmotion,
        startGame,
        startMission,
        completeMission,
        showInsight,
        nextMission,
        setPhase,
    };
}
