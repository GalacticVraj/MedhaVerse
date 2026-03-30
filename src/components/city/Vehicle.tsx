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
        <mesh position={[x, 0.16, z]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.16, 0.16, 0.2, 8]} />
            <meshStandardMaterial color="#222" roughness={0.9} />
        </mesh>
    );
}

/** Compact Car — boxy flat 3-section design */
function CompactCar({ color }: { color: string }) {
    return (
        <group>
            {/* Main Chassis */}
            <mesh castShadow position={[0, 0.35, 0]}>
                <boxGeometry args={[1.2, 0.4, 2.4]} />
                <meshStandardMaterial color={color} roughness={0.6} />
            </mesh>
            {/* Top Cabin */}
            <mesh castShadow position={[0, 0.7, -0.1]}>
                <boxGeometry args={[1.0, 0.3, 1.2]} />
                <meshStandardMaterial color="#EEFFFF" roughness={0.1} transparent opacity={0.6} />
            </mesh>
            {/* Headlights combined to a single front mesh to save draw calls */}
            <mesh position={[0, 0.35, 1.21]}>
                <boxGeometry args={[1.0, 0.15, 0.05]} />
                <meshStandardMaterial color="#FFF" emissive="#FFE500" emissiveIntensity={2} />
            </mesh>
            {/* Tail lights */}
            <mesh position={[0, 0.35, -1.21]}>
                <boxGeometry args={[1.0, 0.15, 0.05]} />
                <meshStandardMaterial color="#FF2222" emissive="#FF0000" emissiveIntensity={2} />
            </mesh>
            <Wheel x={0.6} z={0.8} />
            <Wheel x={-0.6} z={0.8} />
            <Wheel x={0.6} z={-0.8} />
            <Wheel x={-0.6} z={-0.8} />
        </group>
    );
}

/** Box Truck — distinctive colored cab and large rear cargo box */
function BoxTruck({ color }: { color: string }) {
    return (
        <group>
            {/* Cab */}
            <mesh castShadow position={[0, 0.5, 1.0]}>
                <boxGeometry args={[1.4, 0.7, 1.2]} />
                <meshStandardMaterial color={color} roughness={0.6} />
            </mesh>
            {/* Windshield */}
            <mesh position={[0, 0.65, 1.61]}>
                <boxGeometry args={[1.2, 0.35, 0.05]} />
                <meshStandardMaterial color="#334455" roughness={0.1} />
            </mesh>
            {/* Cargo Box */}
            <mesh castShadow position={[0, 0.8, -0.6]}>
                <boxGeometry args={[1.5, 1.3, 2.4]} />
                <meshStandardMaterial color="#F5F5F5" roughness={0.8} />
            </mesh>
            {/* Headlights */}
            <mesh position={[0, 0.3, 1.61]}>
                <boxGeometry args={[1.2, 0.15, 0.05]} />
                <meshStandardMaterial color="#FFF" emissive="#FFFDCB" emissiveIntensity={2} />
            </mesh>
            {/* Tail lights */}
            <mesh position={[0, 0.3, -1.81]}>
                <boxGeometry args={[1.3, 0.15, 0.05]} />
                <meshStandardMaterial color="#FF2222" emissive="#CC0000" emissiveIntensity={2} />
            </mesh>
            {/* Wheels */}
            <Wheel x={0.7} z={1.0} />
            <Wheel x={-0.7} z={1.0} />
            <Wheel x={0.7} z={-1.2} />
            <Wheel x={-0.7} z={-1.2} />
        </group>
    );
}


/** Pickup Truck — flat bed */
function PickupTruck({ color }: { color: string }) {
    return (
        <group>
            {/* Cab */}
            <mesh castShadow position={[0, 0.45, 0.8]}>
                <boxGeometry args={[1.4, 0.6, 1.2]} />
                <meshStandardMaterial color={color} roughness={0.6} />
            </mesh>
            {/* Truck bed */}
            <mesh castShadow position={[0, 0.3, -0.6]}>
                <boxGeometry args={[1.4, 0.2, 1.6]} />
                <meshStandardMaterial color={color} roughness={0.6} />
            </mesh>
            {/* Headlights */}
            <mesh position={[0, 0.35, 1.41]}>
                <boxGeometry args={[1.2, 0.15, 0.05]} />
                <meshStandardMaterial color="#FFF" emissive="#FFFFAA" emissiveIntensity={2} />
            </mesh>
            {/* Wheels */}
            <Wheel x={0.7} z={0.8} />
            <Wheel x={-0.7} z={0.8} />
            <Wheel x={0.7} z={-0.8} />
            <Wheel x={-0.7} z={-0.8} />
        </group>
    );
}

/** City bus — long, boxy, lots of windows */
function CityBus({ color }: { color: string }) {
    return (
        <group>
            {/* Bus Base */}
            <mesh castShadow position={[0, 0.6, 0]}>
                <boxGeometry args={[1.5, 0.8, 5.0]} />
                <meshStandardMaterial color={color} roughness={0.6} />
            </mesh>
            {/* Windows block (black strip along the side) */}
            <mesh position={[0, 0.75, 0]}>
                <boxGeometry args={[1.55, 0.4, 4.8]} />
                <meshStandardMaterial color="#1a2a4a" roughness={0.1} />
            </mesh>
            {/* Headlights */}
            <mesh position={[0, 0.4, 2.51]}>
                <boxGeometry args={[1.2, 0.15, 0.05]} />
                <meshStandardMaterial color="#FFF" emissive="#FFFDCB" emissiveIntensity={2} />
            </mesh>
            {/* Wheels */}
            <Wheel x={0.78} z={1.5} />
            <Wheel x={-0.78} z={1.5} />
            <Wheel x={0.78} z={-1.5} />
            <Wheel x={-0.78} z={-1.5} />
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
            sirenMatRef.current.emissive.set(flash ? "#FF0000" : "#00AAFF");
            sirenMatRef.current.emissiveIntensity = 4;
            sirenMatRef.current.color.set(flash ? "#FF0000" : "#00AAFF");
        }
    });
    return (
        <group>
            {/* Cab */}
            <mesh castShadow position={[0, 0.5, 1.0]}>
                <boxGeometry args={[1.4, 0.7, 1.2]} />
                <meshStandardMaterial color="#FFFFFF" roughness={0.6} />
            </mesh>
            {/* Cargo Box */}
            <mesh castShadow position={[0, 0.8, -0.6]}>
                <boxGeometry args={[1.5, 1.3, 2.4]} />
                <meshStandardMaterial color="#FFFFFF" roughness={0.5} />
            </mesh>
            {/* Red Cross Band on side */}
            <mesh position={[0, 0.8, -0.6]}>
                <boxGeometry args={[1.55, 0.4, 2.45]} />
                <meshStandardMaterial color="#FF2222" roughness={0.5} />
            </mesh>
            {/* Siren bar */}
            <mesh position={[0, 1.5, 1.0]}>
                <boxGeometry args={[0.8, 0.2, 0.4]} />
                <meshStandardMaterial ref={sirenMatRef} color="#FF0000" emissive="#FF0000" emissiveIntensity={4} />
            </mesh>
            <Wheel x={0.7} z={1.0} />
            <Wheel x={-0.7} z={1.0} />
            <Wheel x={0.7} z={-1.2} />
            <Wheel x={-0.7} z={-1.2} />
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
                    {vehicleType === 0 && <CompactCar color={color} />}
                    {vehicleType === 1 && <BoxTruck color={color} />}
                    {vehicleType === 2 && <PickupTruck color={color} />}
                    {vehicleType === 3 && <CityBus color={color} />}
                </>
            )}
        </group>
    );
}
