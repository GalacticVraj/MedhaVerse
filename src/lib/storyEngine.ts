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
        id: "phase-1",
        title: "Player as AI",
        icon: "🧠",
        briefing: [
            { text: "Hello Engineer! Welcome to your AI training simulation.", emotion: "happy" },
            { text: "Your goal is to get the ambulance to the hospital without causing a collision.", emotion: "curious" },
            { text: "For now, you are observing traffic and making decisions like an AI system.", emotion: "curious" },
            { text: "Use the toggles below to manually control the signals. Remember: giving BOTH directions Green will cause a collision!", emotion: "alert" }
        ],
        objective: "Manually guide the ambulance without causing a collision.",
        objectiveHint: "Use the N-S and E-W buttons to toggle green signals manually.",
        successCondition: "ambulance_reached",
        insightTitle: "Manual Control & The Baseline",
        insightText: "Before we can build an AI, we must understand the decisions it needs to make. You are currently acting as the 'baseline' — proving the task is possible with human logic.",
        xpReward: 100,
        sparkCelebration: "Perfect coordination! You passed the baseline test. 🎉",
    },
    {
        id: "phase-2",
        title: "Pattern Recognition",
        icon: "📊",
        briefing: [
            { text: "Great job! A core part of Artificial Intelligence is Pattern Recognition.", emotion: "happy" },
            { text: "I've enabled the data tracking overlay on your HUD.", emotion: "curious" },
            { text: "Notice which lanes get crowded faster and how waiting time accumulates.", emotion: "worried" },
            { text: "Keep traffic flowing and safely escort the next ambulance!", emotion: "alert" }
        ],
        objective: "Manage traffic while observing Density and Wait Times.",
        objectiveHint: "Look at the data overlays to decide when to switch signals.",
        successCondition: "ambulance_reached",
        insightTitle: "Data is the Fuel of AI",
        insightText: "AI systems don't have 'intuition'. They rely purely on data streams — like Density and Wait Time — to understand the state of the world.",
        xpReward: 150,
        sparkCelebration: "You're starting to see the matrix! Excellent work! 📊",
    },
    {
        id: "phase-3",
        title: "Rule-Based AI",
        icon: "⚙️",
        briefing: [
            { text: "You can't manage all these intersections forever. Let's build a Rule-Based AI!", emotion: "happy" },
            { text: "I've implemented internal logic: IF ambulance -> force Green. IF traffic density > threshold -> increase Green.", emotion: "curious" },
            { text: "Sit back and watch the Rule-Based AI run the intersection semi-automatically.", emotion: "happy" }
        ],
        objective: "Observe the Rule-Based AI manage the intersection.",
        objectiveHint: "The signals will automatically change based on hard-coded rules.",
        successCondition: "ambulance_reached",
        insightTitle: "Rule-Based Systems (Expert Systems)",
        insightText: "Early AI systems were entirely Rule-Based (IF-THEN statements). While effective for simple scenarios, they struggle to adapt when combinations of rules conflict.",
        xpReward: 200,
        sparkCelebration: "The rule-based AI worked... mostly! ⚙️",
    },
    {
        id: "phase-4",
        title: "Machine Learning (Auto Mode)",
        icon: "🤖",
        briefing: [
            { text: "Rule-based AI breaks down when traffic gets too complex. It's time for Machine Learning!", emotion: "alert" },
            { text: "I've unlocked AI Auto Mode. The system now uses a Priority Formula based on past data.", emotion: "happy" },
            { text: "Priority = (5 × Ambulance) + (2 × Density) + (1 × Wait Time)", emotion: "curious" },
            { text: "Watch as the AI dynamically assigns GREEN to the lane with the highest score!", emotion: "celebrating" }
        ],
        objective: "Observe the Machine Learning priority model.",
        objectiveHint: "The AI dynamically compares Priority Scores to assign the Green signal.",
        successCondition: "ambulance_reached",
        insightTitle: "Dynamic Priority Models (ML)",
        insightText: "Modern AI doesn't use rigid IF-THEN rules. It uses weighted scores and probabilities derived from massive datasets, allowing it to adapt dynamically to evolving edge cases.",
        xpReward: 300,
        sparkCelebration: "The Machine Learning model is flawless! You're an AI master! 🤖🏆",
    }
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
