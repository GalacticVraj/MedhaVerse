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
    private vehiclePositions: Map<string, [number, number, number]> = new Map();

    updateSignal(id: string, data: IntersectionState) {
        this.signals.set(id, data);
    }

    getSignals(): Map<string, IntersectionState> {
        return this.signals;
    }

    updateVehicle(id: string, x: number, z: number) {
        this.vehiclePositions.set(id, [x, 0, z]);
    }

    removeVehicle(id: string) {
        this.vehiclePositions.delete(id);
    }

    reset() {
        this.vehiclePositions.clear();
        this.signals.clear();
    }

    checkCollision(id: string, x: number, z: number, axis: "x" | "z", dir: number): boolean {
        const checkRange = 6.0;
        const sideMargin = 2.0;

        for (const [vid, vpos] of Array.from(this.vehiclePositions)) {
            if (vid === id) continue;
            
            const dx = vpos[0] - x;
            const dz = vpos[2] - z;

            // Check if vehicle is on the same path (side margin)
            if (axis === "x") {
                if (Math.abs(dz) > sideMargin) continue;
                // Check if it's ahead
                if (dir * dx > 0 && Math.abs(dx) < checkRange) return true;
            } else {
                if (Math.abs(dx) > sideMargin) continue;
                // Check if it's ahead
                if (dir * dz > 0 && Math.abs(dz) < checkRange) return true;
            }
        }
        return false;
    }

    // Check if a vehicle at position (x, z) traveling on a given axis should stop
    shouldStop(x: number, z: number, axis: "x" | "z", dir: number): { stop: boolean; slowDown: boolean } {
        for (const [, signal] of Array.from(this.signals)) {
            if (signal.controlsAxis !== axis) continue;

            const sx = signal.position[0];
            const sz = signal.position[2];

            const dx = sx - x;
            const dz = sz - z;

            // Check if signal is in front relative to direction
            const dist = axis === "x" ? dx : dz;
            const absDist = Math.abs(dist);

            // Signal is 'ahead' if dist * dir > 0
            if (dir * dist > 0 && absDist < 10) {
                if (signal.state === "RED") {
                    if (absDist < 6) return { stop: true, slowDown: false };
                    if (absDist < 9) return { stop: false, slowDown: true };
                }
                if (signal.state === "YELLOW" && absDist < 7) {
                    return { stop: false, slowDown: true };
                }
            }
        }
        return { stop: false, slowDown: false };
    }
}

export const trafficStore = new TrafficStateStore();
