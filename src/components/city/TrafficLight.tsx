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

    // When config prop changes (user clicks Apply), update the ref immediately
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
        // Push state to global store for vehicles
        trafficStore.updateSignal(signalId, { position, state, controlsAxis });
    });

    const lightColors: Record<SignalState, string> = {
        RED: "#FF3366",
        YELLOW: "#FFD600",
        GREEN: "#00E676",
    };

    return (
        <group
            position={position}
            rotation={rotation}
            onClick={(e) => {
                e.stopPropagation();
                onClick?.();
            }}
        >
            {/* Pole */}
            <mesh position={[0, 1.5, 0]} castShadow>
                <cylinderGeometry args={[0.08, 0.08, 3]} />
                <meshStandardMaterial color="#444" metalness={0.8} roughness={0.3} />
            </mesh>

            {/* Housing */}
            <mesh position={[0, 3.2, 0]} castShadow>
                <boxGeometry args={[0.5, 1.4, 0.4]} />
                <meshStandardMaterial color="#1a1a1a" roughness={0.8} />
            </mesh>

            {/* Lights */}
            {(["RED", "YELLOW", "GREEN"] as SignalState[]).map((l, i) => {
                const y = 3.6 - i * 0.4;
                const active = state === l;
                return (
                    <mesh key={l} position={[0, y, 0.21]}>
                        <circleGeometry args={[0.15]} />
                        <meshStandardMaterial
                            color={lightColors[l]}
                            emissive={lightColors[l]}
                            emissiveIntensity={active ? 8 : 0.05}
                        />
                    </mesh>
                );
            })}

            {/* Clickable ring highlight */}
            <mesh position={[0, 3.2, 0.25]}>
                <ringGeometry args={[0.85, 0.95, 32]} />
                <meshBasicMaterial color="#00E0FF" transparent opacity={0.2} side={THREE.DoubleSide} />
            </mesh>
        </group>
    );
}
