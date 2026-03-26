"use client";

export default function StreetLamp({ position }: { position: [number, number, number] }) {
    // Shared dark wrought-iron material
    const ironMaterial = <meshStandardMaterial color="#111" metalness={0.8} roughness={0.3} />;
    
    return (
        <group position={position}>
            {/* ------ BASE ------ */}
            <mesh position={[0, 0.2, 0]} castShadow>
                <cylinderGeometry args={[0.3, 0.4, 0.4, 16]} />
                {ironMaterial}
            </mesh>
            <mesh position={[0, 0.6, 0]} castShadow>
                <cylinderGeometry args={[0.18, 0.25, 0.4, 16]} />
                {ironMaterial}
            </mesh>
            <mesh position={[0, 1.0, 0]} castShadow>
                <cylinderGeometry args={[0.12, 0.18, 0.4, 16]} />
                {ironMaterial}
            </mesh>
            
            {/* ------ TALL POLE ------ */}
            <mesh position={[0, 3.2, 0]} castShadow>
                <cylinderGeometry args={[0.08, 0.12, 4.0, 16]} />
                {ironMaterial}
            </mesh>
            
            {/* ------ DECORATIVE COLLARS ------ */}
            <mesh position={[0, 1.8, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
                <torusGeometry args={[0.12, 0.04, 16, 32]} />
                {ironMaterial}
            </mesh>
            <mesh position={[0, 3.8, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
                <torusGeometry args={[0.1, 0.03, 16, 32]} />
                {ironMaterial}
            </mesh>
            <mesh position={[0, 4.8, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
                <torusGeometry args={[0.09, 0.03, 16, 32]} />
                {ironMaterial}
            </mesh>
            
            {/* ------ TOP FINIAL ------ */}
            <mesh position={[0, 5.5, 0]} castShadow>
                <sphereGeometry args={[0.08, 16, 16]} />
                {ironMaterial}
            </mesh>

            {/* ------ ORNATE ARM (SHEPHERD'S HOOK) ------ */}
            {/* Main Arch connecting pole x=0 to lantern x=1.6 */}
            <mesh position={[0.8, 4.8, 0]} castShadow>
                <torusGeometry args={[0.8, 0.04, 16, 32, Math.PI]} />
                {ironMaterial}
            </mesh>
            
            {/* Inner Scroll Curl 1 */}
            <mesh position={[0.3, 4.5, 0]} rotation={[0, 0, Math.PI * 0.7]} castShadow>
                <torusGeometry args={[0.25, 0.03, 16, 32, Math.PI * 1.5]} />
                {ironMaterial}
            </mesh>

            {/* Outer Scroll Curl 2 */}
            <mesh position={[1.1, 4.7, 0]} rotation={[0, 0, -Math.PI * 0.2]} castShadow>
                <torusGeometry args={[0.15, 0.02, 16, 32, Math.PI * 1.5]} />
                {ironMaterial}
            </mesh>

            {/* ------ HANGING LANTERN ------ */}
            {/* Lantern Assembly hangs below the arm at x=1.6 */}
            <group position={[1.6, 4.25, 0]}>
                {/* Connecting rod Drop */}
                <mesh position={[0, 0.45, 0]} castShadow>
                    <cylinderGeometry args={[0.02, 0.02, 0.2]} />
                    {ironMaterial}
                </mesh>
                
                {/* Lantern Pointed Roof */}
                <mesh position={[0, 0.2, 0]} castShadow>
                    <cylinderGeometry args={[0.01, 0.35, 0.3, 6]} />
                    {ironMaterial}
                </mesh>
                {/* Roof Finial */}
                <mesh position={[0, 0.4, 0]} castShadow>
                    <sphereGeometry args={[0.03]} />
                    {ironMaterial}
                </mesh>

                {/* Lantern Glowing Glass Body */}
                <mesh position={[0, -0.1, 0]}>
                    <cylinderGeometry args={[0.3, 0.18, 0.45, 6]} />
                    <meshStandardMaterial color="#FFF59D" emissive="#FF9800" emissiveIntensity={3.5} />
                </mesh>

                {/* Thick Frame Top Edge */}
                <mesh position={[0, 0.14, 0]} castShadow>
                    <cylinderGeometry args={[0.32, 0.32, 0.05, 6]} />
                    {ironMaterial}
                </mesh>
                
                {/* Thick Frame Bottom Edge */}
                <mesh position={[0, -0.34, 0]} castShadow>
                    <cylinderGeometry args={[0.2, 0.2, 0.05, 6]} />
                    {ironMaterial}
                </mesh>

                {/* Lantern Bottom Pointed Taper */}
                <mesh position={[0, -0.45, 0]} castShadow>
                    <cylinderGeometry args={[0.18, 0.01, 0.2, 6]} />
                    {ironMaterial}
                </mesh>
                <mesh position={[0, -0.58, 0]} castShadow>
                    <coneGeometry args={[0.03, 0.1, 8]} />
                    {ironMaterial}
                </mesh>
            </group>
        </group>
    );
}

export function Tree({ position }: { position: [number, number, number] }) {
    // Deterministic random based on position so it doesn't change on re-render
    const seed = Math.abs(Math.floor(position[0] * 7 + position[2] * 13));
    const typeIndex = seed % 5;
    const isAutumn = seed % 10 === 0; // 10% chance of an autumn tree
    
    const leafColor = isAutumn ? "#FDD835" : (seed % 2 === 0 ? "#7CB342" : "#4CAF50");
    const trunkColor = "#8D6E63";

    const Leaves = () => {
        switch(typeIndex) {
            case 0: // Pine tree (stacked cones)
                return (
                    <group>
                        <mesh position={[0, 2.0, 0]} castShadow>
                            <coneGeometry args={[1.5, 2.0, 16]} />
                            <meshStandardMaterial color={leafColor} roughness={0.8} />
                        </mesh>
                        <mesh position={[0, 3.2, 0]} castShadow>
                            <coneGeometry args={[1.2, 1.8, 16]} />
                            <meshStandardMaterial color={leafColor} roughness={0.8} />
                        </mesh>
                        <mesh position={[0, 4.4, 0]} castShadow>
                            <coneGeometry args={[0.8, 1.5, 16]} />
                            <meshStandardMaterial color={leafColor} roughness={0.8} />
                        </mesh>
                    </group>
                );
            case 1: // Large Bubble Cluster Tree
                return (
                    <group>
                        <mesh position={[0, 3.2, 0]} castShadow>
                            <sphereGeometry args={[1.4, 16, 16]} />
                            <meshStandardMaterial color={leafColor} roughness={0.8} />
                        </mesh>
                        <mesh position={[0.8, 3.0, 0.5]} castShadow>
                            <sphereGeometry args={[0.8, 16, 16]} />
                            <meshStandardMaterial color={leafColor} roughness={0.8} />
                        </mesh>
                        <mesh position={[-0.7, 2.8, -0.6]} castShadow>
                            <sphereGeometry args={[0.9, 16, 16]} />
                            <meshStandardMaterial color={leafColor} roughness={0.8} />
                        </mesh>
                        <mesh position={[0.2, 4.2, -0.4]} castShadow>
                            <sphereGeometry args={[0.7, 16, 16]} />
                            <meshStandardMaterial color={leafColor} roughness={0.8} />
                        </mesh>
                    </group>
                );
            case 2: // Columnar Stacked Bubble Tree
                return (
                    <group>
                        <mesh position={[0, 2.2, 0]} castShadow>
                            <sphereGeometry args={[1.1, 16, 16]} />
                            <meshStandardMaterial color={leafColor} roughness={0.8} />
                        </mesh>
                        <mesh position={[0, 3.3, 0]} castShadow>
                            <sphereGeometry args={[0.9, 16, 16]} />
                            <meshStandardMaterial color={leafColor} roughness={0.8} />
                        </mesh>
                        <mesh position={[0, 4.2, 0]} castShadow>
                            <sphereGeometry args={[0.7, 16, 16]} />
                            <meshStandardMaterial color={leafColor} roughness={0.8} />
                        </mesh>
                    </group>
                );
            case 3: // Wide Flat Bubble Tree
                return (
                    <group>
                        <mesh position={[0, 2.8, 0]} castShadow scale={[1.4, 0.8, 1.4]}>
                            <sphereGeometry args={[1.2, 16, 16]} />
                            <meshStandardMaterial color={leafColor} roughness={0.8} />
                        </mesh>
                        <mesh position={[0, 3.8, 0]} castShadow scale={[1.2, 0.8, 1.2]}>
                            <sphereGeometry args={[0.8, 16, 16]} />
                            <meshStandardMaterial color={leafColor} roughness={0.8} />
                        </mesh>
                    </group>
                );
            case 4: // Simple Classic Round Tree
            default:
                return (
                    <group>
                        <mesh position={[0, 3.2, 0]} castShadow>
                            <sphereGeometry args={[1.5, 16, 16]} />
                            <meshStandardMaterial color={leafColor} roughness={0.8} />
                        </mesh>
                        <mesh position={[0.7, 2.5, 0]} castShadow>
                            <sphereGeometry args={[0.6, 16, 16]} />
                            <meshStandardMaterial color={leafColor} roughness={0.8} />
                        </mesh>
                    </group>
                );
        }
    };

    return (
        <group position={position}>
            {/* Trunk */}
            <mesh position={[0, 1.0, 0]} castShadow>
                <cylinderGeometry args={[0.15, 0.25, 2.0, 12]} />
                <meshStandardMaterial color={trunkColor} roughness={0.9} />
            </mesh>
            {/* Root flares Base */}
            <mesh position={[0, 0.2, 0]} castShadow>
                <coneGeometry args={[0.45, 0.4, 8]} />
                <meshStandardMaterial color={trunkColor} roughness={0.9} />
            </mesh>

            {/* Tree Leaves generated by style */}
            <Leaves />
        </group>
    );
}
