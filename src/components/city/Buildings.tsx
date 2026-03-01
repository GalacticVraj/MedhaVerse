"use client";
import { useMemo, useRef } from "react";
import * as THREE from "three";

interface BuildingData {
    position: [number, number, number];
    size: [number, number, number];
    color: string;
    emissive?: string;
}

function Building({ position, size, color, emissive }: BuildingData) {
    const meshRef = useRef<THREE.Mesh>(null);

    // Slight random rotation for variety
    const rotY = useMemo(() => (Math.random() - 0.5) * 0.05, []);

    return (
        <group position={[position[0], size[1] / 2, position[2]]}>
            {/* Main building body */}
            <mesh castShadow receiveShadow rotation={[0, rotY, 0]}>
                <boxGeometry args={size} />
                <meshStandardMaterial
                    color={color}
                    roughness={0.7}
                    metalness={0.1}
                />
            </mesh>

            {/* Windows - front face */}
            {Array.from({ length: Math.floor(size[1] / 2.5) }).map((_, row) =>
                Array.from({ length: Math.floor(size[0] / 2.5) }).map((_, col) => (
                    <mesh
                        key={`w-${row}-${col}`}
                        position={[
                            -size[0] / 2 + 1.5 + col * 2.5,
                            -size[1] / 2 + 2 + row * 2.5,
                            size[2] / 2 + 0.01,
                        ]}
                    >
                        <planeGeometry args={[1.2, 1.5]} />
                        <meshStandardMaterial
                            color="#FFE082"
                            emissive="#FFE082"
                            emissiveIntensity={Math.random() > 0.3 ? 0.8 : 0.1}
                            roughness={0.3}
                        />
                    </mesh>
                ))
            )}
        </group>
    );
}

export default function Buildings() {
    const buildings = useMemo<BuildingData[]>(() => {
        const data: BuildingData[] = [];
        const colors = ["#5C6BC0", "#7986CB", "#3F51B5", "#303F9F", "#1A237E", "#42A5F5", "#1565C0"];

        // Generate buildings in city blocks (avoiding roads)
        const blocks = [
            // Top-left quadrant
            { cx: -18, cz: -18, count: 6 },
            // Top-right quadrant
            { cx: 18, cz: -18, count: 5 },
            // Bottom-left quadrant
            { cx: -18, cz: 18, count: 5 },
            // Bottom-right quadrant
            { cx: 18, cz: 18, count: 6 },
            // Far buildings
            { cx: -35, cz: -10, count: 3 },
            { cx: 35, cz: -10, count: 3 },
            { cx: -35, cz: 10, count: 3 },
            { cx: 35, cz: 10, count: 3 },
            { cx: -10, cz: -35, count: 3 },
            { cx: 10, cz: -35, count: 3 },
            { cx: -10, cz: 35, count: 3 },
            { cx: 10, cz: 35, count: 3 },
        ];

        blocks.forEach(block => {
            for (let i = 0; i < block.count; i++) {
                const w = 3 + Math.random() * 5;
                const h = 4 + Math.random() * 16;
                const d = 3 + Math.random() * 5;
                data.push({
                    position: [
                        block.cx + (Math.random() - 0.5) * 12,
                        0,
                        block.cz + (Math.random() - 0.5) * 12,
                    ],
                    size: [w, h, d],
                    color: colors[Math.floor(Math.random() * colors.length)],
                });
            }
        });

        return data;
    }, []);

    return (
        <group>
            {buildings.map((b, i) => (
                <Building key={i} {...b} />
            ))}
        </group>
    );
}
