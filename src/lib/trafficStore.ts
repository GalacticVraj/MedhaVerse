// Global traffic state shared between signals and vehicles
// This avoids React re-render overhead for 60fps game logic

export type SignalState = "RED" | "YELLOW" | "GREEN";

export interface IntersectionState {
    position: [number, number, number];
    state: SignalState;
    // Which axis does this signal control? "x" = controls traffic on x-axis
    controlsAxis: "x" | "z";
}

class TrafficStateStore {
    private signals: Map<string, IntersectionState> = new Map();

    updateSignal(id: string, data: IntersectionState) {
        this.signals.set(id, data);
    }

    getSignals(): Map<string, IntersectionState> {
        return this.signals;
    }

    // Check if a vehicle at position (x, z) traveling on a given axis should stop
    shouldStop(x: number, z: number, travelAxis: "x" | "z"): { stop: boolean; slowDown: boolean } {
        for (const [, signal] of Array.from(this.signals)) {
            const sx = signal.position[0];
            const sz = signal.position[2];

            // Check if vehicle is approaching this intersection
            const distX = Math.abs(x - sx);
            const distZ = Math.abs(z - sz);
            const dist = Math.sqrt(distX * distX + distZ * distZ);

            // Only check signals that control the vehicle's travel axis
            if (dist < 8 && dist > 0.5) {
                // Signal controls perpendicular traffic — if we're on the same axis as the signal controls
                if (signal.controlsAxis === travelAxis) {
                    if (signal.state === "RED") {
                        // Stop within 3-6 units of intersection
                        if (dist < 6) return { stop: true, slowDown: false };
                        if (dist < 8) return { stop: false, slowDown: true };
                    }
                    if (signal.state === "YELLOW") {
                        if (dist < 5) return { stop: false, slowDown: true };
                    }
                }
            }
        }
        return { stop: false, slowDown: false };
    }
}

// Singleton
export const trafficStore = new TrafficStateStore();
