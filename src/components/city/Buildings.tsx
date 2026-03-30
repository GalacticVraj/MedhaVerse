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
    
    // Simplistic material choice for pixel/voxel style windows
    const matLit = <meshStandardMaterial color="#FFF59D" emissive="#FFB74D" emissiveIntensity={1.2} roughness={0.1} />;
    const matDark = <meshStandardMaterial color="#4A6E8A" roughness={0.1} />;
    
    for(let r=0; r<countY; r++) {
        for(let c=0; c<countX; c++) {
            const px = -size[0]/2 + (size[0]/countX) * (c + 0.5);
            const py = -size[1]/2 + (size[1]/countY) * (r + 0.5);
            
            const isLit = isEmissive && Math.random() > 0.4;
            const mat = isLit ? matLit : matDark;
            
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

// Type 0: Skyscraper Post
function SkyscraperPost({ size, seed }: { size: [number, number, number], seed: number }) {
    const t1h = size[1] * 0.6;
    const t2h = size[1] * 0.3;
    const t3h = size[1] * 0.1;
    const color = seed % 2 === 0 ? "#C9B99A" : "#8A9EA8"; // Beige vs Grey/Blue
    const mat = <meshStandardMaterial color={color} roughness={0.9} />;
    
    return (
        <group>
            {/* Base Segment */}
            <group position={[0, t1h/2, 0]}>
                <mesh castShadow receiveShadow>
                    <boxGeometry args={[size[0], t1h, size[2]]} />
                    {mat}
                </mesh>
                <WindowsGrid size={[size[0], t1h, size[2]]} countX={Math.floor(size[0]/0.8)} countY={Math.floor(t1h/0.8)} isEmissive={true} />
            </group>
            
            {/* Mid Segment */}
            <group position={[0, t1h + t2h/2, 0]}>
                <mesh castShadow receiveShadow>
                    <boxGeometry args={[size[0]*0.8, t2h, size[2]*0.8]} />
                    {mat}
                </mesh>
                <WindowsGrid size={[size[0]*0.8, t2h, size[2]*0.8]} countX={Math.floor(size[0]/1.0)} countY={Math.floor(t2h/0.8)} isEmissive={true} />
            </group>
            
            {/* Top Segment */}
            <group position={[0, t1h + t2h + t3h/2, 0]}>
                <mesh castShadow receiveShadow>
                    <boxGeometry args={[size[0]*0.6, t3h, size[2]*0.6]} />
                    {mat}
                </mesh>
            </group>
            
            {/* Blocky Spire */}
            <mesh position={[0, size[1] + 1.0, 0]} castShadow>
                <boxGeometry args={[0.2, 2.0, 0.2]} />
                <meshStandardMaterial color="#9CA3AF" />
            </mesh>
        </group>
    );
}

// Type 1: Commercial Grid Block
function CommercialGrid({ size, seed }: { size: [number, number, number], seed: number }) {
    const color = seed % 2 === 0 ? "#C49A6C" : "#5A6D7C";
    
    return (
        <group>
            {/* Main Block */}
            <mesh position={[0, size[1]/2, 0]} castShadow receiveShadow>
                <boxGeometry args={[size[0], size[1], size[2]]} />
                <meshStandardMaterial color={color} roughness={0.8} />
            </mesh>
            
            {/* Deep recessed grid simulation using flat planes on the surface */}
            <group position={[0, size[1]/2 + 0.5, 0]}>
               <WindowsGrid size={[size[0], size[1]-1, size[2]]} countX={Math.floor(size[0]/1.2)} countY={Math.floor(size[1]/1.2)} isEmissive={true} />
            </group>

            {/* Blocky Roof structures */}
            <mesh position={[size[0]*0.3, size[1] + 0.4, -size[2]*0.3]} castShadow>
                <boxGeometry args={[1.5, 0.8, 1.5]} />
                <meshStandardMaterial color="#B0B0B0" />
            </mesh>
        </group>
    );
}

// Type 2: Two-story Shop / Supermarket with blocky Awning
function PixelShop({ size, seed }: { size: [number, number, number], seed: number }) {
    // Override height for shops
    const h = 4.0;
    const baseColor = seed % 2 === 0 ? "#A37A5C" : "#E2CCB3";
    const awningColor = seed % 3 === 0 ? "#D65A5A" : (seed % 3 === 1 ? "#5A8ED6" : "#71B362");

    return (
        <group>
            {/* Shop Box */}
            <mesh position={[0, h/2, 0]} castShadow receiveShadow>
                <boxGeometry args={[size[0], h, size[2]]} />
                <meshStandardMaterial color={baseColor} roughness={0.9} />
            </mesh>
            
            {/* First Floor Windows (Shopfront) */}
            <group position={[0, 1.25, size[2]/2 + 0.02]}>
                <mesh>
                    <planeGeometry args={[size[0]*0.8, 1.5]} />
                    <meshStandardMaterial color="#8BAAC5" emissive="#8BAAC5" emissiveIntensity={0.5} />
                </mesh>
            </group>

            {/* Blocky Awning */}
            <mesh position={[0, 2.2, size[2]/2 + 0.6]} castShadow>
                {/* Simulated slanted awning using a box rotated */}
                <boxGeometry args={[size[0]*0.9, 0.2, 1.2]} />
                <meshStandardMaterial color={awningColor} />
            </mesh>

            {/* Second Floor Windows */}
            <group position={[0, 3.0, 0]}>
                <WindowsGrid size={[size[0], 1.2, size[2]]} countX={Math.floor(size[0]/1.2)} countY={1} isEmissive={true} />
            </group>

            {/* Roof Billboard */}
            <mesh position={[0, h + 0.6, 0]} castShadow>
                <boxGeometry args={[size[0]*0.6, 1.2, 0.2]} />
                <meshStandardMaterial color="#FFFFFF" />
            </mesh>
        </group>
    );
}

// Type 3: Apartment Block
function ApartmentBlock({ size, seed }: { size: [number, number, number], seed: number }) {
    const color = "#D4C7BA";
    const accentColor = seed % 2 === 0 ? "#5E8E76" : "#A66D60";
    
    return (
        <group>
            <mesh position={[0, size[1]/2, 0]} castShadow receiveShadow>
                <boxGeometry args={[size[0], size[1], size[2]]} />
                <meshStandardMaterial color={color} roughness={0.9} />
            </mesh>
            
            {/* Add projecting balconies */}
            <group position={[0, 0, 0]}>
                {Array.from({ length: Math.floor(size[1] / 1.5) }).map((_, r) => {
                    const yOffset = 1.0 + r * 1.5;
                    return (
                        <mesh key={`balc-${r}`} position={[0, yOffset, size[2]/2 + 0.3]} castShadow>
                            <boxGeometry args={[size[0]*0.8, 0.2, 0.6]} />
                            <meshStandardMaterial color={accentColor} />
                        </mesh>
                    );
                })}
            </group>

            {/* Windows above each balcony */}
            <group position={[0, size[1]/2 + 0.2, 0]}>
                <WindowsGrid size={[size[0], size[1]-1, size[2]]} countX={Math.floor(size[0]/1.2)} countY={Math.floor(size[1]/1.5)} isEmissive={true} />
            </group>
        </group>
    );
}

// Type 4: Modern Glass Block (Isometric Boxy Style)
function IsometricGlassBlock({ size, seed }: { size: [number, number, number], seed: number }) {
    const glassColor = seed % 2 === 0 ? "#3B75A6" : "#2F5D85";
    
    return (
        <group>
            <mesh position={[0, size[1]/2, 0]} castShadow receiveShadow>
                <boxGeometry args={[size[0], size[1], size[2]]} />
                <meshStandardMaterial color={glassColor} roughness={0.1} metalness={0.8} />
            </mesh>
            
            {/* Concrete Corner Pillars */}
            <mesh position={[size[0]/2 + 0.1, size[1]/2, size[2]/2 + 0.1]}>
                <boxGeometry args={[0.3, size[1]*1.01, 0.3]} />
                <meshStandardMaterial color="#E0E0E0" />
            </mesh>
            <mesh position={[-size[0]/2 - 0.1, size[1]/2, size[2]/2 + 0.1]}>
                <boxGeometry args={[0.3, size[1]*1.01, 0.3]} />
                <meshStandardMaterial color="#E0E0E0" />
            </mesh>
            <mesh position={[size[0]/2 + 0.1, size[1]/2, -size[2]/2 - 0.1]}>
                <boxGeometry args={[0.3, size[1]*1.01, 0.3]} />
                <meshStandardMaterial color="#E0E0E0" />
            </mesh>
            <mesh position={[-size[0]/2 - 0.1, size[1]/2, -size[2]/2 - 0.1]}>
                <boxGeometry args={[0.3, size[1]*1.01, 0.3]} />
                <meshStandardMaterial color="#E0E0E0" />
            </mesh>
            
            {/* Concrete Floors */}
            {Array.from({ length: Math.floor(size[1]/2) }).map((_, i) => (
                <mesh key={`f-${i}`} position={[0, (i+1)*2, 0]}>
                    <boxGeometry args={[size[0]*1.02, 0.2, size[2]*1.02]} />
                    <meshStandardMaterial color="#E0E0E0" />
                </mesh>
            ))}
        </group>
    );
}

function Building({ position, size, type, seed }: BuildingData) {
    return (
        <group position={[position[0], 0, position[2]]} rotation={[0, (seed % 4) * (Math.PI/2), 0]}>
            {type === 0 && <SkyscraperPost size={size} seed={seed} />}
            {type === 1 && <CommercialGrid size={size} seed={seed} />}
            {type === 2 && <PixelShop size={size} seed={seed} />}
            {type === 3 && <ApartmentBlock size={size} seed={seed} />}
            {type === 4 && <IsometricGlassBlock size={size} seed={seed} />}
        </group>
    );
}

export default function Buildings() {
    const buildings = useMemo<BuildingData[]>(() => {
        const data: BuildingData[] = [];

        // Generate an expanded voxel city grid
        // Spanning from -150 to 150 structurally
        for (let x = -140; x <= 140; x += 22) {
            for (let z = -140; z <= 140; z += 22) {
                // Keep the center cross intersection relatively clear for paths
                if (Math.abs(x) < 15 && Math.abs(z) < 15) continue;
                
                // Keep central roads clear
                if (Math.abs(x) < 10 || Math.abs(z) < 10) continue;

                const count = 2 + Math.floor(Math.random() * 3);
                
                for (let i = 0; i < count; i++) {
                    const seed = Math.floor(Math.random() * 100000);
                    const type = seed % 5;
                    
                    const w = 4 + Math.random() * 4;
                    const d = 4 + Math.random() * 4;
                    let h = 8 + Math.random() * 12;

                    // Skyscraper override
                    if (type === 0 || type === 4) {
                        h = 16 + Math.random() * 25;
                    }
                    if (type === 2) {
                        h = 4; // shops are short
                    }

                    // Spread within the 22x22 block
                    const pX = x + (Math.random() - 0.5) * 14;
                    const pZ = z + (Math.random() - 0.5) * 14;

                    data.push({
                        position: [pX, 0, pZ],
                        size: [w, h, d],
                        type: type,
                        seed: seed,
                    });
                }
            }
        }

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
