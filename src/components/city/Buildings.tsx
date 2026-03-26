"use client";
import { useMemo } from "react";
import * as THREE from "three";

interface BuildingData {
    position: [number, number, number];
    size: [number, number, number];
    type: number;
    seed: number;
}

function WindowsGrid({ size, countX, countY, isEmissive = false }: { size: [number, number, number], countX: number, countY: number, isEmissive?: boolean }) {
    const winW = size[0] / countX * 0.4;
    const winH = size[1] / countY * 0.4;
    const windows = [];
    
    for(let r=0; r<countY; r++) {
        for(let c=0; c<countX; c++) {
            const px = -size[0]/2 + (size[0]/countX) * (c + 0.5);
            const py = -size[1]/2 + (size[1]/countY) * (r + 0.5);
            
            const isLit = isEmissive && Math.random() > 0.5;
            const mat = <meshStandardMaterial color={isLit ? "#FFE082" : "#8BAAC5"} emissive={isLit ? "#FFB74D" : "#4A6E8A"} emissiveIntensity={isLit ? 1.5 : 0} />;
            
            // Front
            windows.push(
                <mesh key={`f-${r}-${c}`} position={[px, py, size[2]/2 + 0.01]}>
                    <planeGeometry args={[winW, winH]} />
                    {mat}
                </mesh>
            );
            // Back
            windows.push(
                <mesh key={`b-${r}-${c}`} position={[px, py, -size[2]/2 - 0.01]} rotation={[0, Math.PI, 0]}>
                    <planeGeometry args={[winW, winH]} />
                    {mat}
                </mesh>
            );
            
            const pxZ = -size[2]/2 + (size[2]/countX) * (c + 0.5);
            const winWZ = size[2] / countX * 0.4;
            // Left
            windows.push(
                <mesh key={`l-${r}-${c}`} position={[-size[0]/2 - 0.01, py, -pxZ]} rotation={[0, -Math.PI/2, 0]}>
                    <planeGeometry args={[winWZ, winH]} />
                    {mat}
                </mesh>
            );
            // Right
            windows.push(
                <mesh key={`r-${r}-${c}`} position={[size[0]/2 + 0.01, py, pxZ]} rotation={[0, Math.PI/2, 0]}>
                    <planeGeometry args={[winWZ, winH]} />
                    {mat}
                </mesh>
            );
        }
    }
    return <group>{windows}</group>;
}

function ArtDecoSpire({ size, seed }: { size: [number, number, number], seed: number }) {
    const t1h = size[1] * 0.5;
    const t2h = size[1] * 0.3;
    const t3h = size[1] * 0.2;
    const color = seed % 2 === 0 ? "#C9B99A" : "#B5A080"; // Warm beige/stone
    const mat = <meshStandardMaterial color={color} roughness={0.85} />;
    
    return (
        <group>
            <group position={[0, t1h/2, 0]}>
                <mesh castShadow receiveShadow>
                    <boxGeometry args={[size[0], t1h, size[2]]} />
                    {mat}
                </mesh>
                <WindowsGrid size={[size[0], t1h, size[2]]} countX={4} countY={8} isEmissive={true} />
            </group>
            
            <group position={[0, t1h + t2h/2, 0]}>
                <mesh castShadow receiveShadow>
                    <boxGeometry args={[size[0]*0.7, t2h, size[2]*0.7]} />
                    {mat}
                </mesh>
                <WindowsGrid size={[size[0]*0.7, t2h, size[2]*0.7]} countX={3} countY={5} isEmissive={true} />
            </group>
            
            <group position={[0, t1h + t2h + t3h/2, 0]}>
                <mesh castShadow receiveShadow>
                    <boxGeometry args={[size[0]*0.4, t3h, size[2]*0.4]} />
                    {mat}
                </mesh>
                <WindowsGrid size={[size[0]*0.4, t3h, size[2]*0.4]} countX={2} countY={3} isEmissive={false} />
            </group>
            
            {/* Spire */}
            <mesh position={[0, size[1] + size[1]*0.15, 0]} castShadow>
                <coneGeometry args={[size[0]*0.15, size[1]*0.3, 8]} />
                <meshStandardMaterial color="#9CA3AF" metalness={0.7} roughness={0.3} />
            </mesh>
        </group>
    );
}

function DomedCylinder({ size, seed }: { size: [number, number, number], seed: number }) {
    const rad = Math.min(size[0], size[2]) / 2;
    const color = seed % 2 === 0 ? "#E8D5B5" : "#D4B896"; // Sandy beige building
    const domeColor = seed % 3 === 0 ? "#4A90C4" : "#6B8CA0"; 
    
    // Cylindrical windows: vertical strips
    const strips = [];
    for(let i=0; i<16; i++) {
        const angle = (i / 16) * Math.PI * 2;
        strips.push(
            <mesh key={i} position={[Math.sin(angle)*(rad+0.02), size[1]/2, Math.cos(angle)*(rad+0.02)]} rotation={[0, angle, 0]}>
                <planeGeometry args={[0.2, size[1]*0.8]} />
                <meshStandardMaterial color="#111" />
            </mesh>
        );
    }
    
    return (
        <group>
            <mesh position={[0, size[1]/2, 0]} castShadow receiveShadow>
                <cylinderGeometry args={[rad, rad, size[1], 32]} />
                <meshStandardMaterial color={color} roughness={0.8} />
            </mesh>
            
            {strips}
            
            {/* Dome */}
            <mesh position={[0, size[1], 0]} castShadow>
                <sphereGeometry args={[rad, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
                <meshStandardMaterial color={domeColor} roughness={0.3} metalness={0.7} />
            </mesh>
            
            <mesh position={[0, size[1] + rad + 0.5, 0]}>
                <cylinderGeometry args={[0.05, 0.05, 1]} />
                <meshStandardMaterial color="#555" />
            </mesh>
        </group>
    );
}

function ModernGlassSkyscraper({ size, seed }: { size: [number, number, number], seed: number }) {
    const glassColor = seed % 2 === 0 ? "#2C5F8A" : "#1A4A72"; // Steel blue / Navy
    
    return (
        <group>
            {/* Deep Glass Core */}
            <mesh position={[0, size[1]/2, 0]} castShadow receiveShadow>
                <boxGeometry args={[size[0]*0.9, size[1], size[2]*0.9]} />
                <meshStandardMaterial color={glassColor} roughness={0.0} metalness={1.0} transparent opacity={0.9} />
            </mesh>
            
            {/* Grid Frame */}
            <mesh position={[0, size[1]/2, 0]}>
                <boxGeometry args={[size[0]*0.95, size[1]*1.02, size[2]*0.95]} />
                <meshStandardMaterial color="#7A9EB5" wireframe />
            </mesh>

            {/* Solid inner base */}
            <mesh position={[0, size[1]/4, 0]}>
                <boxGeometry args={[size[0]*0.6, size[1]*0.5, size[2]*0.6]} />
                <meshStandardMaterial color="#D5D4D4" roughness={0.7} />
            </mesh>
            
            {/* Roof equipment */}
            <mesh position={[1, size[1] + 0.2, -1]}>
                <boxGeometry args={[0.8, 0.4, 0.8]} />
                <meshStandardMaterial color="#444" />
            </mesh>
            <mesh position={[-0.5, size[1] + 0.5, 0.5]}>
                <cylinderGeometry args={[0.1, 0.1, 1]} />
                <meshStandardMaterial color="#555" />
            </mesh>
        </group>
    );
}

function BlockyInterlocking({ size, seed }: { size: [number, number, number], seed: number }) {
    const c1 = "#C49A6C"; // Warm sandy brown
    const c2 = "#5A6E7F"; // Muted slate blue-grey
    const h1 = size[1];
    const h2 = size[1] * 1.3;
    
    return (
        <group>
            <group position={[-size[0]*0.2, h1/2, 0]}>
                <mesh castShadow receiveShadow>
                    <boxGeometry args={[size[0]*0.6, h1, size[2]]} />
                    <meshStandardMaterial color={c1} roughness={0.9} />
                </mesh>
                <WindowsGrid size={[size[0]*0.6, h1, size[2]]} countX={3} countY={8} isEmissive={true} />
            </group>
            
            <group position={[size[0]*0.2, h2/2, size[2]*0.2]}>
                <mesh castShadow receiveShadow>
                    <boxGeometry args={[size[0]*0.6, h2, size[2]*0.6]} />
                    <meshStandardMaterial color={c2} roughness={0.7} />
                </mesh>
                <WindowsGrid size={[size[0]*0.6, h2, size[2]*0.6]} countX={2} countY={10} isEmissive={true} />
            </group>
        </group>
    );
}

function ClassicTiered({ size, seed }: { size: [number, number, number], seed: number }) {
    const color = seed % 2 === 0 ? "#D4B896" : "#C8AA82"; // Rich tan/beige
    
    return (
        <group>
            {/* Base block */}
            <group position={[0, size[1]*0.3, 0]}>
                <mesh castShadow receiveShadow>
                    <boxGeometry args={[size[0], size[1]*0.6, size[2]]} />
                    <meshStandardMaterial color={color} roughness={0.8} />
                </mesh>
                <WindowsGrid size={[size[0], size[1]*0.6, size[2]]} countX={5} countY={6} isEmissive={true} />
            </group>

            {/* Upper block */}
            <group position={[0, size[1]*0.6 + size[1]*0.2, 0]}>
                <mesh castShadow receiveShadow>
                    <boxGeometry args={[size[0]*0.8, size[1]*0.4, size[2]*0.8]} />
                    <meshStandardMaterial color={color} roughness={0.8} />
                </mesh>
                <WindowsGrid size={[size[0]*0.8, size[1]*0.4, size[2]*0.8]} countX={4} countY={4} isEmissive={false} />
            </group>
            
            {/* Roof AC unit */}
            <mesh position={[size[0]*0.2, size[1] + 0.5, -size[2]*0.2]} castShadow>
                <cylinderGeometry args={[0.3, 0.3, 1, 8]} />
                <meshStandardMaterial color="#9CA3AF" />
            </mesh>
            <mesh position={[-size[0]*0.2, size[1] + 0.2, size[2]*0.2]} castShadow>
                <boxGeometry args={[0.8, 0.4, 0.8]} />
                <meshStandardMaterial color="#666" />
            </mesh>
        </group>
    );
}

function Building({ position, size, type, seed }: BuildingData) {
    return (
        <group position={[position[0], 0, position[2]]} rotation={[0, (seed % 4) * (Math.PI/2), 0]}>
            {type === 0 && <ArtDecoSpire size={size} seed={seed} />}
            {type === 1 && <DomedCylinder size={size} seed={seed} />}
            {type === 2 && <ModernGlassSkyscraper size={size} seed={seed} />}
            {type === 3 && <BlockyInterlocking size={size} seed={seed} />}
            {type === 4 && <ClassicTiered size={size} seed={seed} />}
        </group>
    );
}

export default function Buildings() {
    const buildings = useMemo<BuildingData[]>(() => {
        const data: BuildingData[] = [];

        // Generate buildings in city blocks (avoiding roads)
        const blocks = [
            // Top-left quadrant
            { cx: -18, cz: -18, count: 6 },
            { cx: 18, cz: -18, count: 5 },
            { cx: -18, cz: 18, count: 5 },
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
                const seed = Math.floor(Math.random() * 100000);
                const type = seed % 5;
                
                // Adjust width, depth, height dramatically based on architectural type
                const w = (type === 2 || type === 0) ? 3 + Math.random() * 3 : 4 + Math.random() * 5;
                const d = (type === 1) ? w : ((type === 2 || type === 0) ? 3 + Math.random() * 3 : 4 + Math.random() * 5);
                const h = (type === 2 || type === 0) ? 14 + Math.random() * 22 : 6 + Math.random() * 14;
                
                data.push({
                    position: [
                        block.cx + (Math.random() - 0.5) * 12,
                        0,
                        block.cz + (Math.random() - 0.5) * 12,
                    ],
                    size: [w, h, d],
                    type: type,
                    seed: seed,
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
