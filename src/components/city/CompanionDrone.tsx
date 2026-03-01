"use client";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, Html } from "@react-three/drei";
import * as THREE from "three";

interface CompanionDroneProps {
    message?: string;
    isAlert?: boolean;
}

export default function CompanionDrone({ message = "Welcome, Engineer!", isAlert = false }: CompanionDroneProps) {
    const droneRef = useRef<THREE.Group>(null);
    const propellerRef1 = useRef<THREE.Mesh>(null);
    const propellerRef2 = useRef<THREE.Mesh>(null);

    useFrame((state, delta) => {
        if (propellerRef1.current) propellerRef1.current.rotation.y += delta * 25;
        if (propellerRef2.current) propellerRef2.current.rotation.y += delta * 25;
    });

    const bodyColor = isAlert ? "#FF3366" : "#00E0FF";

    return (
        <Float speed={2} rotationIntensity={0.2} floatIntensity={1} floatingRange={[0, 0.5]}>
            <group ref={droneRef} position={[8, 6, 8]}>
                {/* Drone body */}
                <mesh castShadow>
                    <sphereGeometry args={[0.4, 16, 16]} />
                    <meshStandardMaterial color={bodyColor} roughness={0.3} metalness={0.7} emissive={bodyColor} emissiveIntensity={0.5} />
                </mesh>

                {/* Eye */}
                <mesh position={[0, 0, 0.35]}>
                    <sphereGeometry args={[0.15, 12, 12]} />
                    <meshStandardMaterial color="#0A2540" roughness={0.1} metalness={0.9} />
                </mesh>

                {/* Arms + Propellers */}
                {[[-0.6, 0, -0.6], [0.6, 0, -0.6], [-0.6, 0, 0.6], [0.6, 0, 0.6]].map((pos, i) => (
                    <group key={i}>
                        <mesh position={pos as [number, number, number]}>
                            <cylinderGeometry args={[0.03, 0.03, 0.8]} />
                            <meshStandardMaterial color="#555" metalness={0.8} />
                        </mesh>
                        <mesh ref={i === 0 ? propellerRef1 : i === 1 ? propellerRef2 : undefined} position={[pos[0], pos[1] + 0.15, pos[2]]}>
                            <boxGeometry args={[0.5, 0.02, 0.08]} />
                            <meshStandardMaterial color="#666" transparent opacity={0.6} />
                        </mesh>
                    </group>
                ))}

                {/* Speech bubble */}
                <Html position={[0, 1.5, 0]} center distanceFactor={15} style={{ pointerEvents: "none" }}>
                    <div style={{
                        background: isAlert ? "rgba(51,0,17,0.9)" : "rgba(10,37,64,0.9)",
                        border: `1px solid ${isAlert ? "rgba(255,51,102,0.4)" : "rgba(0,224,255,0.4)"}`,
                        borderRadius: 12,
                        padding: "8px 14px",
                        maxWidth: 220,
                        whiteSpace: "normal",
                        textAlign: "center",
                    }}>
                        <p style={{
                            color: isAlert ? "#FF6699" : "#00E0FF",
                            fontSize: 11,
                            fontWeight: 600,
                            margin: 0,
                            lineHeight: 1.4,
                            fontFamily: "system-ui, sans-serif",
                        }}>
                            {message}
                        </p>
                    </div>
                </Html>
            </group>
        </Float>
    );
}
