"use client";

export default function StreetLamp({ position }: { position: [number, number, number] }) {
    // Shared dark grey blocky material
    const ironMaterial = <meshStandardMaterial color="#2B2B2B" roughness={0.8} />;
    
    return (
        <group position={position}>
            {/* ------ BASE BLOCK ------ */}
            <mesh position={[0, 0.2, 0]} castShadow>
                <boxGeometry args={[0.5, 0.4, 0.5]} />
                {ironMaterial}
            </mesh>
            <mesh position={[0, 0.55, 0]} castShadow>
                <boxGeometry args={[0.3, 0.3, 0.3]} />
                {ironMaterial}
            </mesh>
            
            {/* ------ TALL POLE ------ */}
            <mesh position={[0, 2.7, 0]} castShadow>
                <boxGeometry args={[0.15, 4.0, 0.15]} />
                {ironMaterial}
            </mesh>
            
            {/* ------ TOP FINIAL ------ */}
            <mesh position={[0, 4.8, 0]} castShadow>
                <boxGeometry args={[0.2, 0.2, 0.2]} />
                {ironMaterial}
            </mesh>

            {/* ------ BLOCKY ARM ------ */}
            <mesh position={[0.6, 4.5, 0]} castShadow>
                <boxGeometry args={[1.2, 0.1, 0.1]} />
                {ironMaterial}
            </mesh>
            
            {/* Diagonal Bracket */}
            <mesh position={[0.3, 4.25, 0]} rotation={[0, 0, Math.PI / 4]} castShadow>
                <boxGeometry args={[0.8, 0.08, 0.08]} />
                {ironMaterial}
            </mesh>

            {/* ------ HANGING LANTERN BOX ------ */}
            <group position={[1.1, 4.15, 0]}>
                {/* Connecting rod */}
                <mesh position={[0, 0.2, 0]} castShadow>
                    <boxGeometry args={[0.05, 0.4, 0.05]} />
                    {ironMaterial}
                </mesh>
                
                {/* Lantern Roof */}
                <mesh position={[0, 0.0, 0]} castShadow>
                    <boxGeometry args={[0.4, 0.1, 0.4]} />
                    {ironMaterial}
                </mesh>

                {/* Lantern Glowing Body */}
                <mesh position={[0, -0.2, 0]}>
                    <boxGeometry args={[0.3, 0.3, 0.3]} />
                    <meshStandardMaterial color="#FFF59D" emissive="#FFB74D" emissiveIntensity={3.0} />
                </mesh>
                
                {/* Lantern Bottom */}
                <mesh position={[0, -0.4, 0]} castShadow>
                    <boxGeometry args={[0.4, 0.1, 0.4]} />
                    {ironMaterial}
                </mesh>
            </group>
        </group>
    );
}

export function Tree({ position }: { position: [number, number, number] }) {
    // Deterministic random based on position
    const seed = Math.abs(Math.floor(position[0] * 7 + position[2] * 13));
    const typeIndex = seed % 4;
    const isAutumn = seed % 10 === 0; // 10% chance of an autumn tree
    
    const leafColor = isAutumn ? "#F4B41A" : (seed % 2 === 0 ? "#6BA32A" : "#4A8F29");
    const trunkColor = "#6A4A3C";

    const Leaves = () => {
        switch(typeIndex) {
            case 0: // Tall Pine tree (stacked boxes)
                return (
                    <group>
                        <mesh position={[0, 1.8, 0]} castShadow>
                            <boxGeometry args={[1.6, 1.6, 1.6]} />
                            <meshStandardMaterial color={leafColor} roughness={0.9} />
                        </mesh>
                        <mesh position={[0, 3.0, 0]} castShadow>
                            <boxGeometry args={[1.2, 1.2, 1.2]} />
                            <meshStandardMaterial color={leafColor} roughness={0.9} />
                        </mesh>
                        <mesh position={[0, 4.0, 0]} castShadow>
                            <boxGeometry args={[0.8, 0.8, 0.8]} />
                            <meshStandardMaterial color={leafColor} roughness={0.9} />
                        </mesh>
                    </group>
                );
            case 1: // Asymmetric Blocky Tree
                return (
                    <group>
                        <mesh position={[0, 2.5, 0]} castShadow>
                            <boxGeometry args={[1.5, 1.5, 1.5]} />
                            <meshStandardMaterial color={leafColor} roughness={0.9} />
                        </mesh>
                        <mesh position={[0.6, 2.2, 0.4]} castShadow>
                            <boxGeometry args={[1.0, 1.0, 1.0]} />
                            <meshStandardMaterial color={leafColor} roughness={0.9} />
                        </mesh>
                        <mesh position={[-0.5, 3.2, -0.3]} castShadow>
                            <boxGeometry args={[1.2, 1.2, 1.2]} />
                            <meshStandardMaterial color={leafColor} roughness={0.9} />
                        </mesh>
                    </group>
                );
            case 2: // Flat Top Canopy Tree
                return (
                    <group>
                        <mesh position={[0, 2.8, 0]} castShadow>
                            <boxGeometry args={[2.5, 0.8, 2.5]} />
                            <meshStandardMaterial color={leafColor} roughness={0.9} />
                        </mesh>
                        <mesh position={[0, 3.4, 0]} castShadow>
                            <boxGeometry args={[1.5, 0.6, 1.5]} />
                            <meshStandardMaterial color={leafColor} roughness={0.9} />
                        </mesh>
                    </group>
                );
            case 3: // Simple Cube Tree
            default:
                return (
                    <group>
                        <mesh position={[0, 2.8, 0]} castShadow>
                            <boxGeometry args={[1.8, 1.8, 1.8]} />
                            <meshStandardMaterial color={leafColor} roughness={0.9} />
                        </mesh>
                    </group>
                );
        }
    };

    return (
        <group position={position}>
            {/* Trunk */}
            <mesh position={[0, 1.0, 0]} castShadow>
                <boxGeometry args={[0.3, 2.0, 0.3]} />
                <meshStandardMaterial color={trunkColor} roughness={1.0} />
            </mesh>
            {/* Planter Box / Base */}
            {seed % 3 === 0 && (
                <mesh position={[0, 0.2, 0]} castShadow>
                    <boxGeometry args={[0.8, 0.4, 0.8]} />
                    <meshStandardMaterial color="#8B8B8B" roughness={0.9} />
                </mesh>
            )}
            <Leaves />
        </group>
    );
}
