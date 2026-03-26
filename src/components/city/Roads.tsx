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
                <meshStandardMaterial color="#919090" roughness={0.9} />
            </mesh>
            {/* Center lane dashes */}
            <group rotation={[-Math.PI / 2, 0, rotation]} position={[0, 0.005, 0]}>
                {Array.from({ length: Math.floor(size[0] / 2) }).map((_, idx) => (
                    <mesh key={idx} position={[-size[0] / 2 + idx * 2 + 1, 0, 0]}>
                        <planeGeometry args={[1, 0.3]} />
                        <meshStandardMaterial color="#FFFFFF" roughness={1.0} />
                    </mesh>
                ))}
            </group>
        </group>
    );
}

function Crosswalk({ position, rotation = 0 }: { position: [number, number, number], rotation?: number }) {
    return (
        <group position={position} rotation={[0, rotation, 0]}>
            <group position={[0, 0.01, 3.5]}>
                {Array.from({ length: 7 }).map((_, idx) => (
                    <mesh key={`cw1-${idx}`} position={[-3 + idx * 1, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                        <planeGeometry args={[0.5, 2]} />
                        <meshStandardMaterial color="#FFFFFF" roughness={1.0} />
                    </mesh>
                ))}
            </group>
            <group position={[0, 0.01, -3.5]}>
                {Array.from({ length: 7 }).map((_, idx) => (
                    <mesh key={`cw2-${idx}`} position={[-3 + idx * 1, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                        <planeGeometry args={[0.5, 2]} />
                        <meshStandardMaterial color="#FFFFFF" roughness={1.0} />
                    </mesh>
                ))}
            </group>
        </group>
    );
}

export default function Roads() {
    return (
        <group>
            {ROAD_SEGMENTS.map((seg, i) => (
                <RoadMesh key={i} {...seg} />
            ))}
            {/* Central intersection crosswalks */}
            <Crosswalk position={[0, 0, 0]} />
            <Crosswalk position={[0, 0, 0]} rotation={Math.PI / 2} />
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
