"use client";
import * as THREE from "three";
import { useMemo } from "react";

interface RoadSegment {
    position: [number, number, number];
    size: [number, number];
    rotation?: number;
}

const ROAD_SEGMENTS: RoadSegment[] = [
    // Main horizontal road
    { position: [0, 0.01, 0], size: [80, 8] },
    // Main vertical road
    { position: [0, 0.01, 0], size: [8, 80], rotation: 0 },
    // Cross roads
    { position: [25, 0.01, 25], size: [8, 50], rotation: 0 },
    { position: [-25, 0.01, -25], size: [8, 50], rotation: 0 },
    { position: [25, 0.01, -25], size: [50, 8] },
    { position: [-25, 0.01, 25], size: [50, 8] },
];

function RoadMesh({ position, size, rotation = 0 }: RoadSegment) {
    return (
        <group position={position}>
            {/* Road surface */}
            <mesh rotation={[-Math.PI / 2, 0, rotation]} receiveShadow>
                <planeGeometry args={size} />
                <meshStandardMaterial color="#333333" roughness={0.8} />
            </mesh>
            {/* Center line */}
            <mesh rotation={[-Math.PI / 2, 0, rotation]} position={[0, 0.005, 0]}>
                <planeGeometry args={[size[0] * 0.98, 0.15]} />
                <meshStandardMaterial color="#FFD600" roughness={0.5} emissive="#FFD600" emissiveIntensity={0.1} />
            </mesh>
        </group>
    );
}

export default function Roads() {
    return (
        <group>
            {ROAD_SEGMENTS.map((seg, i) => (
                <RoadMesh key={i} {...seg} />
            ))}
        </group>
    );
}

// Export road network data for vehicle pathing
export const ROAD_PATHS = [
    // Horizontal main (left to right)
    { id: "h-main", points: [[-40, 0.5, -1.5], [40, 0.5, -1.5]] as [number, number, number][] },
    // Horizontal main (right to left)
    { id: "h-main-rev", points: [[40, 0.5, 1.5], [-40, 0.5, 1.5]] as [number, number, number][] },
    // Vertical main (top to bottom)
    { id: "v-main", points: [[-1.5, 0.5, -40], [-1.5, 0.5, 40]] as [number, number, number][] },
    // Vertical main (bottom to top)
    { id: "v-main-rev", points: [[1.5, 0.5, 40], [1.5, 0.5, -40]] as [number, number, number][] },
];
