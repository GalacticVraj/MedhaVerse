"use client";

export default function StreetLamp({ position }: { position: [number, number, number] }) {
    return (
        <group position={position}>
            {/* Pole */}
            <mesh position={[0, 2.5, 0]} castShadow>
                <cylinderGeometry args={[0.06, 0.08, 5]} />
                <meshStandardMaterial color="#555" metalness={0.8} roughness={0.3} />
            </mesh>
            {/* Arm */}
            <mesh position={[0.5, 4.8, 0]} rotation={[0, 0, Math.PI / 6]}>
                <cylinderGeometry args={[0.04, 0.04, 1.2]} />
                <meshStandardMaterial color="#555" metalness={0.8} roughness={0.3} />
            </mesh>
            {/* Lamp head */}
            <mesh position={[0.9, 4.9, 0]}>
                <coneGeometry args={[0.3, 0.4, 8]} />
                <meshStandardMaterial color="#333" metalness={0.5} />
            </mesh>
            {/* Glowing bulb (no pointLight — just emissive mesh to avoid GPU overload) */}
            <mesh position={[0.9, 4.65, 0]}>
                <sphereGeometry args={[0.15]} />
                <meshStandardMaterial color="#FFE082" emissive="#FFE082" emissiveIntensity={5} />
            </mesh>
        </group>
    );
}

export function Tree({ position }: { position: [number, number, number] }) {
    return (
        <group position={position}>
            {/* Trunk */}
            <mesh position={[0, 1, 0]} castShadow>
                <cylinderGeometry args={[0.12, 0.18, 2]} />
                <meshStandardMaterial color="#5D4037" roughness={0.9} />
            </mesh>
            {/* Foliage layers */}
            <mesh position={[0, 2.5, 0]} castShadow>
                <coneGeometry args={[1.2, 2, 8]} />
                <meshStandardMaterial color="#2E7D32" roughness={0.8} />
            </mesh>
            <mesh position={[0, 3.2, 0]} castShadow>
                <coneGeometry args={[0.9, 1.5, 8]} />
                <meshStandardMaterial color="#388E3C" roughness={0.8} />
            </mesh>
            <mesh position={[0, 3.8, 0]} castShadow>
                <coneGeometry args={[0.5, 1, 8]} />
                <meshStandardMaterial color="#43A047" roughness={0.8} />
            </mesh>
        </group>
    );
}
