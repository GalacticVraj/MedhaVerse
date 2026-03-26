"use client";
import { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { trafficStore, SignalState } from "@/lib/trafficStore";

export interface TrafficLightConfig {
    greenDuration: number;
    redDuration: number;
    yellowDuration: number;
}

interface TrafficLightProps {
    position: [number, number, number];
    rotation?: [number, number, number];
    config: TrafficLightConfig;
    initialState?: SignalState;
    onClick?: () => void;
    signalId: string;
    controlsAxis: "x" | "z";
}

// One signal lamp compartment with visor hood
function LampCompartment({
    y,
    lightColor,
    active,
}: {
    y: number;
    lightColor: string;
    active: boolean;
}) {
    const housingColor = "#2E3344";
    const rimColor = "#3A3F55";

    return (
        <group position={[0, y, 0]}>
            {/* Compartment housing box */}
            <mesh castShadow>
                <boxGeometry args={[0.72, 0.58, 0.55]} />
                <meshStandardMaterial color={housingColor} roughness={0.6} metalness={0.4} />
            </mesh>

            {/* Reflector bowl (inner back — slightly concave look) */}
            <mesh position={[0, 0, 0.2]}>
                <cylinderGeometry args={[0.24, 0.28, 0.05, 24]} />
                <meshStandardMaterial color="#1a1a2a" roughness={0.2} metalness={0.8} />
            </mesh>

            {/* The light lens (round glowing circle) */}
            <mesh position={[0, 0, 0.28]}>
                <circleGeometry args={[0.22, 32]} />
                <meshStandardMaterial
                    color={lightColor}
                    emissive={lightColor}
                    emissiveIntensity={active ? 6 : 0.08}
                    roughness={0.1}
                    transparent
                    opacity={active ? 1.0 : 0.35}
                />
            </mesh>

            {/* Inner bright highlight dot */}
            {active && (
                <mesh position={[-0.06, 0.07, 0.29]}>
                    <circleGeometry args={[0.06, 16]} />
                    <meshStandardMaterial color="#FFFFFF" emissive="#FFFFFF" emissiveIntensity={3} transparent opacity={0.5} />
                </mesh>
            )}

            {/* Lens rim ring */}
            <mesh position={[0, 0, 0.275]}>
                <ringGeometry args={[0.22, 0.27, 32]} />
                <meshStandardMaterial color={rimColor} metalness={0.9} roughness={0.2} />
            </mesh>

            {/* Visor hood (the side flap that blocks sun glare) */}
            <mesh position={[0, 0.2, 0.28]} rotation={[-Math.PI / 6, 0, 0]} castShadow>
                <boxGeometry args={[0.68, 0.08, 0.35]} />
                <meshStandardMaterial color={housingColor} roughness={0.7} metalness={0.3} />
            </mesh>

            {/* Side visor left */}
            <mesh position={[-0.34, 0.04, 0.1]} castShadow>
                <boxGeometry args={[0.04, 0.42, 0.45]} />
                <meshStandardMaterial color={housingColor} roughness={0.7} />
            </mesh>
            {/* Side visor right */}
            <mesh position={[0.34, 0.04, 0.1]} castShadow>
                <boxGeometry args={[0.04, 0.42, 0.45]} />
                <meshStandardMaterial color={housingColor} roughness={0.7} />
            </mesh>

            {/* Horizontal divider strips between compartments */}
            <mesh position={[0, 0.29, 0]}>
                <boxGeometry args={[0.76, 0.06, 0.58]} />
                <meshStandardMaterial color="#1E2233" roughness={0.5} />
            </mesh>
        </group>
    );
}

export default function TrafficLight({
    position,
    rotation = [0, 0, 0],
    config,
    initialState = "GREEN",
    onClick,
    signalId,
    controlsAxis,
}: TrafficLightProps) {
    const [state, setState] = useState<SignalState>(initialState);
    const configRef = useRef<TrafficLightConfig>(config);
    const timerRef = useRef(initialState === "GREEN" ? config.greenDuration : config.redDuration);

    useEffect(() => {
        configRef.current = config;
    }, [config]);

    useFrame((_, delta) => {
        timerRef.current -= delta;
        if (timerRef.current <= 0) {
            let newState: SignalState;
            if (state === "GREEN") {
                newState = "YELLOW";
                timerRef.current = configRef.current.yellowDuration;
            } else if (state === "YELLOW") {
                newState = "RED";
                timerRef.current = configRef.current.redDuration;
            } else {
                newState = "GREEN";
                timerRef.current = configRef.current.greenDuration;
            }
            setState(newState);
        }
        trafficStore.updateSignal(signalId, { position, state, controlsAxis });
    });

    const lightColors: Record<SignalState, string> = {
        RED:    "#FF2222",
        YELLOW: "#FFAA00",
        GREEN:  "#22CC44",
    };

    const lightOrder: SignalState[] = ["RED", "YELLOW", "GREEN"];

    return (
        <group
            position={position}
            rotation={rotation}
            onClick={(e) => {
                e.stopPropagation();
                onClick?.();
            }}
        >
            {/* ---- Pole ---- */}
            <mesh position={[0, 1.8, 0]} castShadow>
                <cylinderGeometry args={[0.07, 0.10, 3.6, 12]} />
                <meshStandardMaterial color="#2E3344" roughness={0.5} metalness={0.6} />
            </mesh>

            {/* ---- Pole base flange ---- */}
            <mesh position={[0, 0.12, 0]}>
                <cylinderGeometry args={[0.2, 0.22, 0.24, 12]} />
                <meshStandardMaterial color="#222633" roughness={0.6} metalness={0.5} />
            </mesh>

            {/* ---- Mounting bracket arm ---- */}
            <mesh position={[0, 3.7, 0.25]} rotation={[Math.PI / 2, 0, 0]} castShadow>
                <cylinderGeometry args={[0.04, 0.04, 0.5, 8]} />
                <meshStandardMaterial color="#2E3344" metalness={0.6} roughness={0.4} />
            </mesh>

            {/* ---- Main housing back spine ---- */}
            <mesh position={[0, 3.55, 0.05]} castShadow>
                <boxGeometry args={[0.76, 2.1, 0.12]} />
                <meshStandardMaterial color="#1E2233" roughness={0.6} metalness={0.3} />
            </mesh>

            {/* ---- Three lamp compartments (RED=top, YELLOW=mid, GREEN=bottom) ---- */}
            {lightOrder.map((l, i) => (
                <LampCompartment
                    key={l}
                    y={4.5 - i * 0.68}
                    lightColor={lightColors[l]}
                    active={state === l}
                />
            ))}

            {/* ---- Housing cap top ---- */}
            <mesh position={[0, 4.92, 0.02]} castShadow>
                <boxGeometry args={[0.76, 0.14, 0.58]} />
                <meshStandardMaterial color="#1E2233" roughness={0.5} metalness={0.4} />
            </mesh>
            {/* ---- Housing cap bottom ---- */}
            <mesh position={[0, 3.0, 0.02]} castShadow>
                <boxGeometry args={[0.76, 0.14, 0.58]} />
                <meshStandardMaterial color="#1E2233" roughness={0.5} metalness={0.4} />
            </mesh>

            {/* ---- Side back panel flanges ---- */}
            <mesh position={[-0.42, 3.82, 0.05]}>
                <boxGeometry args={[0.1, 0.8, 0.55]} />
                <meshStandardMaterial color="#252838" roughness={0.6} />
            </mesh>
            <mesh position={[0.42, 3.82, 0.05]}>
                <boxGeometry args={[0.1, 0.8, 0.55]} />
                <meshStandardMaterial color="#252838" roughness={0.6} />
            </mesh>

            {/* ---- Clickable selection ring ---- */}
            <mesh position={[0, 3.8, 0.6]}>
                <ringGeometry args={[0.9, 1.0, 32]} />
                <meshBasicMaterial color="#00E0FF" transparent opacity={0.15} side={THREE.DoubleSide} />
            </mesh>
        </group>
    );
}
