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

// -------- Car type sub-components --------

function Wheel({ x, z }: { x: number; z: number }) {
    return (
        <group position={[x, 0.14, z]}>
            <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
                <cylinderGeometry args={[0.18, 0.18, 0.12, 16]} />
                <meshStandardMaterial color="#222" roughness={0.9} />
            </mesh>
            {/* Rim */}
            <mesh rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.1, 0.1, 0.13, 8]} />
                <meshStandardMaterial color="#aaa" metalness={0.9} roughness={0.2} />
            </mesh>
        </group>
    );
}

/** Sports car — low, wide, wedge silhouette */
function SportsCar({ color }: { color: string }) {
    return (
        <group>
            {/* Body */}
            <mesh castShadow position={[0, 0.22, 0]}>
                <boxGeometry args={[1.3, 0.28, 2.6]} />
                <meshStandardMaterial color={color} roughness={0.3} metalness={0.6} />
            </mesh>
            {/* Rear haunches */}
            <mesh castShadow position={[0, 0.32, -0.5]}>
                <boxGeometry args={[1.25, 0.18, 1.0]} />
                <meshStandardMaterial color={color} roughness={0.3} metalness={0.6} />
            </mesh>
            {/* Low sleek cabin */}
            <mesh castShadow position={[0, 0.48, 0.1]}>
                <boxGeometry args={[1.05, 0.22, 1.1]} />
                <meshStandardMaterial color="#1a1a2e" roughness={0.1} metalness={0.2} transparent opacity={0.7} />
            </mesh>
            {/* Front splitter */}
            <mesh castShadow position={[0, 0.1, 1.3]}>
                <boxGeometry args={[1.1, 0.06, 0.15]} />
                <meshStandardMaterial color="#111" />
            </mesh>
            {/* Rear spoiler */}
            <mesh castShadow position={[0, 0.48, -1.25]}>
                <boxGeometry args={[1.0, 0.08, 0.12]} />
                <meshStandardMaterial color="#111" />
            </mesh>
            {/* Headlights */}
            <mesh position={[0.4, 0.22, 1.31]}>
                <boxGeometry args={[0.25, 0.1, 0.05]} />
                <meshStandardMaterial color="#FFFFCC" emissive="#FFFAAA" emissiveIntensity={4} />
            </mesh>
            <mesh position={[-0.4, 0.22, 1.31]}>
                <boxGeometry args={[0.25, 0.1, 0.05]} />
                <meshStandardMaterial color="#FFFFCC" emissive="#FFFAAA" emissiveIntensity={4} />
            </mesh>
            {/* Tail lights */}
            <mesh position={[0.4, 0.22, -1.31]}>
                <boxGeometry args={[0.2, 0.08, 0.04]} />
                <meshStandardMaterial color="#FF2222" emissive="#FF2222" emissiveIntensity={3} />
            </mesh>
            <mesh position={[-0.4, 0.22, -1.31]}>
                <boxGeometry args={[0.2, 0.08, 0.04]} />
                <meshStandardMaterial color="#FF2222" emissive="#FF2222" emissiveIntensity={3} />
            </mesh>
            {/* Wheels */}
            <Wheel x={0.65} z={0.9} />
            <Wheel x={-0.65} z={0.9} />
            <Wheel x={0.65} z={-0.9} />
            <Wheel x={-0.65} z={-0.9} />
        </group>
    );
}

/** Sedan/SUV — taller, rounder silhouette */
function SedanSUV({ color }: { color: string }) {
    return (
        <group>
            {/* Body */}
            <mesh castShadow position={[0, 0.28, 0]}>
                <boxGeometry args={[1.3, 0.38, 2.6]} />
                <meshStandardMaterial color={color} roughness={0.4} metalness={0.5} />
            </mesh>
            {/* Cabin */}
            <mesh castShadow position={[0, 0.65, -0.1]}>
                <boxGeometry args={[1.15, 0.44, 1.5]} />
                <meshStandardMaterial color={color} roughness={0.4} metalness={0.5} />
            </mesh>
            {/* Windshields */}
            <mesh castShadow position={[0, 0.65, 0.66]}>
                <boxGeometry args={[1.0, 0.4, 0.04]} />
                <meshStandardMaterial color="#1a2a4a" roughness={0.05} metalness={0.3} transparent opacity={0.6} />
            </mesh>
            <mesh castShadow position={[0, 0.65, -0.76]}>
                <boxGeometry args={[1.0, 0.4, 0.04]} />
                <meshStandardMaterial color="#1a2a4a" roughness={0.05} metalness={0.3} transparent opacity={0.6} />
            </mesh>
            {/* Side windows */}
            <mesh position={[0.58, 0.67, 0]} rotation={[0, Math.PI / 2, 0]}>
                <boxGeometry args={[1.0, 0.3, 0.03]} />
                <meshStandardMaterial color="#1a2a4a" roughness={0.05} transparent opacity={0.6} />
            </mesh>
            <mesh position={[-0.58, 0.67, 0]} rotation={[0, Math.PI / 2, 0]}>
                <boxGeometry args={[1.0, 0.3, 0.03]} />
                <meshStandardMaterial color="#1a2a4a" roughness={0.05} transparent opacity={0.6} />
            </mesh>
            {/* Grille */}
            <mesh position={[0, 0.25, 1.31]}>
                <boxGeometry args={[0.7, 0.18, 0.04]} />
                <meshStandardMaterial color="#333" metalness={0.8} />
            </mesh>
            {/* Headlights */}
            <mesh position={[0.42, 0.28, 1.32]}>
                <boxGeometry args={[0.22, 0.14, 0.04]} />
                <meshStandardMaterial color="#DDEEFF" emissive="#BBDDFF" emissiveIntensity={3} />
            </mesh>
            <mesh position={[-0.42, 0.28, 1.32]}>
                <boxGeometry args={[0.22, 0.14, 0.04]} />
                <meshStandardMaterial color="#DDEEFF" emissive="#BBDDFF" emissiveIntensity={3} />
            </mesh>
            {/* Tail lights */}
            <mesh position={[0.42, 0.28, -1.32]}>
                <boxGeometry args={[0.2, 0.12, 0.04]} />
                <meshStandardMaterial color="#FF2222" emissive="#FF2222" emissiveIntensity={3} />
            </mesh>
            <mesh position={[-0.42, 0.28, -1.32]}>
                <boxGeometry args={[0.2, 0.12, 0.04]} />
                <meshStandardMaterial color="#FF2222" emissive="#FF2222" emissiveIntensity={3} />
            </mesh>
            {/* Wheels */}
            <Wheel x={0.68} z={0.9} />
            <Wheel x={-0.68} z={0.9} />
            <Wheel x={0.68} z={-0.9} />
            <Wheel x={-0.68} z={-0.9} />
        </group>
    );
}

/** Pickup truck — tall cab, flat bed */
function PickupTruck({ color }: { color: string }) {
    return (
        <group>
            {/* Cab */}
            <mesh castShadow position={[0, 0.45, 0.55]}>
                <boxGeometry args={[1.4, 0.9, 1.2]} />
                <meshStandardMaterial color={color} roughness={0.5} metalness={0.3} />
            </mesh>
            {/* Cab windshield */}
            <mesh position={[0, 0.65, 1.15]}>
                <boxGeometry args={[1.2, 0.5, 0.04]} />
                <meshStandardMaterial color="#1a2a3a" roughness={0.1} transparent opacity={0.6} />
            </mesh>
            {/* Truck bed */}
            <mesh castShadow position={[0, 0.28, -0.75]}>
                <boxGeometry args={[1.4, 0.2, 1.5]} />
                <meshStandardMaterial color={color} roughness={0.6} />
            </mesh>
            {/* Bed side rail L */}
            <mesh castShadow position={[0.65, 0.48, -0.75]}>
                <boxGeometry args={[0.1, 0.2, 1.5]} />
                <meshStandardMaterial color={color} roughness={0.6} />
            </mesh>
            {/* Bed side rail R */}
            <mesh castShadow position={[-0.65, 0.48, -0.75]}>
                <boxGeometry args={[0.1, 0.2, 1.5]} />
                <meshStandardMaterial color={color} roughness={0.6} />
            </mesh>
            {/* Base chassis */}
            <mesh castShadow position={[0, 0.12, 0]}>
                <boxGeometry args={[1.3, 0.12, 2.8]} />
                <meshStandardMaterial color="#333" roughness={0.9} />
            </mesh>
            {/* Grille */}
            <mesh position={[0, 0.3, 1.41]}>
                <boxGeometry args={[0.9, 0.3, 0.04]} />
                <meshStandardMaterial color="#444" metalness={0.6} />
            </mesh>
            {/* Headlights */}
            <mesh position={[0.45, 0.32, 1.42]}>
                <boxGeometry args={[0.25, 0.18, 0.04]} />
                <meshStandardMaterial color="#FFFFCC" emissive="#FFFFAA" emissiveIntensity={4} />
            </mesh>
            <mesh position={[-0.45, 0.32, 1.42]}>
                <boxGeometry args={[0.25, 0.18, 0.04]} />
                <meshStandardMaterial color="#FFFFCC" emissive="#FFFFAA" emissiveIntensity={4} />
            </mesh>
            <Wheel x={0.72} z={0.85} />
            <Wheel x={-0.72} z={0.85} />
            <Wheel x={0.72} z={-0.85} />
            <Wheel x={-0.72} z={-0.85} />
        </group>
    );
}

/** City bus — long, boxy, lots of windows */
function CityBus({ color }: { color: string }) {
    const busBodyColor = color;
    const busTopColor = "#DAEAF5";
    return (
        <group>
            {/* Bus body lower */}
            <mesh castShadow position={[0, 0.45, 0]}>
                <boxGeometry args={[1.5, 0.65, 4.6]} />
                <meshStandardMaterial color={busBodyColor} roughness={0.6} metalness={0.2} />
            </mesh>
            {/* Bus body upper */}
            <mesh castShadow position={[0, 1.05, 0]}>
                <boxGeometry args={[1.45, 0.55, 4.6]} />
                <meshStandardMaterial color={busTopColor} roughness={0.5} />
            </mesh>
            {/* Window strip — front windows */}
            {[-1.5, -0.5, 0.5, 1.5].map((z, i) => (
                <mesh key={`bw-${i}`} position={[0.74, 1.05, z]}>
                    <boxGeometry args={[0.04, 0.32, 0.6]} />
                    <meshStandardMaterial color="#1a2a4a" roughness={0.1} transparent opacity={0.65} />
                </mesh>
            ))}
            {[-1.5, -0.5, 0.5, 1.5].map((z, i) => (
                <mesh key={`bwr-${i}`} position={[-0.74, 1.05, z]}>
                    <boxGeometry args={[0.04, 0.32, 0.6]} />
                    <meshStandardMaterial color="#1a2a4a" roughness={0.1} transparent opacity={0.65} />
                </mesh>
            ))}
            {/* Windshield */}
            <mesh position={[0, 1.0, 2.31]}>
                <boxGeometry args={[1.3, 0.45, 0.04]} />
                <meshStandardMaterial color="#1a2a4a" roughness={0.05} transparent opacity={0.7} />
            </mesh>
            {/* Headlights */}
            <mesh position={[0.5, 0.5, 2.32]}>
                <boxGeometry args={[0.3, 0.18, 0.04]} />
                <meshStandardMaterial color="#DDEEFF" emissive="#BBDDFF" emissiveIntensity={3} />
            </mesh>
            <mesh position={[-0.5, 0.5, 2.32]}>
                <boxGeometry args={[0.3, 0.18, 0.04]} />
                <meshStandardMaterial color="#DDEEFF" emissive="#BBDDFF" emissiveIntensity={3} />
            </mesh>
            {/* Tail lights */}
            <mesh position={[0.5, 0.5, -2.32]}>
                <boxGeometry args={[0.3, 0.18, 0.04]} />
                <meshStandardMaterial color="#FF2222" emissive="#FF2222" emissiveIntensity={2} />
            </mesh>
            <mesh position={[-0.5, 0.5, -2.32]}>
                <boxGeometry args={[0.3, 0.18, 0.04]} />
                <meshStandardMaterial color="#FF2222" emissive="#FF2222" emissiveIntensity={2} />
            </mesh>
            {/* 4 wheels per side */}
            <Wheel x={0.78} z={1.5} />
            <Wheel x={-0.78} z={1.5} />
            <Wheel x={0.78} z={0.3} />
            <Wheel x={-0.78} z={0.3} />
            <Wheel x={0.78} z={-1.2} />
            <Wheel x={-0.78} z={-1.2} />
        </group>
    );
}

// -------- Emergency Vehicle --------
function EmergencyVehicle() {
    const sirenMatRef = useRef<THREE.MeshStandardMaterial>(null);
    const timeRef = useRef(0);
    useFrame((_, delta) => {
        timeRef.current += delta * 8;
        if (sirenMatRef.current) {
            const flash = Math.sin(timeRef.current) > 0;
            sirenMatRef.current.emissive.set(flash ? "#FF0000" : "#0000FF");
            sirenMatRef.current.emissiveIntensity = 6;
        }
    });
    return (
        <group>
            <mesh castShadow position={[0, 0.35, 0]}>
                <boxGeometry args={[1.3, 0.55, 2.8]} />
                <meshStandardMaterial color="#FFFFFF" roughness={0.4} />
            </mesh>
            <mesh castShadow position={[0, 0.75, 0]}>
                <boxGeometry args={[1.2, 0.38, 1.6]} />
                <meshStandardMaterial color="#FFFFFF" roughness={0.4} />
            </mesh>
            {/* Siren bar */}
            <mesh position={[0, 1.0, 0]}>
                <boxGeometry args={[0.8, 0.15, 0.35]} />
                <meshStandardMaterial ref={sirenMatRef} color="#FF0000" emissive="#FF0000" emissiveIntensity={6} />
            </mesh>
            {/* Headlights */}
            <mesh position={[0.42, 0.3, 1.42]}>
                <boxGeometry args={[0.22, 0.16, 0.04]} />
                <meshStandardMaterial color="#FFFFCC" emissive="#FFFFAA" emissiveIntensity={5} />
            </mesh>
            <mesh position={[-0.42, 0.3, 1.42]}>
                <boxGeometry args={[0.22, 0.16, 0.04]} />
                <meshStandardMaterial color="#FFFFCC" emissive="#FFFFAA" emissiveIntensity={5} />
            </mesh>
            <Wheel x={0.68} z={0.9} />
            <Wheel x={-0.68} z={0.9} />
            <Wheel x={0.68} z={-0.9} />
            <Wheel x={-0.68} z={-0.9} />
        </group>
    );
}

// -------- Main Vehicle Component --------
export default function Vehicle({ path, speed = 8, color = "#E05A00", isEmergency = false, startOffset = 0 }: VehicleProps) {
    const groupRef = useRef<THREE.Group>(null);
    const progressRef = useRef(startOffset);
    const currentSpeedRef = useRef(speed);

    const travelAxis = useRef<"x" | "z">("x");
    if (path.length >= 2) {
        const dx = Math.abs(path[1][0] - path[0][0]);
        const dz = Math.abs(path[1][2] - path[0][2]);
        travelAxis.current = dx > dz ? "x" : "z";
    }

    // Deterministic vehicle type from startOffset
    const vehicleType = Math.floor(Math.abs(startOffset * 13 + 7)) % 4;

    useFrame((_, delta) => {
        if (!groupRef.current || path.length < 2) return;
        const pos = groupRef.current.position;

        if (!isEmergency) {
            const result = trafficStore.shouldStop(pos.x, pos.z, travelAxis.current);
            if (result.stop) {
                currentSpeedRef.current = THREE.MathUtils.lerp(currentSpeedRef.current, 0, delta * 5);
            } else if (result.slowDown) {
                currentSpeedRef.current = THREE.MathUtils.lerp(currentSpeedRef.current, speed * 0.3, delta * 3);
            } else {
                currentSpeedRef.current = THREE.MathUtils.lerp(currentSpeedRef.current, speed, delta * 2);
            }
        } else {
            currentSpeedRef.current = speed;
        }

        progressRef.current += delta * currentSpeedRef.current;

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
                groupRef.current.rotation.y = Math.atan2(dx, dz);
                break;
            }
            accumulated += segLength;
        }
    });

    return (
        <group ref={groupRef}>
            {isEmergency ? (
                <EmergencyVehicle />
            ) : (
                <>
                    {vehicleType === 0 && <SportsCar color={color} />}
                    {vehicleType === 1 && <SedanSUV color={color} />}
                    {vehicleType === 2 && <PickupTruck color={color} />}
                    {vehicleType === 3 && <CityBus color={color} />}
                </>
            )}
        </group>
    );
}
