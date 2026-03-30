"use client";
import * as THREE from "three";
import { useMemo } from "react";

interface RoadSegment {
    position: [number, number, number];
    size: [number, number];
    rotation?: number;
}

function RoadMesh({ position, size, rotation = 0 }: RoadSegment) {
    // Generate blocky dashed lines
    // Dashes every 4 units
    const dashCount = Math.floor(size[0] / 4);
    
    return (
        <group position={position}>
            {/* Dark asphalt road surface */}
            <mesh rotation={[-Math.PI / 2, 0, rotation]} receiveShadow>
                <planeGeometry args={size} />
                <meshStandardMaterial color="#222222" roughness={1.0} />
            </mesh>
            
            {/* Sidewalk edges */}
            <mesh position={[0, 0.02, size[1]/2 + 0.5]} rotation={[-Math.PI / 2, 0, rotation]} receiveShadow>
                <planeGeometry args={[size[0], 1]} />
                <meshStandardMaterial color="#949494" roughness={1.0} />
            </mesh>
            <mesh position={[0, 0.02, -size[1]/2 - 0.5]} rotation={[-Math.PI / 2, 0, rotation]} receiveShadow>
                <planeGeometry args={[size[0], 1]} />
                <meshStandardMaterial color="#949494" roughness={1.0} />
            </mesh>

            {/* Sharp blocky center lane dashes */}
            <group rotation={[-Math.PI / 2, 0, rotation]} position={[0, 0.015, 0]}>
                {Array.from({ length: dashCount }).map((_, idx) => (
                    <mesh key={idx} position={[-size[0] / 2 + idx * 4 + 2, 0, 0]}>
                        <planeGeometry args={[1.5, 0.3]} />
                        <meshBasicMaterial color="#FFFFFF" />
                    </mesh>
                ))}
            </group>
        </group>
    );
}

function Crosswalk({ position, rotation = 0 }: { position: [number, number, number], rotation?: number }) {
    return (
        <group position={position} rotation={[0, rotation, 0]}>
            <group position={[0, 0.02, 4.0]}>
                {Array.from({ length: 8 }).map((_, idx) => (
                    <mesh key={`cw1-${idx}`} position={[-3.5 + idx * 1, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                        {/* Blocky crosswalk stripes */}
                        <planeGeometry args={[0.5, 2.5]} />
                        <meshBasicMaterial color="#FFFFFF" />
                    </mesh>
                ))}
            </group>
            <group position={[0, 0.02, -4.0]}>
                {Array.from({ length: 8 }).map((_, idx) => (
                    <mesh key={`cw2-${idx}`} position={[-3.5 + idx * 1, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                        <planeGeometry args={[0.5, 2.5]} />
                        <meshBasicMaterial color="#FFFFFF" />
                    </mesh>
                ))}
            </group>
        </group>
    );
}

export default function Roads() {
    const roadSegments = useMemo<RoadSegment[]>(() => {
        const segs: RoadSegment[] = [];
        
        // Massive central cross extending all the way out
        segs.push({ position: [0, 0.01, 0], size: [300, 8] }); // Main H
        segs.push({ position: [0, 0.01, 0], size: [8, 300], rotation: 0 }); // Main V
        
        // Grid roads every 50 units
        for(let i = 50; i <= 150; i += 50) {
            // Horizontal ring lines
            segs.push({ position: [0, 0.01, i], size: [300, 6] });
            segs.push({ position: [0, 0.01, -i], size: [300, 6] });
            
            // Vertical ring lines
            segs.push({ position: [i, 0.01, 0], size: [6, 300], rotation: 0 });
            segs.push({ position: [-i, 0.01, 0], size: [6, 300], rotation: 0 });
        }
        
        return segs;
    }, []);

    return (
        <group>
            {roadSegments.map((seg, i) => (
                <RoadMesh key={i} {...seg} />
            ))}
            {/* Central intersection crosswalks */}
            <Crosswalk position={[0, 0, 0]} />
            <Crosswalk position={[0, 0, 0]} rotation={Math.PI / 2} />
            
            {/* Outer intersection crosswalks for visual flair */}
            {[50, 100].map(offset => (
                <group key={`crosses-${offset}`}>
                    <Crosswalk position={[offset, 0, 0]} />
                    <Crosswalk position={[-offset, 0, 0]} />
                    <Crosswalk position={[0, 0, offset]} rotation={Math.PI / 2} />
                    <Crosswalk position={[0, 0, -offset]} rotation={Math.PI / 2} />
                </group>
            ))}
        </group>
    );
}

// Export road network data for vehicle pathing
const paths: { id: string, points: [number, number, number][] }[] = [
    // Main roads (extended to edges)
    { id: "h-main", points: [[-200, 0.5, -3.5], [200, 0.5, -3.5]] },
    { id: "h-main-rev", points: [[200, 0.5, 3.5], [-200, 0.5, 3.5]] },
    { id: "v-main", points: [[-3.5, 0.5, -200], [-3.5, 0.5, 200]] },
    { id: "v-main-rev", points: [[3.5, 0.5, 200], [3.5, 0.5, -200]] },
];

for(let i of [50, 100, 150]) {
    // Horizontal edge lines
    paths.push(
        { id: `h-${i}`, points: [[-200, 0.5, i - 1.5], [200, 0.5, i - 1.5]] },
        { id: `h-${i}-rev`, points: [[200, 0.5, i + 1.5], [-200, 0.5, i + 1.5]] },
        { id: `h--${i}`, points: [[-200, 0.5, -i - 1.5], [200, 0.5, -i - 1.5]] },
        { id: `h--${i}-rev`, points: [[200, 0.5, -i + 1.5], [-200, 0.5, -i + 1.5]] }
    );
    // Vertical edge lines
    paths.push(
        { id: `v-${i}`, points: [[i - 1.5, 0.5, -200], [i - 1.5, 0.5, 200]] },
        { id: `v-${i}-rev`, points: [[i + 1.5, 0.5, 200], [i + 1.5, 0.5, -200]] },
        { id: `v--${i}`, points: [[-i - 1.5, 0.5, -200], [-i - 1.5, 0.5, 200]] },
        { id: `v--${i}-rev`, points: [[-i + 1.5, 0.5, 200], [-i + 1.5, 0.5, -200]] }
    );
}
export const ROAD_PATHS = paths;
