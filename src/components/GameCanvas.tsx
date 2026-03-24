"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Sky, Stars } from "@react-three/drei";

import Ground from "@/components/city/Ground";
import Roads, { ROAD_PATHS } from "@/components/city/Roads";
import Buildings from "@/components/city/Buildings";
import Vehicle from "@/components/city/Vehicle";
import TrafficLight from "@/components/city/TrafficLight";
import CompanionDrone from "@/components/city/CompanionDrone";
import StreetLamp, { Tree } from "@/components/city/CityProps";

const CAR_COLORS = ["#00E0FF", "#FF3366", "#00E676", "#FFD600", "#E040FB", "#FF6D00", "#00B0FF", "#76FF03", "#F44336", "#9C27B0"];

const SIGNAL_POSITIONS: { id: string; pos: [number, number, number]; rot: [number, number, number]; init: "RED" | "GREEN"; axis: "x" | "z" }[] = [
    { id: "SIG-A (North)", pos: [5, 0, 5], rot: [0, 0, 0], init: "GREEN", axis: "z" },
    { id: "SIG-B (East)", pos: [-5, 0, 5], rot: [0, Math.PI / 2, 0], init: "RED", axis: "x" },
    { id: "SIG-C (South)", pos: [5, 0, -5], rot: [0, -Math.PI / 2, 0], init: "RED", axis: "x" },
    { id: "SIG-D (West)", pos: [-5, 0, -5], rot: [0, Math.PI, 0], init: "GREEN", axis: "z" },
];

const LAMP_POSITIONS: [number, number, number][] = [
    [12, 0, 5], [-12, 0, 5], [12, 0, -5], [-12, 0, -5],
    [5, 0, 12], [-5, 0, 12], [5, 0, -12], [-5, 0, -12],
    [25, 0, 0], [-25, 0, 0], [0, 0, 25], [0, 0, -25],
    [30, 0, 15], [-30, 0, 15], [30, 0, -15], [-30, 0, -15],
];

const TREE_POSITIONS: [number, number, number][] = [
    [14, 0, 14], [-14, 0, 14], [14, 0, -14], [-14, 0, -14],
    [20, 0, 8], [-20, 0, 8], [8, 0, 20], [-8, 0, 20],
    [8, 0, -20], [-8, 0, -20], [20, 0, -8], [-20, 0, -8],
    [32, 0, 32], [-32, 0, 32], [32, 0, -32], [-32, 0, -32],
    [35, 0, 5], [-35, 0, 5], [5, 0, 35], [-5, 0, 35],
];

interface GameCanvasProps {
    isRushHour: boolean;
    vehicleCount: number;
    emergencyVehicles: number[];
    signalConfigs: Record<string, { greenDuration: number; redDuration: number; yellowDuration: number }>;
    droneMessage: string;
    droneAlert: boolean;
    sparkEmotion: string;
    onSignalClick: (id: string) => void;
    currentMissionIndex: number;
    phase: string;
}

export default function GameCanvas({
    isRushHour, vehicleCount, emergencyVehicles, signalConfigs,
    droneMessage, droneAlert, sparkEmotion, onSignalClick, currentMissionIndex, phase,
}: GameCanvasProps) {
    const vehicles = Array.from({ length: vehicleCount }).map((_, i) => ({
        id: `car-${i}`,
        pathIndex: i % ROAD_PATHS.length,
        speed: 3 + ((i * 7 + 13) % 70) / 10, // deterministic per id
        color: CAR_COLORS[i % CAR_COLORS.length],
        startOffset: ((i * 37 + 11) % 80),
    }));

    // Special stuck ambulance scenario for Mission 1
    const missionScenario = (currentMissionIndex === 0 && (phase === "ACTIVE" || phase === "RULES" || phase === "BRIEFING")) ? [
        {
            id: "stuck-ambulance-target",
            pathIndex: 0, // h-main
            speed: 12,
            color: "#FFFFFF",
            isEmergency: true,
            startOffset: 5, // Behind blocker cars
        },
        // 6 cars directly in front of the ambulance
        ...Array.from({ length: 6 }).map((_, j) => ({
            id: `mission-blocker-${j}`,
            pathIndex: 0, // same path as ambulance
            speed: 8,
            color: CAR_COLORS[(j + 2) % CAR_COLORS.length],
            isEmergency: false,
            startOffset: 15 + j * 9, // Distribute ahead
        }))
    ] : [];

    return (
        <Canvas
            shadows
            camera={{ position: [35, 30, 35], fov: 55, near: 0.1, far: 500 }}
            gl={{ antialias: true, toneMapping: 3 }}
        >
            <ambientLight intensity={0.25} color="#8899BB" />
            <directionalLight
                position={[50, 80, 30]}
                intensity={1.8}
                castShadow
                shadow-mapSize={[2048, 2048]}
                shadow-camera-far={200}
                shadow-camera-left={-60}
                shadow-camera-right={60}
                shadow-camera-top={60}
                shadow-camera-bottom={-60}
            />
            <hemisphereLight args={["#87CEEB", "#1a4a3a", 0.3]} />

            <fog attach="fog" args={["#0a1628", 50, 120]} />
            <Sky sunPosition={[100, 10, 100]} turbidity={10} rayleigh={3} />
            <Stars radius={100} depth={50} count={5000} factor={4} fade speed={1} />

            <OrbitControls
                enableDamping
                dampingFactor={0.05}
                minDistance={8}
                maxDistance={90}
                maxPolarAngle={Math.PI / 2.1}
                target={[0, 0, 0]}
            />

            <Suspense fallback={null}>
                <Ground />
                <Roads />
                <Buildings />

                {LAMP_POSITIONS.map((pos, i) => (
                    <StreetLamp key={`lamp-${i}`} position={pos} />
                ))}

                {TREE_POSITIONS.map((pos, i) => (
                    <Tree key={`tree-${i}`} position={pos} />
                ))}

                {SIGNAL_POSITIONS.map(sig => (
                    <TrafficLight
                        key={sig.id}
                        signalId={sig.id}
                        position={sig.pos}
                        rotation={sig.rot}
                        initialState={sig.init}
                        controlsAxis={sig.axis}
                        config={signalConfigs[sig.id] || { greenDuration: 8, redDuration: 8, yellowDuration: 2 }}
                        onClick={() => onSignalClick(sig.id)}
                    />
                ))}

                {vehicles.map(v => (
                    <Vehicle
                        key={v.id}
                        vehicleId={v.id}
                        path={ROAD_PATHS[v.pathIndex].points}
                        speed={v.speed}
                        color={v.color}
                        startOffset={v.startOffset}
                    />
                ))}

                {missionScenario.map(v => (
                    <Vehicle
                        key={v.id}
                        vehicleId={v.id}
                        path={ROAD_PATHS[v.pathIndex].points}
                        speed={v.speed}
                        color={v.color}
                        isEmergency={v.isEmergency}
                        startOffset={v.startOffset}
                    />
                ))}

                {emergencyVehicles.map((id, i) => (
                    <Vehicle
                        key={`emg-${id}`}
                        vehicleId={`emg-${id}`}
                        path={ROAD_PATHS[i % ROAD_PATHS.length].points}
                        speed={14}
                        color="#FFFFFF"
                        isEmergency
                        startOffset={0}
                    />
                ))}

                <CompanionDrone message={droneMessage} isAlert={droneAlert} />
            </Suspense>
        </Canvas>
    );
}
