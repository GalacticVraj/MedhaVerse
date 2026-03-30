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

// One signal lamp compartment with blocky visor hood
function LampCompartment({
    y,
    lightColor,
    active,
}: {
    y: number;
    lightColor: string;
    active: boolean;
}) {
    const housingColor = "#262b3a";

    return (
        <group position={[0, y, 0]}>
            {/* Compartment housing box */}
            <mesh castShadow>
                <boxGeometry args={[0.7, 0.6, 0.5]} />
                <meshStandardMaterial color={housingColor} roughness={0.8} />
            </mesh>

            {/* The light lens (blocky square) */}
            <mesh position={[0, 0, 0.26]}>
                <planeGeometry args={[0.4, 0.4]} />
                <meshStandardMaterial
                    color={lightColor}
                    emissive={lightColor}
                    emissiveIntensity={active ? 3 : 0.05}
                    roughness={0.1}
                />
            </mesh>

            {/* Visor hood (blocky overhang) */}
            <mesh position={[0, 0.25, 0.4]} castShadow>
                <boxGeometry args={[0.7, 0.1, 0.4]} />
                <meshStandardMaterial color={housingColor} roughness={0.8} />
            </mesh>
            
            {/* Visor Sides */}
            <mesh position={[-0.3, 0.0, 0.4]} castShadow>
                <boxGeometry args={[0.1, 0.4, 0.4]} />
                <meshStandardMaterial color={housingColor} roughness={0.8} />
            </mesh>
            <mesh position={[0.3, 0.0, 0.4]} castShadow>
                <boxGeometry args={[0.1, 0.4, 0.4]} />
                <meshStandardMaterial color={housingColor} roughness={0.8} />
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
        RED:    "#FF3333",
        YELLOW: "#FFCC00",
        GREEN:  "#33FF55",
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
            {/* ---- Blocky Pole ---- */}
            <mesh position={[0, 1.8, 0]} castShadow>
                <boxGeometry args={[0.15, 3.6, 0.15]} />
                <meshStandardMaterial color="#222" roughness={0.8} />
            </mesh>

            {/* ---- Blocky Pole base flange ---- */}
            <mesh position={[0, 0.15, 0]}>
                <boxGeometry args={[0.4, 0.3, 0.4]} />
                <meshStandardMaterial color="#333" roughness={0.8} />
            </mesh>

            {/* ---- Mounting bracket arm ---- */}
            <mesh position={[0, 3.7, 0.25]} castShadow>
                <boxGeometry args={[0.15, 0.15, 0.5]} />
                <meshStandardMaterial color="#222" roughness={0.8} />
            </mesh>

            {/* ---- Three lamp compartments (RED=top, YELLOW=mid, GREEN=bottom) ---- */}
            <group position={[0, -0.4, 0.4]}>
                {/* Main backplate */}
                <mesh position={[0, 4.15, -0.1]}>
                     <boxGeometry args={[0.8, 2.0, 0.3]} />
                     <meshStandardMaterial color="#111" roughness={0.9} />
                </mesh>
                
                {lightOrder.map((l, i) => (
                    <LampCompartment
                        key={l}
                        y={4.75 - i * 0.6}
                        lightColor={lightColors[l]}
                        active={state === l}
                    />
                ))}
            </group>

            {/* ---- Clickable selection box (instead of ring) ---- */}
            <mesh position={[0, 3.8, 0.6]}>
                <boxGeometry args={[1.5, 3.0, 1.5]} />
                <meshBasicMaterial color="#00E0FF" transparent opacity={0.0} side={THREE.DoubleSide} />
            </mesh>
        </group>
    );
}
