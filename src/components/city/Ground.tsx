"use client";
import { useRef } from "react";
import * as THREE from "three";

export default function Ground() {
    const meshRef = useRef<THREE.Mesh>(null);

    return (
        <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
            <planeGeometry args={[800, 800]} />
            <meshStandardMaterial color="#558B2F" roughness={1.0} />
        </mesh>
    );
}
