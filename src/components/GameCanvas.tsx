"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

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
}

export default function GameCanvas({
    isRushHour, vehicleCount, emergencyVehicles, signalConfigs,
    droneMessage, droneAlert, sparkEmotion, onSignalClick,
}: GameCanvasProps) {
    const vehicles = Array.from({ length: vehicleCount }).map((_, i) => ({
        id: i,
        pathIndex: i % ROAD_PATHS.length,
        speed: 3 + ((i * 7 + 13) % 70) / 10, // deterministic per id
        color: CAR_COLORS[i % CAR_COLORS.length],
        startOffset: ((i * 37 + 11) % 80),
    }));

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
            <hemisphereLight args={["#FFFFFF", "#7CB342", 0.4]} />

            <color attach="background" args={["#87CEEB"]} />
            <fog attach="fog" args={["#87CEEB", 50, 150]} />
            
            {/* Fluffy sphere-cluster clouds — various shapes and sizes */}

            {/* Cloud 1 — wide flat cumulus, far back left */}
            <group position={[-45, 32, -55]}>
                <mesh><sphereGeometry args={[5, 16, 16]} /><meshStandardMaterial color="#F0F4FF" roughness={1.0} /></mesh>
                <mesh position={[6, -0.5, 0]}><sphereGeometry args={[6, 16, 16]} /><meshStandardMaterial color="#FFFFFF" roughness={1.0} /></mesh>
                <mesh position={[13, -1, 1]}><sphereGeometry args={[5.5, 16, 16]} /><meshStandardMaterial color="#F5F8FF" roughness={1.0} /></mesh>
                <mesh position={[19, -0.5, 0]}><sphereGeometry args={[4.5, 16, 16]} /><meshStandardMaterial color="#F0F4FF" roughness={1.0} /></mesh>
                <mesh position={[6.5, 3.5, 0]}><sphereGeometry args={[4, 16, 16]} /><meshStandardMaterial color="#FFFFFF" roughness={1.0} /></mesh>
                <mesh position={[12.5, 4, 0]}><sphereGeometry args={[3.5, 16, 16]} /><meshStandardMaterial color="#F5F5FF" roughness={1.0} /></mesh>
            </group>

            {/* Cloud 2 — tall puffy, right side */}
            <group position={[55, 38, -35]}>
                <mesh><sphereGeometry args={[4.5, 16, 16]} /><meshStandardMaterial color="#FFFFFF" roughness={1.0} /></mesh>
                <mesh position={[5.5, 0, 0]}><sphereGeometry args={[5.5, 16, 16]} /><meshStandardMaterial color="#F8FBFF" roughness={1.0} /></mesh>
                <mesh position={[11, -0.5, 0]}><sphereGeometry args={[4, 16, 16]} /><meshStandardMaterial color="#F0F4FF" roughness={1.0} /></mesh>
                <mesh position={[5, 4.5, 0]}><sphereGeometry args={[5, 16, 16]} /><meshStandardMaterial color="#FFFFFF" roughness={1.0} /></mesh>
                <mesh position={[9, 5, 0]}><sphereGeometry args={[3.5, 16, 16]} /><meshStandardMaterial color="#F5F8FF" roughness={1.0} /></mesh>
                <mesh position={[2.5, 5.5, 0]}><sphereGeometry args={[3, 16, 16]} /><meshStandardMaterial color="#FFFFFF" roughness={1.0} /></mesh>
            </group>

            {/* Cloud 3 — small compact, front right */}
            <group position={[40, 28, 50]}>
                <mesh><sphereGeometry args={[3, 16, 16]} /><meshStandardMaterial color="#FFFFFF" roughness={1.0} /></mesh>
                <mesh position={[4, 0.5, 0]}><sphereGeometry args={[4, 16, 16]} /><meshStandardMaterial color="#F8FBFF" roughness={1.0} /></mesh>
                <mesh position={[8, 0, 0]}><sphereGeometry args={[3, 16, 16]} /><meshStandardMaterial color="#F5F5FF" roughness={1.0} /></mesh>
                <mesh position={[4, 3.5, 0]}><sphereGeometry args={[3, 16, 16]} /><meshStandardMaterial color="#FFFFFF" roughness={1.0} /></mesh>
            </group>

            {/* Cloud 4 — elongated wispy, far right */}
            <group position={[70, 36, 10]}>
                <mesh><sphereGeometry args={[3.5, 16, 16]} /><meshStandardMaterial color="#F0F4FF" roughness={1.0} /></mesh>
                <mesh position={[5, 0, 0]}><sphereGeometry args={[5, 16, 16]} /><meshStandardMaterial color="#FFFFFF" roughness={1.0} /></mesh>
                <mesh position={[11, -0.5, 0]}><sphereGeometry args={[5.5, 16, 16]} /><meshStandardMaterial color="#F5F8FF" roughness={1.0} /></mesh>
                <mesh position={[17.5, -0.5, 0]}><sphereGeometry args={[4, 16, 16]} /><meshStandardMaterial color="#FFFFFF" roughness={1.0} /></mesh>
                <mesh position={[22, 0, 0]}><sphereGeometry args={[3, 16, 16]} /><meshStandardMaterial color="#F0F4FF" roughness={1.0} /></mesh>
                <mesh position={[11, 4.5, 0]}><sphereGeometry args={[4.5, 16, 16]} /><meshStandardMaterial color="#FFFFFF" roughness={1.0} /></mesh>
                <mesh position={[16, 4, 0]}><sphereGeometry args={[3.5, 16, 16]} /><meshStandardMaterial color="#F8FBFF" roughness={1.0} /></mesh>
            </group>

            {/* Cloud 5 — medium round, directly above */}
            <group position={[-5, 42, -60]}>
                <mesh><sphereGeometry args={[4, 16, 16]} /><meshStandardMaterial color="#FFFFFF" roughness={1.0} /></mesh>
                <mesh position={[5.5, 0, 0]}><sphereGeometry args={[5, 16, 16]} /><meshStandardMaterial color="#F5F8FF" roughness={1.0} /></mesh>
                <mesh position={[11, 0, 0]}><sphereGeometry args={[4, 16, 16]} /><meshStandardMaterial color="#F0F4FF" roughness={1.0} /></mesh>
                <mesh position={[5.5, 4, 0]}><sphereGeometry args={[4.5, 16, 16]} /><meshStandardMaterial color="#FFFFFF" roughness={1.0} /></mesh>
            </group>

            {/* Cloud 6 — small wispy far left */}
            <group position={[-70, 30, 15]}>
                <mesh><sphereGeometry args={[3, 16, 16]} /><meshStandardMaterial color="#F5F8FF" roughness={1.0} /></mesh>
                <mesh position={[4, 0, 0]}><sphereGeometry args={[4, 16, 16]} /><meshStandardMaterial color="#FFFFFF" roughness={1.0} /></mesh>
                <mesh position={[8.5, -0.5, 0]}><sphereGeometry args={[3, 16, 16]} /><meshStandardMaterial color="#F8FBFF" roughness={1.0} /></mesh>
                <mesh position={[4, 3, 0]}><sphereGeometry args={[3, 16, 16]} /><meshStandardMaterial color="#FFFFFF" roughness={1.0} /></mesh>
            </group>

            {/* Cloud 7 — big dramatic cloud front left */}
            <group position={[-60, 35, 45]}>
                <mesh><sphereGeometry args={[5, 16, 16]} /><meshStandardMaterial color="#F0F4FF" roughness={1.0} /></mesh>
                <mesh position={[7, -1, 0]}><sphereGeometry args={[7, 16, 16]} /><meshStandardMaterial color="#FFFFFF" roughness={1.0} /></mesh>
                <mesh position={[15, -1, 0.5]}><sphereGeometry args={[6, 16, 16]} /><meshStandardMaterial color="#F8FBFF" roughness={1.0} /></mesh>
                <mesh position={[22, -0.5, 0]}><sphereGeometry args={[5, 16, 16]} /><meshStandardMaterial color="#F5F5FF" roughness={1.0} /></mesh>
                <mesh position={[7, 5.5, 0]}><sphereGeometry args={[5.5, 16, 16]} /><meshStandardMaterial color="#FFFFFF" roughness={1.0} /></mesh>
                <mesh position={[14, 6, 0]}><sphereGeometry args={[5, 16, 16]} /><meshStandardMaterial color="#F0F4FF" roughness={1.0} /></mesh>
                <mesh position={[20, 5, 0]}><sphereGeometry args={[4, 16, 16]} /><meshStandardMaterial color="#FFFFFF" roughness={1.0} /></mesh>
            </group>

            {/* Cloud 8 — tiny puff, high and distant */}
            <group position={[20, 52, -80]}>
                <mesh><sphereGeometry args={[2.5, 16, 16]} /><meshStandardMaterial color="#FFFFFF" roughness={1.0} /></mesh>
                <mesh position={[3.5, 0, 0]}><sphereGeometry args={[3.5, 16, 16]} /><meshStandardMaterial color="#F8FBFF" roughness={1.0} /></mesh>
                <mesh position={[7, 0, 0]}><sphereGeometry args={[2.5, 16, 16]} /><meshStandardMaterial color="#F5F8FF" roughness={1.0} /></mesh>
                <mesh position={[3.5, 2.5, 0]}><sphereGeometry args={[2.5, 16, 16]} /><meshStandardMaterial color="#FFFFFF" roughness={1.0} /></mesh>
            </group>

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
                        path={ROAD_PATHS[v.pathIndex].points}
                        speed={v.speed}
                        color={v.color}
                        startOffset={v.startOffset}
                    />
                ))}

                {emergencyVehicles.map((id, i) => (
                    <Vehicle
                        key={`emg-${id}`}
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
