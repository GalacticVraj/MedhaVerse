"use client";

import { useState, useCallback, useMemo, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Sky, Stars } from "@react-three/drei";

import Ground from "@/components/city/Ground";
import Roads, { ROAD_PATHS } from "@/components/city/Roads";
import Buildings from "@/components/city/Buildings";
import Vehicle from "@/components/city/Vehicle";
import TrafficLight from "@/components/city/TrafficLight";
import CompanionDrone from "@/components/city/CompanionDrone";
import StreetLamp, { Tree } from "@/components/city/CityProps";
import HUD from "@/components/hud/HUD";
import SignalPanel from "@/components/hud/SignalPanel";
import MissionPanel from "@/components/hud/MissionPanel";
import Tutorial from "@/components/hud/Tutorial";

const CAR_COLORS = ["#00E0FF", "#FF3366", "#00E676", "#FFD600", "#E040FB", "#FF6D00", "#00B0FF", "#76FF03", "#F44336", "#9C27B0"];

const SIGNAL_POSITIONS: { id: string; pos: [number, number, number]; rot: [number, number, number]; init: "RED" | "GREEN"; axis: "x" | "z" }[] = [
    { id: "SIG-A (North)", pos: [5, 0, 5], rot: [0, 0, 0], init: "GREEN", axis: "z" },
    { id: "SIG-B (East)", pos: [-5, 0, 5], rot: [0, Math.PI / 2, 0], init: "RED", axis: "x" },
    { id: "SIG-C (South)", pos: [5, 0, -5], rot: [0, -Math.PI / 2, 0], init: "RED", axis: "x" },
    { id: "SIG-D (West)", pos: [-5, 0, -5], rot: [0, Math.PI, 0], init: "GREEN", axis: "z" },
];

const LAMP_POSITIONS: [number, number, number][] = [
    [12, 0, 5], [-12, 0, 5], [12, 0, -5], [-12, 0, -5],
    [5, 0, 12], [-5, 0, 12], [5, 0, -12], [-5, 0, -12],
    [25, 0, 0], [-25, 0, 0], [0, 0, 25], [0, 0, -25],
    [30, 0, 15], [-30, 0, 15], [30, 0, -15], [-30, 0, -15],
];

const TREE_POSITIONS: [number, number, number][] = [
    [14, 0, 14], [-14, 0, 14], [14, 0, -14], [-14, 0, -14],
    [20, 0, 8], [-20, 0, 8], [8, 0, 20], [-8, 0, 20],
    [8, 0, -20], [-8, 0, -20], [20, 0, -8], [-20, 0, -8],
    [32, 0, 32], [-32, 0, 32], [32, 0, -32], [-32, 0, -32],
    [35, 0, 5], [-35, 0, 5], [5, 0, 35], [-5, 0, 35],
];

export default function Home() {
    const [isRushHour, setIsRushHour] = useState(false);
    const [emergencyVehicles, setEmergencyVehicles] = useState<number[]>([]);
    const [droneMessage, setDroneMessage] = useState("Welcome, Engineer! 🏗️ Click any traffic light to configure it. Complete missions to earn XP!");
    const [droneAlert, setDroneAlert] = useState(false);

    // Tutorial
    const [showTutorial, setShowTutorial] = useState(true);

    // Signal panel
    const [selectedSignal, setSelectedSignal] = useState<string | null>(null);
    const [signalConfigs, setSignalConfigs] = useState<Record<string, { greenDuration: number; redDuration: number; yellowDuration: number }>>({});

    // Mission panel
    const [showMissions, setShowMissions] = useState(false);
    const [score, setScore] = useState(0);
    const [completedMissions, setCompletedMissions] = useState<Set<string>>(new Set());

    const missions = useMemo(() => [
        { id: "m1", title: "First Configuration", description: "Click a traffic signal and apply new timing", target: "Click any signal → adjust sliders → Apply", completed: completedMissions.has("m1"), xp: 50 },
        { id: "m2", title: "Rush Hour Survivor", description: "Activate Rush Hour and keep traffic flowing for 30 seconds", target: "Toggle Rush Hour ON", completed: completedMissions.has("m2"), xp: 100 },
        { id: "m3", title: "Emergency Response", description: "Dispatch an emergency vehicle through the city", target: "Click the Emergency button", completed: completedMissions.has("m3"), xp: 75 },
        { id: "m4", title: "Signal Engineer", description: "Configure all 4 traffic signals with custom timings", target: "Click and configure each of the 4 signals", completed: completedMissions.has("m4"), xp: 200 },
        { id: "m5", title: "Flow Optimizer", description: "Set green duration to under 5 seconds on any signal", target: "Reduce green to < 5s and observe the effect", completed: completedMissions.has("m5"), xp: 150 },
    ], [completedMissions]);

    const level = Math.floor(score / 500) + 1;

    // Vehicle computation
    const vehicleCount = isRushHour ? 20 : 8;
    const vehicles = useMemo(() => {
        return Array.from({ length: vehicleCount }).map((_, i) => ({
            id: i,
            pathIndex: i % ROAD_PATHS.length,
            speed: 3 + Math.random() * 7,
            color: CAR_COLORS[i % CAR_COLORS.length],
            startOffset: Math.random() * 80,
        }));
    }, [vehicleCount]);

    const completeMission = useCallback((missionId: string) => {
        if (!completedMissions.has(missionId)) {
            setCompletedMissions(prev => { const next = new Set(Array.from(prev)); next.add(missionId); return next; });
            const mission = missions.find(m => m.id === missionId);
            if (mission) {
                setScore(prev => prev + mission.xp);
                setDroneMessage(`🎉 Mission Complete: "${mission.title}"! +${mission.xp} XP`);
            }
        }
    }, [completedMissions, missions]);

    const handleRushHour = useCallback(() => {
        setIsRushHour(prev => {
            const next = !prev;
            setDroneMessage(next ? "⚠️ RUSH HOUR! The roads are flooding with traffic!" : "Rush hour ended. Traffic normalizing...");
            setDroneAlert(next);
            if (next) completeMission("m2");
            return next;
        });
    }, [completeMission]);

    const handleEmergency = useCallback(() => {
        setEmergencyVehicles(prev => [...prev, Date.now()]);
        setDroneMessage("🚨 EMERGENCY! Ambulance dispatched — watch it navigate traffic!");
        setDroneAlert(true);
        completeMission("m3");
        setTimeout(() => { setDroneAlert(false); setDroneMessage("Emergency vehicle cleared. Great response time! 🏥"); }, 8000);
    }, [completeMission]);

    const handleSignalClick = (signalId: string) => {
        setSelectedSignal(signalId);
        setDroneMessage(`🔧 Selected ${signalId} — adjust the timing sliders to control traffic flow!`);
    };

    const handleSignalApply = (config: { greenDuration: number; redDuration: number; yellowDuration: number }) => {
        if (!selectedSignal) return;

        // Update config state — flows directly into TrafficLight via props
        setSignalConfigs(prev => ({ ...prev, [selectedSignal]: config }));
        setDroneMessage(`✅ ${selectedSignal} updated! Green: ${config.greenDuration}s, Red: ${config.redDuration}s. Watch how traffic responds!`);
        completeMission("m1");
        if (config.greenDuration < 5) completeMission("m5");

        // Check if all 4 configured
        const newConfigs = { ...signalConfigs, [selectedSignal]: config };
        if (SIGNAL_POSITIONS.every(s => newConfigs[s.id])) completeMission("m4");
    };

    return (
        <div className="w-screen h-screen bg-black relative overflow-hidden">
            <HUD
                onRushHour={handleRushHour}
                onEmergency={handleEmergency}
                isRushHour={isRushHour}
                vehicleCount={vehicleCount + emergencyVehicles.length}
                score={score}
                level={level}
                onMissions={() => setShowMissions(prev => !prev)}
                onTutorial={() => setShowTutorial(true)}
            />

            {showTutorial && <Tutorial onComplete={() => setShowTutorial(false)} />}

            {selectedSignal && (
                <SignalPanel
                    signalId={selectedSignal}
                    config={signalConfigs[selectedSignal] || { greenDuration: 8, redDuration: 8, yellowDuration: 2 }}
                    onApply={handleSignalApply}
                    onClose={() => setSelectedSignal(null)}
                />
            )}

            {showMissions && (
                <MissionPanel
                    score={score}
                    level={level}
                    missions={missions}
                    onClose={() => setShowMissions(false)}
                />
            )}

            <Canvas
                shadows
                camera={{ position: [35, 30, 35], fov: 55, near: 0.1, far: 500 }}
                gl={{ antialias: true, toneMapping: 3 }}
            >
                <ambientLight intensity={0.25} color="#8899BB" />
                <directionalLight
                    position={[50, 80, 30]}
                    intensity={1.8}
                    castShadow
                    shadow-mapSize={[2048, 2048]}
                    shadow-camera-far={200}
                    shadow-camera-left={-60}
                    shadow-camera-right={60}
                    shadow-camera-top={60}
                    shadow-camera-bottom={-60}
                />
                <hemisphereLight args={["#87CEEB", "#1a4a3a", 0.3]} />

                <fog attach="fog" args={["#0a1628", 50, 120]} />
                <Sky sunPosition={[100, 10, 100]} turbidity={10} rayleigh={3} />
                <Stars radius={100} depth={50} count={5000} factor={4} fade speed={1} />

                <OrbitControls
                    enableDamping
                    dampingFactor={0.05}
                    minDistance={8}
                    maxDistance={90}
                    maxPolarAngle={Math.PI / 2.1}
                    target={[0, 0, 0]}
                />

                <Suspense fallback={null}>
                    <Ground />
                    <Roads />
                    <Buildings />

                    {/* Street Lamps */}
                    {LAMP_POSITIONS.map((pos, i) => (
                        <StreetLamp key={`lamp-${i}`} position={pos} />
                    ))}

                    {/* Trees */}
                    {TREE_POSITIONS.map((pos, i) => (
                        <Tree key={`tree-${i}`} position={pos} />
                    ))}

                    {/* Traffic Signals */}
                    {SIGNAL_POSITIONS.map(sig => (
                        <TrafficLight
                            key={sig.id}
                            signalId={sig.id}
                            position={sig.pos}
                            rotation={sig.rot}
                            initialState={sig.init}
                            controlsAxis={sig.axis}
                            config={signalConfigs[sig.id] || { greenDuration: 8, redDuration: 8, yellowDuration: 2 }}
                            onClick={() => handleSignalClick(sig.id)}
                        />
                    ))}

                    {/* Vehicles */}
                    {vehicles.map(v => (
                        <Vehicle
                            key={v.id}
                            path={ROAD_PATHS[v.pathIndex].points}
                            speed={v.speed}
                            color={v.color}
                            startOffset={v.startOffset}
                        />
                    ))}

                    {/* Emergency Vehicles */}
                    {emergencyVehicles.map((id, i) => (
                        <Vehicle
                            key={`emg-${id}`}
                            path={ROAD_PATHS[i % ROAD_PATHS.length].points}
                            speed={14}
                            color="#FFFFFF"
                            isEmergency
                            startOffset={0}
                        />
                    ))}

                    <CompanionDrone message={droneMessage} isAlert={droneAlert} />
                </Suspense>
            </Canvas>
        </div>
    );
}
