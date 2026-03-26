"use client";
import { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { trafficStore, SignalState } from "@/lib/trafficStore";

export interface TrafficLightProps {
    position: [number, number, number];
    rotation?: [number, number, number];
    signalId: string;
    controlsAxis: "x" | "z";
    manualState: SignalState;
}

export default function TrafficLight({
    position,
    rotation = [0, 0, 0],
    signalId,
    controlsAxis,
    manualState,
}: TrafficLightProps) {
    const stateRef = useRef<SignalState>(manualState);

    // Sync ref when props change
    useEffect(() => {
        stateRef.current = manualState;
    }, [manualState]);

    useFrame(() => {
        // Push state to global store for vehicles
        trafficStore.updateSignal(signalId, { position, state: stateRef.current, controlsAxis });
    });

    const lightColors: Record<SignalState, string> = {
        RED: "#FF3366",
        YELLOW: "#FFD600",
        GREEN: "#00E676",
    };

    return (
        <group position={position} rotation={rotation}>
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
                const active = manualState === l;
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

        </group>
    );
}
