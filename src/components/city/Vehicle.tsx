"use client";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { trafficStore } from "@/lib/trafficStore";

interface VehicleProps {
    path: [number, number, number][];
    speed?: number;
    color?: string;
    isEmergency?: boolean;
    startOffset?: number;
}

export default function Vehicle({ path, speed = 8, color = "#00E0FF", isEmergency = false, startOffset = 0 }: VehicleProps) {
    const groupRef = useRef<THREE.Group>(null);
    const progressRef = useRef(startOffset);
    const sirenTimeRef = useRef(0);
    const sirenMatRef = useRef<THREE.MeshStandardMaterial>(null);
    const currentSpeedRef = useRef(speed);

    // Determine which axis this vehicle travels on based on its path
    const travelAxis = useRef<"x" | "z">("x");
    if (path.length >= 2) {
        const dx = Math.abs(path[1][0] - path[0][0]);
        const dz = Math.abs(path[1][2] - path[0][2]);
        travelAxis.current = dx > dz ? "x" : "z";
    }

    useFrame((_, delta) => {
        if (!groupRef.current || path.length < 2) return;

        // Get current position
        const pos = groupRef.current.position;

        // Check traffic signals - emergency vehicles ignore signals
        if (!isEmergency) {
            const result = trafficStore.shouldStop(pos.x, pos.z, travelAxis.current);
            if (result.stop) {
                // Smoothly decelerate to stop
                currentSpeedRef.current = THREE.MathUtils.lerp(currentSpeedRef.current, 0, delta * 5);
            } else if (result.slowDown) {
                // Slow down approaching yellow/intersection
                currentSpeedRef.current = THREE.MathUtils.lerp(currentSpeedRef.current, speed * 0.3, delta * 3);
            } else {
                // Smoothly accelerate back to full speed
                currentSpeedRef.current = THREE.MathUtils.lerp(currentSpeedRef.current, speed, delta * 2);
            }
        } else {
            currentSpeedRef.current = speed;
        }

        progressRef.current += delta * currentSpeedRef.current;

        // Calculate total path length
        let totalLength = 0;
        for (let i = 1; i < path.length; i++) {
            const dx = path[i][0] - path[i - 1][0];
            const dz = path[i][2] - path[i - 1][2];
            totalLength += Math.sqrt(dx * dx + dz * dz);
        }

        const t = (progressRef.current % totalLength) / totalLength;

        let accumulated = 0;
        for (let i = 1; i < path.length; i++) {
            const dx = path[i][0] - path[i - 1][0];
            const dz = path[i][2] - path[i - 1][2];
            const segLength = Math.sqrt(dx * dx + dz * dz);
            const segT = (t * totalLength - accumulated) / segLength;

            if (segT >= 0 && segT <= 1) {
                const x = path[i - 1][0] + dx * segT;
                const z = path[i - 1][2] + dz * segT;
                groupRef.current.position.set(x, path[i - 1][1], z);
                const angle = Math.atan2(dx, dz);
                groupRef.current.rotation.y = angle;
                break;
            }
            accumulated += segLength;
        }

        // Emergency siren flash
        if (isEmergency && sirenMatRef.current) {
            sirenTimeRef.current += delta * 8;
            const flash = Math.sin(sirenTimeRef.current) > 0;
            sirenMatRef.current.emissive.set(flash ? "#FF0000" : "#0000FF");
            sirenMatRef.current.emissiveIntensity = 5;
        }
    });

    return (
        <group ref={groupRef}>
            {/* Car body */}
            <mesh castShadow position={[0, 0.35, 0]}>
                <boxGeometry args={[1.2, 0.5, 2.4]} />
                <meshStandardMaterial color={color} roughness={0.4} metalness={0.6} />
            </mesh>

            {/* Cabin */}
            <mesh castShadow position={[0, 0.7, -0.1]}>
                <boxGeometry args={[1, 0.35, 1.4]} />
                <meshStandardMaterial color={isEmergency ? "#FFFFFF" : "#1a1a2e"} roughness={0.3} metalness={0.2} transparent opacity={isEmergency ? 1 : 0.7} />
            </mesh>

            {/* Headlights (emissive glow) */}
            <mesh position={[0.4, 0.3, 1.2]}>
                <sphereGeometry args={[0.08]} />
                <meshStandardMaterial color="#FFFFAA" emissive="#FFFFAA" emissiveIntensity={3} />
            </mesh>
            <mesh position={[-0.4, 0.3, 1.2]}>
                <sphereGeometry args={[0.08]} />
                <meshStandardMaterial color="#FFFFAA" emissive="#FFFFAA" emissiveIntensity={3} />
            </mesh>

            {/* Brake lights — glow brighter when stopping */}
            <mesh position={[0.4, 0.3, -1.2]}>
                <sphereGeometry args={[0.08]} />
                <meshStandardMaterial color="#FF0000" emissive="#FF0000" emissiveIntensity={currentSpeedRef.current < speed * 0.5 ? 6 : 2} />
            </mesh>
            <mesh position={[-0.4, 0.3, -1.2]}>
                <sphereGeometry args={[0.08]} />
                <meshStandardMaterial color="#FF0000" emissive="#FF0000" emissiveIntensity={currentSpeedRef.current < speed * 0.5 ? 6 : 2} />
            </mesh>

            {/* Emergency siren */}
            {isEmergency && (
                <mesh position={[0, 0.95, 0]}>
                    <boxGeometry args={[0.6, 0.15, 0.3]} />
                    <meshStandardMaterial ref={sirenMatRef} color="#FF0000" emissive="#FF0000" emissiveIntensity={5} />
                </mesh>
            )}
        </group>
    );
}
