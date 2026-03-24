"use client";
import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { trafficStore } from "@/lib/trafficStore";

interface VehicleProps {
    vehicleId: string;
    path: [number, number, number][];
    speed?: number;
    color?: string;
    isEmergency?: boolean;
    startOffset?: number;
}

export default function Vehicle({ vehicleId, path, speed = 8, color = "#00E0FF", isEmergency = false, startOffset = 0 }: VehicleProps) {
    const groupRef = useRef<THREE.Group>(null);
    const progressRef = useRef(startOffset);
    const sirenTimeRef = useRef(0);
    const sirenRedMatRef = useRef<THREE.MeshStandardMaterial>(null);
    const sirenBlueMatRef = useRef<THREE.MeshStandardMaterial>(null);
    const currentSpeedRef = useRef(speed);

    // Clean up on unmount
    useEffect(() => {
        return () => {
            trafficStore.removeVehicle(vehicleId);
        };
    }, [vehicleId]);

    // Determine axis and direction from path
    const travelAxis = useRef<"x" | "z">("x");
    const travelDir = useRef<number>(1);
    if (path.length >= 2) {
        const dx = path[1][0] - path[0][0];
        const dz = path[1][2] - path[0][2];
        if (Math.abs(dx) > Math.abs(dz)) {
            travelAxis.current = "x";
            travelDir.current = Math.sign(dx);
        } else {
            travelAxis.current = "z";
            travelDir.current = Math.sign(dz);
        }
    }

    useFrame((_, delta) => {
        if (!groupRef.current || path.length < 2) return;

        // Get current position
        const pos = groupRef.current.position;

        // Update global store
        trafficStore.updateVehicle(vehicleId, pos.x, pos.z);

        // Check for collisions (directional)
        const isBlocked = trafficStore.checkCollision(vehicleId, pos.x, pos.z, travelAxis.current, travelDir.current);

        // Check traffic signals
        if (!isEmergency) {
            const result = trafficStore.shouldStop(pos.x, pos.z, travelAxis.current, travelDir.current);
            if (isBlocked || result.stop) {
                currentSpeedRef.current = THREE.MathUtils.lerp(currentSpeedRef.current, 0, delta * 15);
            } else if (result.slowDown) {
                currentSpeedRef.current = THREE.MathUtils.lerp(currentSpeedRef.current, speed * 0.3, delta * 5);
            } else {
                currentSpeedRef.current = THREE.MathUtils.lerp(currentSpeedRef.current, speed, delta * 2);
            }
        } else {
            if (isBlocked) {
                currentSpeedRef.current = THREE.MathUtils.lerp(currentSpeedRef.current, 0, delta * 15);
            } else {
                currentSpeedRef.current = THREE.MathUtils.lerp(currentSpeedRef.current, speed, delta * 2);
            }
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
        if (isEmergency && sirenRedMatRef.current && sirenBlueMatRef.current) {
            sirenTimeRef.current += delta * 10;
            const flash = Math.sin(sirenTimeRef.current) > 0;
            sirenRedMatRef.current.emissiveIntensity = flash ? 10 : 0.5;
            sirenBlueMatRef.current.emissiveIntensity = !flash ? 10 : 0.5;
        }
    });

    if (isEmergency) {
        return (
            <group ref={groupRef}>
                {/* AMBULANCE MODEL (Van Style) */}
                {/* Main Chassis */}
                <mesh castShadow position={[0, 0.35, 0]}>
                    <boxGeometry args={[1.5, 0.5, 3.2]} />
                    <meshStandardMaterial color="#EEEEEE" metalness={0.2} roughness={0.8} />
                </mesh>

                {/* Van Body (Boxy Back) */}
                <mesh castShadow position={[0, 1.1, -0.4]}>
                    <boxGeometry args={[1.4, 1.2, 2.2]} />
                    <meshStandardMaterial color="#FFFFFF" roughness={0.5} />
                </mesh>

                {/* Front Cabin Section */}
                <mesh castShadow position={[0, 0.85, 0.9]}>
                    <boxGeometry args={[1.4, 0.7, 1.0]} />
                    <meshStandardMaterial color="#FFFFFF" roughness={0.5} />
                </mesh>

                {/* Windows */}
                <mesh position={[0, 0.9, 1.0]}>
                    <boxGeometry args={[1.42, 0.45, 0.6]} />
                    <meshStandardMaterial color="#111" transparent opacity={0.6} />
                </mesh>
                <mesh position={[0.71, 1.1, -0.4]}>
                    <boxGeometry args={[0.02, 0.6, 1.6]} />
                    <meshStandardMaterial color="#111" transparent opacity={0.4} />
                </mesh>
                <mesh position={[-0.71, 1.1, -0.4]}>
                    <boxGeometry args={[0.02, 0.6, 1.6]} />
                    <meshStandardMaterial color="#111" transparent opacity={0.4} />
                </mesh>

                {/* Red Stripe Decal (as mesh) */}
                <mesh position={[0, 0.7, 0]}>
                    <boxGeometry args={[1.52, 0.2, 3.3]} />
                    <meshStandardMaterial color="#FF3366" />
                </mesh>

                {/* Bumpers */}
                <mesh position={[0, 0.3, 1.6]}>
                    <boxGeometry args={[1.6, 0.4, 0.1]} />
                    <meshStandardMaterial color="#333" />
                </mesh>
                <mesh position={[0, 0.3, -1.6]}>
                    <boxGeometry args={[1.6, 0.4, 0.1]} />
                    <meshStandardMaterial color="#333" />
                </mesh>

                {/* Light Bar (Siren) */}
                <group position={[0, 1.8, 0.3]}>
                    <mesh position={[0.3, 0, 0]} castShadow>
                        <boxGeometry args={[0.6, 0.15, 0.3]} />
                        <meshStandardMaterial ref={sirenRedMatRef} color="#FF0000" emissive="#FF0000" emissiveIntensity={5} />
                    </mesh>
                    <mesh position={[-0.3, 0, 0]} castShadow>
                        <boxGeometry args={[0.6, 0.15, 0.3]} />
                        <meshStandardMaterial ref={sirenBlueMatRef} color="#0000FF" emissive="#0000FF" emissiveIntensity={5} />
                    </mesh>
                    <mesh position={[0, -0.05, 0]}>
                        <boxGeometry args={[1.3, 0.05, 0.25]} />
                        <meshStandardMaterial color="#333" />
                    </mesh>
                </group>

                {/* Wheels */}
                {[[0.65, 0.2, 1.0], [-0.65, 0.2, 1.0], [0.65, 0.2, -1.0], [-0.65, 0.2, -1.0]].map((p, i) => (
                    <mesh key={i} position={p as [number, number, number]} rotation={[0, 0, Math.PI / 2]}>
                        <cylinderGeometry args={[0.3, 0.3, 0.25, 16]} />
                        <meshStandardMaterial color="#222" />
                    </mesh>
                ))}

                {/* Headlights */}
                <mesh position={[0.5, 0.5, 1.55]}>
                    <boxGeometry args={[0.3, 0.2, 0.1]} />
                    <meshStandardMaterial color="#FFFFAA" emissive="#FFFFAA" emissiveIntensity={4} />
                </mesh>
                <mesh position={[-0.5, 0.5, 1.55]}>
                    <boxGeometry args={[0.3, 0.2, 0.1]} />
                    <meshStandardMaterial color="#FFFFAA" emissive="#FFFFAA" emissiveIntensity={4} />
                </mesh>
            </group>
        );
    }

    return (
        <group ref={groupRef}>
            {/* Main Base Body (the "skirt" or lower section) */}
            <mesh castShadow position={[0, 0.25, 0]}>
                <boxGeometry args={[1.4, 0.35, 2.8]} />
                <meshStandardMaterial color={color} roughness={0.4} metalness={0.6} />
            </mesh>

            {/* Front Hood */}
            <mesh castShadow position={[0, 0.5, 0.8]}>
                <boxGeometry args={[1.3, 0.3, 1.0]} />
                <meshStandardMaterial color={color} roughness={0.4} metalness={0.6} />
            </mesh>

            {/* Rear Trunk */}
            <mesh castShadow position={[0, 0.5, -0.9]} rotation={[0, 0, 0]}>
                <boxGeometry args={[1.3, 0.3, 0.9]} />
                <meshStandardMaterial color={color} roughness={0.4} metalness={0.6} />
            </mesh>

            {/* Main Cabin */}
            <mesh castShadow position={[0, 0.8, -0.1]}>
                <boxGeometry args={[1.2, 0.55, 1.4]} />
                <meshStandardMaterial color={color} roughness={0.4} metalness={0.6} />
            </mesh>

            {/* Windows (embedded in cabin) */}
            <mesh position={[0, 0.82, -0.1]}>
                <boxGeometry args={[1.22, 0.45, 1.3]} />
                <meshStandardMaterial color="#111" roughness={0.1} metalness={1.0} transparent opacity={0.6} />
            </mesh>

            {/* Front Bumper — Chunky Grey */}
            <mesh castShadow position={[0, 0.3, 1.45]}>
                <boxGeometry args={[1.5, 0.4, 0.25]} />
                <meshStandardMaterial color="#333" roughness={0.8} />
            </mesh>
            {/* Front Bumper Guard */}
            <mesh castShadow position={[0, 0.4, 1.55]}>
                <boxGeometry args={[0.9, 0.35, 0.1]} />
                <meshStandardMaterial color="#444" roughness={0.8} />
            </mesh>

            {/* Rear Bumper — Chunky Grey */}
            <mesh castShadow position={[0, 0.3, -1.45]}>
                <boxGeometry args={[1.5, 0.4, 0.25]} />
                <meshStandardMaterial color="#333" roughness={0.8} />
            </mesh>

            {/* Grille */}
            <mesh position={[0, 0.45, 1.4]}>
                <boxGeometry args={[0.7, 0.2, 0.05]} />
                <meshStandardMaterial color="#111" />
            </mesh>

            {/* Side Mirrors */}
            <group position={[0.75, 0.65, 0.4]}>
                <mesh castShadow>
                    <boxGeometry args={[0.15, 0.15, 0.2]} />
                    <meshStandardMaterial color={color} />
                </mesh>
                <mesh position={[0.08, 0, 0]}>
                    <boxGeometry args={[0.02, 0.1, 0.15]} />
                    <meshStandardMaterial color="#111" />
                </mesh>
            </group>
            <group position={[-0.75, 0.65, 0.4]}>
                <mesh castShadow>
                    <boxGeometry args={[0.15, 0.15, 0.2]} />
                    <meshStandardMaterial color={color} />
                </mesh>
                <mesh position={[-0.08, 0, 0]}>
                    <boxGeometry args={[0.02, 0.1, 0.15]} />
                    <meshStandardMaterial color="#111" />
                </mesh>
            </group>

            {/* Wheels */}
            {[
                [0.6, 0.15, 0.9], [-0.6, 0.15, 0.9],
                [0.6, 0.15, -0.9], [-0.6, 0.15, -0.9]
            ].map((p, i) => (
                <group key={i} position={p as [number, number, number]} rotation={[0, 0, Math.PI / 2]}>
                    <mesh>
                        <cylinderGeometry args={[0.25, 0.25, 0.2, 16]} />
                        <meshStandardMaterial color="#111" roughness={0.9} />
                    </mesh>
                    <mesh position={[0, 0.11, 0]}>
                        <cylinderGeometry args={[0.12, 0.12, 0.05, 16]} />
                        <meshStandardMaterial color="#777" metalness={1} roughness={0.2} />
                    </mesh>
                </group>
            ))}

            {/* Headlights (emissive glow) */}
            <mesh position={[0.45, 0.45, 1.35]}>
                <boxGeometry args={[0.3, 0.2, 0.1]} />
                <meshStandardMaterial color="#FFFFAA" emissive="#FFFFAA" emissiveIntensity={3} />
            </mesh>
            <mesh position={[-0.45, 0.45, 1.35]}>
                <boxGeometry args={[0.3, 0.2, 0.1]} />
                <meshStandardMaterial color="#FFFFAA" emissive="#FFFFAA" emissiveIntensity={3} />
            </mesh>

            {/* Turn signals below headlights */}
            <mesh position={[0.45, 0.25, 1.55]}>
                <boxGeometry args={[0.15, 0.1, 0.05]} />
                <meshStandardMaterial color="#FF9900" emissive="#FF9900" emissiveIntensity={2} />
            </mesh>
            <mesh position={[-0.45, 0.25, 1.55]}>
                <boxGeometry args={[0.15, 0.1, 0.05]} />
                <meshStandardMaterial color="#FF9900" emissive="#FF9900" emissiveIntensity={2} />
            </mesh>

            {/* Brake lights — glow brighter when stopping */}
            <mesh position={[0.5, 0.45, -1.35]}>
                <boxGeometry args={[0.2, 0.3, 0.1]} />
                <meshStandardMaterial color="#FF0000" emissive="#FF0000" emissiveIntensity={currentSpeedRef.current < speed * 0.5 ? 6 : 2} />
            </mesh>
            <mesh position={[-0.5, 0.45, -1.35]}>
                <boxGeometry args={[0.2, 0.3, 0.1]} />
                <meshStandardMaterial color="#FF0000" emissive="#FF0000" emissiveIntensity={currentSpeedRef.current < speed * 0.5 ? 6 : 2} />
            </mesh>

            {/* Roof taxi/cargo box — if it happens to be yellow or randomized */}
            {(color === "#FFD600" || Math.random() > 0.8) && !isEmergency && (
                <mesh position={[0, 1.15, -0.1]}>
                    <boxGeometry args={[0.5, 0.2, 0.15]} />
                    <meshStandardMaterial color="#FFD600" emissive="#FFD600" emissiveIntensity={0.5} />
                </mesh>
            )}
        </group>
    );
}

